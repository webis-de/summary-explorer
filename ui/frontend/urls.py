from django.urls import path
from . import views


urlpatterns = [
    path('', views.index),
    path('home', views.index),
    path('main', views.main),
    path('article', views.main),
    path('models', views.main),
    path('metrics', views.metrics),
]