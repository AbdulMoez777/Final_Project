from django.contrib import admin
from django.urls import path
from core.views import signup, login_view, summarize_text

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup),
    path('api/login/', login_view), # <--- Add this new line
    path('api/summarize/', summarize_text), # <--- Add this line
]