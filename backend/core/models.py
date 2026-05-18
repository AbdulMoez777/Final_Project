from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# --- Your Existing Activity Table ---
class AIActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    activity_type = models.CharField(max_length=50) # Will be 'Summary', 'Quiz', or 'Flashcards'
    title = models.CharField(max_length=200)        # e.g., 'Interactive AI Quiz'
    file_name = models.CharField(max_length=200)    # e.g., 'notes.pdf' or 'Pasted Notes'
    
    content = models.TextField(blank=True, null=True) 
    score = models.IntegerField(blank=True, null=True) 
    total_questions = models.IntegerField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} - {self.title}"


# 👇 ADDED: The New Profile Table for Avatar Pictures 👇
class UserProfile(models.Model):
    # This securely links this profile to the built-in Django User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # This is where the uploaded image will be saved!
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    

class DailyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Goal: {self.text}"