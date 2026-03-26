from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate 
from transformers import pipeline
import json
import google.generativeai as genai
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import parser_classes
import PyPDF2
from pptx import Presentation
import requests

# Gemini APi
genai.configure(api_key="AIzaSyBpavci2yP5zbCahxzRg6SMzEwkTn4TMDk")

print("Loading AI Model... please wait...")
summarizer = pipeline("summarization", model="Falconsai/text_summarization")
print("AI Model Ready!")

@api_view(['POST'])
def signup(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=email).exists():
            return Response({'error': 'This email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)
        return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# LOGIN: Return 'is_admin' status
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)

    if user is not None:
        # Check if user is an Admin (is_staff)
        return Response({
            'message': 'Login Successful!',
            'is_admin': user.is_staff  
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    

# 👇 NEW: The completely upgraded Gemini Quiz Generator
@api_view(['POST'])
def generate_quiz(request):
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # We give Gemini exact instructions
        prompt = f"""
        You are an expert teacher. Create a 5-question multiple-choice quiz based ONLY on the text below. 
        Return ONLY a JSON array of objects. Do not include markdown formatting, greetings, or explanations.
        Each object must have exactly these keys: "question", "options" (an array of 4 strings), and "answer" (a string matching one option).
        
        Text to convert into a quiz: {text}
        """

        # Call your active Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        # Clean up the response just in case
        ai_text = response.text.strip()
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        elif ai_text.startswith("```"):
            ai_text = ai_text[3:]
            
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]

        # Convert to a list and send to React
        quiz_data = json.loads(ai_text.strip()) 
        return Response({'quiz': quiz_data}, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response({'error': 'The AI did not format the quiz correctly. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print("Quiz Error:", str(e))
        return Response({'error': 'Failed to generate quiz. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# Manage Users (Get List & Delete)
@api_view(['GET', 'DELETE'])
def manage_users(request, user_id=None):
    if request.method == 'GET':
        # Return a list of all users (id, email, is_staff status)
        users = User.objects.all().values('id', 'username', 'email', 'is_staff', 'date_joined')
        return Response(users, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        try:
            user_to_delete = User.objects.get(id=user_id)
            user_to_delete.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def summarize_text(request):
    try:
        text_to_summarize = request.data.get('text')
        
        if not text_to_summarize:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        
        summary_result = summarizer(text_to_summarize, max_length=1000, min_length=30, do_sample=False)
        
        
        summary_text = summary_result[0]['summary_text']

        return Response({'summary': summary_text}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# The updated Gemini Flashcards View Function
@api_view(['POST'])
def generate_flashcards(request):
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        prompt = f"""
        Create study flashcards from the following notes. 
        Return ONLY a JSON array of objects, where each object has a 'question' and an 'answer'. 
        Do not include any extra text, markdown formatting like ```json, or greetings. Just the raw JSON.
        
        Notes: {text}
        """

        
        # THIS LINE to use the active 2.5 model
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        # Gemini sometimes wraps JSON in markdown blocks, this cleans it up so React doesn't crash
        ai_text = response.text.strip()
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        elif ai_text.startswith("```"):
            ai_text = ai_text[3:]
            
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]

        # Convert the clean string into a real Python list
        flashcards = json.loads(ai_text.strip()) 

        return Response(flashcards, status=status.HTTP_200_OK)
        
    except Exception as e:
        print("Flashcard Error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
#  The File Extraction Endpoint
@api_view(['POST'])
@parser_classes([MultiPartParser]) # This tells Django to expect a file, not JSON
def extract_text_from_file(request):
    file_obj = request.FILES.get('file')
    
    if not file_obj:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    filename = file_obj.name.lower()
    extracted_text = ""

    try:
        # 1. Handle Text Files
        if filename.endswith('.txt'):
            extracted_text = file_obj.read().decode('utf-8')
        
        # 2. Handle PDF Files
        elif filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(file_obj)
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() + "\n"
                
        # 3. Handle PowerPoint Files
        elif filename.endswith('.pptx'):
            ppt = Presentation(file_obj)
            for slide in ppt.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        extracted_text += shape.text + "\n"
        
        # 4. Block other file types
        else:
            return Response({'error': 'Please upload a PDF, PPTX, or TXT file.'}, status=status.HTTP_400_BAD_REQUEST)

        # Return the clean text to React
        return Response({'text': extracted_text.strip()}, status=status.HTTP_200_OK)

    except Exception as e:
        print("File Extraction Error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)