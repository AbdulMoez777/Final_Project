from django.db import models
from django.contrib.auth.models import User

class AIActivity(models.Model):
    activity_type = models.CharField(max_length=50) # Will be 'Summary', 'Quiz', or 'Flashcards'
    title = models.CharField(max_length=200)        # e.g., 'Interactive AI Quiz'
    file_name = models.CharField(max_length=200)    # e.g., 'notes.pdf' or 'Pasted Notes'
    created_at = models.DateTimeField(auto_now_add=True) # Automatically saves the exact time

    def __str__(self):
        return f"{self.activity_type} - {self.title}"