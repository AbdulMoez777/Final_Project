from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate 
from transformers import pipeline
import json
import google.generativeai as genai




# Gemini APi
genai.configure(api_key="AIzaSyBpavci2yP5zbCahxzRg6SMzEwkTn4TMDk")


print("Loading AI Model... please wait...")
summarizer = pipeline("summarization", model="Falconsai/text_summarization")

quiz_generator = pipeline("text2text-generation", model="google/flan-t5-small")
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
    

# Quiz View Function
@api_view(['POST'])
def generate_quiz(request):
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        
        prompts = [
            f"generate a question about the main concept of: {text}",
            f"generate a detailed question about: {text}",
            f"generate a true or false question about: {text}"
        ]
        
        generated_questions = []

        # LOOP: Ask the AI one by one
        for prompt in prompts:
            result = quiz_generator(prompt, max_length=64, do_sample=True, temperature=0.9)
            question = result[0]['generated_text']
            
            # Basic cleanup: Ensure it has a question mark
            if not question.endswith('?'):
                question += '?'
            
            generated_questions.append(question)

        # Return the list of 3 questions
        return Response({'quiz': generated_questions}, status=status.HTTP_200_OK)
        
    except Exception as e:
        print("Quiz Error:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

# 👇 NEW: The updated Gemini Flashcards View Function
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