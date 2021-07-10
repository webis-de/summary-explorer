from django.contrib import admin

from api.models import *

admin.site.site_header = 'SumViz ::: Control Panel'


@admin.register(SModel)
class SModel_admin(admin.ModelAdmin):
    fieldsets = [(None, {'fields': ['name', 'title', 'raw']})]  # , 'group'
    list_display = ('name', 'title', 'url')  # , 'group'


# @admin.register(SModel_group)
# class SModel_group_admin(admin.ModelAdmin):
#     fieldsets = [(None, {'fields': ['name', 'description', 'users']})]
#     list_display = ('name', 'description')


@admin.register(Evaluation_criteriums_group)
class Evaluation_criteriums_group_admin(admin.ModelAdmin):
    fieldsets = [(None, {'fields': ['title', 'description']})]
    list_display = ('title', 'description')


@admin.register(Evaluation_criteria)
class Evaluation_criteria_admin(admin.ModelAdmin):
    fieldsets = [(None, {'fields': ['title', 'description', 'order']})]  # 'group',
    list_display = ('title', 'description', 'order')  # 'group',
