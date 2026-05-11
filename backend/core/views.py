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
from .models import AIActivity, UserProfile
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import parser_classes

# Gemini APi
genai.configure(api_key="AIzaSyCZlulD72Cm69i4uMaqSN46WESwusCgCM0")

print("Loading AI Model... please wait...")



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
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'message': 'Login Successful!',
            'is_admin': user.is_staff  
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    

#Gemini Quiz Generator
@api_view(['POST'])
def generate_quiz(request):
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        prompt = f"""
        You are an expert teacher. Create a 10-question multiple-choice quiz based ONLY on the text below. 
        Return ONLY a JSON array of objects. Do not include markdown formatting, greetings, or explanations.
        Each object must have exactly these keys: "question", "options" (an array of 4 strings), and "answer" (a string matching one option).
        
        Text to convert into a quiz: {text}
        """

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        ai_text = response.text.strip()
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        elif ai_text.startswith("```"):
            ai_text = ai_text[3:]
            
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]

        # 1. First, we create the quiz_data variable
        quiz_data = json.loads(ai_text.strip()) 
        
        # 2. Then, we return it to React
        return Response({'quiz': quiz_data}, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response({'error': 'The AI did not format the quiz correctly. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        error_message = str(e)
        print("Quiz Error:", error_message)
        
        # Check if Google blocked us for going too fast
        if "429" in error_message or "Quota" in error_message:
            return Response(
                {'error': 'Whoa there! The AI is taking a quick breather. Please wait 60 seconds and try again.'}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
            
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
@permission_classes([IsAuthenticated])
def summarize_text(request):
    text_to_summarize = request.data.get('text')
    
    if not text_to_summarize:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
       
        prompt = f"""
        You are an expert tutor. Please provide a clear, concise, and highly educational summary of the following text.
        Highlight the most important key concepts. Do not include markdown like ```json or greetings.
        
        Text to summarize: {text_to_summarize}
        """
        
       
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        summary_text = response.text.strip()
        
        
        AIActivity.objects.create(
            user=request.user,
            activity_type="Summary",
            title="Document Summary",
            file_name="Pasted Notes",
            content=summary_text 
        )

        return Response({'summary': summary_text}, status=status.HTTP_200_OK)

    except Exception as e:
        error_message = str(e)
        print("Summary Error:", error_message)
        
        # Catch the 60-second speed limit just like we did for the others!
        if "429" in error_message or "Quota" in error_message:
            return Response(
                {'error': 'Whoa there! The AI is taking a quick breather. Please wait 60 seconds and try again.'}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
            
        return Response({'error': 'Failed to generate summary. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# The updated Gemini Flashcards View Function
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
        
        AIActivity.objects.create(
            user=request.user,
            activity_type="Flashcards",
            title="Study Flashcards",
            file_name="Pasted Notes",
            content=json.dumps(flashcards)
        )

        return Response(flashcards, status=status.HTTP_200_OK)
        
    except Exception as e:
        error_message = str(e)
        print("Flashcard Error:", error_message)
        
        # Check if Google blocked us for going too fast
        if "429" in error_message or "Quota" in error_message:
            return Response(
                {'error': 'Whoa there! The AI is taking a quick breather. Please wait 60 seconds and try again.'}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
            
        return Response({'error': 'Failed to generate flashcards. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
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

    # ADDED: This is the function React calls to get the history!
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_activity(request):
    try:
        activities = AIActivity.objects.filter(user=request.user).order_by('-created_at')[:5]
        
        recent_list = []
        for act in activities:
            recent_list.append({
                "id": act.id,
                "type": act.activity_type,
                "title": act.title,
                "file": act.file_name,
                "time": act.created_at.strftime("%b %d, %Y - %H:%M"),
                "score": act.score, 
                "total": act.total_questions
            })
            
        total_quizzes = AIActivity.objects.filter(user=request.user, activity_type="Quiz").count()
        total_flashcards = AIActivity.objects.filter(user=request.user, activity_type="Flashcards").count()
        total_files = AIActivity.objects.filter(user=request.user).exclude(file_name="Pasted Notes").values('file_name').distinct().count()

        # 👇 1. Grab the user's profile to get the picture URL
        from .models import UserProfile
        profile_obj = UserProfile.objects.filter(user=request.user).first()
        avatar_url = None
        if profile_obj and profile_obj.profile_picture:
            avatar_url = request.build_absolute_uri(profile_obj.profile_picture.url)

        # Send EVERYTHING back to React in one package
        dashboard_data = {
            "recent_activity": recent_list,
            "progress_stats": {
                "quizzes_taken": total_quizzes,
                "flashcards_reviewed": total_flashcards,
                "files_uploaded": total_files
            },
            "username": request.user.first_name if request.user.first_name else request.user.username,
            "avatar": avatar_url # 👇 2. Send the picture URL to the Dashboard!
        }
            
        return Response(dashboard_data, status=status.HTTP_200_OK)
        
    except Exception as e: 
        print("Activity Fetch Error:", str(e))
        return Response({'error': 'Failed to fetch activity'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_quiz_score(request):
    try:
        # Get the final score data from React
        final_score = request.data.get('score')
        total_q = request.data.get('total')
        quiz_data = request.data.get('quiz_data')
        
        # Save it to the database!
        AIActivity.objects.create(
            user=request.user,
            activity_type="Quiz",
            title="Interactive AI Quiz",
            file_name="Completed Quiz",
            score=final_score,
            total_questions=total_q,
            content=json.dumps(quiz_data) if quiz_data else None
        )
        return Response({'message': 'Score saved successfully!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# Add to views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_detail(request, activity_id):
    try:
        # 1. Find the specific activity. 
        # (user=request.user ensures they can't spy on other people's data!)
        activity = AIActivity.objects.get(id=activity_id, user=request.user)
        
        return Response({
            "id": activity.id,
            "type": activity.activity_type,
            "title": activity.title,
            "content": activity.content, 
            "time": activity.created_at.strftime("%b %d, %Y")
        }, status=status.HTTP_200_OK)
        
    except AIActivity.DoesNotExist:
        return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, JSONParser]) # Tells Django it is allowed to read Files AND Text
def user_profile(request):
    # Safely get or create the connected profile table
    profile_obj, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        display_name = request.user.first_name if request.user.first_name else request.user.username.split('@')[0]
        
        avatar_url = None
        if profile_obj.profile_picture:
            avatar_url = request.build_absolute_uri(profile_obj.profile_picture.url)
            
        return Response({
            'email': request.user.email,
            'name': display_name,
            'avatar': avatar_url, 
            'date_joined': request.user.date_joined.strftime("%B %d, %Y")
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        updated = False
        
        # 1. Did they send a new name?
        new_name = request.data.get('name')
        if new_name:
            request.user.first_name = new_name
            request.user.save()
            updated = True
            
        # 2. Did they send a profile picture?
        if 'profile_picture' in request.FILES:
            profile_obj.profile_picture = request.FILES['profile_picture']
            profile_obj.save()
            updated = True

        # 3. If they updated AT LEAST one of them, return success!
        if updated:
            return Response({'message': 'Profile updated successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No data provided to update.'}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        request.user.delete()
        return Response({'message': 'Account deleted successfully!'}, status=status.HTTP_200_OK)