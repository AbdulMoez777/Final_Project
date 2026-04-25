from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class AIActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    activity_type = models.CharField(max_length=50) # Will be 'Summary', 'Quiz', or 'Flashcards'
    title = models.CharField(max_length=200)        # e.g., 'Interactive AI Quiz'
    file_name = models.CharField(max_length=200)    # e.g., 'notes.pdf' or 'Pasted Notes'
    # Added these to track scores and save the actual generated content!
    content = models.TextField(blank=True, null=True) 
    score = models.IntegerField(blank=True, null=True) 
    total_questions = models.IntegerField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True) # Automatically saves the exact time

    def __str__(self):
        return f"{self.activity_type} - {self.title}"