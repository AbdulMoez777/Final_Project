from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate # <--- New Import
from transformers import pipeline


# --- LOAD THE AI MODEL ONCE (Global Variable) ---
# This downloads the model the first time you run the server
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

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Django checks if the email and password match
    user = authenticate(username=email, password=password)

    if user is not None:
        return Response({'message': 'Login Successful!'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # --- NEW: SUMMARIZATION FUNCTION ---
@api_view(['POST'])
def summarize_text(request):
    try:
        text_to_summarize = request.data.get('text')
        
        if not text_to_summarize:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Run the AI model
        # max_length=1000, min_length=30, do_sample=False (from your snippet)
        summary_result = summarizer(text_to_summarize, max_length=1000, min_length=30, do_sample=False)
        
        # Extract just the text from the result
        summary_text = summary_result[0]['summary_text']

        return Response({'summary': summary_text}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)