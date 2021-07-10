from django.urls import path

from .views import *

urlpatterns = [
    path('index', index, name='home'),
    # returns all articles ids, needed for corpus navigation view
    path('articles/', ArticleIDSListView.as_view()),
    # returns a single article
    # path('article/<int:pk>', ArticleListCreate.as_view()),
    path('article/<int:pk>', get_article),
    path('article/<int:id>/<int:ds_id>', get_articleByID),
    path('article/<int:id>/<int:ds_id>/scores', getScoresByArticleID),
    path('article/halucination', getHallucinationByArticleID),
    path('article/relations', getRelationByArticleID),
    path('article/entities', getEntitiesByArticleID),
    path('article/heatmap', getArticleHMByArticleID),
    # path('article/<int:id>/scores', getScoresByArticleID),
    path('articleModelGroup', articleModelGroup),
    path('article/<int:ds_id>/random', getRandomArticle),
    path('article/<int:id>/novels', getHalucinationsByArticleId),
    path('dataset/<int:id>/models', DatasetModelsView.as_view()),
    path('dataset/<int:id>/models_stat', getDatasetModelsStat),
    path('dataset/<int:id>/groups', DatasetGroupsView.as_view()),
    path('smodel/<int:pk>', SModelRetriveView.as_view()),
    path('smodel/all/', getAllModels),
    path('smodel/<str:name>/<int:id>', getSModelInfo),
    path('smodel/<str:smodel_id>/<int:ds_id>/articlemaps', getArticleMaps),
    path('smgroup/<int:pk>', SModelsGroupListView.as_view()),
    # path('user_sm_group/', get_user_models_group),
    path('smodel/', SModelListView.as_view()),
    path('group/<int:article>/<int:group>', getSummariesByArticleIDandGroupID),  # ArticleSummaries.as_view()
    path('summary/<int:article>/<str:smodel>', getSummariesByArticleIDandModelID),  # SummaryListView.as_view()
    path('smodel/<str:smodel>/all', AllSummaryListView.as_view())

]