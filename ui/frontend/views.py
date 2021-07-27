from django.shortcuts import render, redirect

from api.models import ModelDataset, SModel


def index(request):
    context = {
    }
    return render(request, 'frontend/index.html', context)


def main(request):
    context = {
    }
    return render(request, 'frontend/main.html', context)


def models(request):
    models_list = SModel.objects.all().order_by("name")
    models_arr = []
    for model in models_list:
        models_arr.append({"name": model.name})
    context = {
        "models": models_list
    }
    return render(request, 'frontend/models.html', context)


def about(request):
    context = {
    }
    return render(request, 'frontend/about.html', context)

def credits(request):
    context = {
    }
    return render(request, 'frontend/credits.html', context)