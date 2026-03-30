from django.contrib import admin
from django.urls import path
from core.views import signup, login_view, summarize_text, manage_users, generate_quiz, generate_flashcards, extract_text_from_file, get_recent_activity


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup),
    path('api/login/', login_view), # <--- Add this new line
    path('api/summarize/', summarize_text), # <--- Add this line
    path('api/generate-quiz/', generate_quiz),
    path('api/generate-flashcards/', generate_flashcards),

    path('api/users/', manage_users),          # To Get List
    path('api/users/<int:user_id>/', manage_users), # To Delete specific user
    path('api/extract-text/', extract_text_from_file), # Extract text from PDF or PPTX
    path('api/recent-activity/', get_recent_activity, name='recent_activity'),
]