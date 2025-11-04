from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('tabela/', views.tabela, name='tabela'),
    path('login/', views.login_view, name='login'),
    path('api/marcas/', views.api_marcas, name='api_marcas'),
    path('api/bebidas/', views.api_bebidas, name='api_bebidas'),
]

# Servir arquivos de mídia e estáticos durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])