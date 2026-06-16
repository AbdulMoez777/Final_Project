from django.contrib import admin
from django.urls import path
from core.views import signup, login_view, summarize_text, manage_users, generate_quiz, generate_flashcards, extract_text_from_file, get_recent_activity, save_quiz_score
from . import views

#  ADDED THESE TWO IMPORTS FOR PROFILE PICTURES
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup),
    path('api/login/', login_view), 
    path('api/auth/google/', views.google_login),
    path('api/summarize/', summarize_text), 
    path('api/generate-quiz/', generate_quiz),
    path('api/generate-flashcards/', generate_flashcards),
    path('api/users/', manage_users),          
    path('api/users/<int:user_id>/', manage_users), 
    path('api/extract-text/', extract_text_from_file), 
    path('api/recent-activity/', get_recent_activity, name='recent_activity'),
    path('api/save-score/', save_quiz_score, name='save_score'),
    path('api/activity/<int:activity_id>/', views.get_activity_detail),
    path('api/goals/', views.manage_goals),             
    path('api/goals/<int:goal_id>/', views.manage_goals), 
    path('api/chat/', views.quick_chat),
    path('api/profile/', views.user_profile),
    path('api/extract-youtube/', views.extract_youtube_transcript, name='extract_youtube'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)