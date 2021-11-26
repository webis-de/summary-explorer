from django.shortcuts import render, redirect

from api.models import ModelDataset, SModel, Dataset


def index(request):
    datasets = Dataset.objects.all()
    datasets_list = [ {"id": dataset.pk, "name": dataset.name, "description_items": dataset.description.split("\n")} for dataset in datasets]
    context = {
        "datasets": datasets_list
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