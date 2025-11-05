from django.shortcuts import render
from django.http import JsonResponse
from bebidas.models import Marca, Bebida

def index(request):
    return render(request, 'Index.html')

def cadastro(request):
    return render(request, 'cadastro.html')

def tabela(request):
    marcas = Marca.objects.all()
    return render(request, 'tabela.html', {'marcas': marcas})
def login_view(request):
    return render(request, 'login.html')

# Nova API para buscar marcas
def api_marcas(request):
    marcas = Marca.objects.all()
    data = [
        {
            'id': marca.id,
            'nome': marca.nome,
            'imagem': marca.imagem.url if marca.imagem else ''
        }
        for marca in marcas
    ]
    return JsonResponse(data, safe=False)

# Nova API para buscar bebidas
def api_bebidas(request):
    bebidas = Bebida.objects.all()
    data = [
        {
            'id': bebida.id,
            'nome': bebida.nome,
            'valor': str(bebida.valor),
            'quantidade': bebida.quantidade,
            'alcoolico': bebida.get_alcoolico_display(),
            'marca': bebida.marca.nome,
            'imagem': bebida.imagem.url if bebida.imagem else ''
        }
        for bebida in bebidas
    ]
    return JsonResponse(data, safe=False)