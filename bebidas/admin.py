from django.contrib import admin
from .models import Marca, Bebida

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ['nome']
    search_fields = ['nome']

@admin.register(Bebida)
class BebidaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'marca', 'valor', 'quantidade', 'alcoolico']
    list_filter = ['marca', 'alcoolico']
    search_fields = ['nome']
