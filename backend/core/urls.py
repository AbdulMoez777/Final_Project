from django.contrib import admin
from django.urls import path
from core.views import signup, login_view, summarize_text, manage_users, generate_quiz

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup),
    path('api/login/', login_view), # <--- Add this new line
    path('api/summarize/', summarize_text), # <--- Add this line
    path('api/generate-quiz/', generate_quiz),


    path('api/users/', manage_users),          # To Get List
    path('api/users/<int:user_id>/', manage_users), # To Delete specific user
]