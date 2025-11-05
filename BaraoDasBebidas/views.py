from django.shortcuts import render
from django.http import JsonResponse
from bebidas.models import Marca, Bebida
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'Index.html')

def cadastro(request):
    msg = None
    marcas = Marca.objects.all()
    if request.method == "POST":
        tipo = request.POST.get("tipo")
        if tipo == "marca":
            nome = request.POST.get("nome_marca")
            imagem = request.FILES.get("imagem_marca")
            marca = Marca(nome=nome, imagem=imagem)
            marca.save()
            msg = "Marca cadastrada com sucesso!"
        elif tipo == "bebida":
            nome = request.POST.get("nome_bebida")
            valor = request.POST.get("valor_bebida")
            quantidade = request.POST.get("quantidade_bebida")
            alcoolico = request.POST.get("alcoolico_bebida")
            marca_id = request.POST.get("marca_bebida")
            imagem = request.FILES.get("imagem_bebida")
            marca = Marca.objects.get(id=marca_id)
            bebida = Bebida(
                nome=nome,
                valor=valor,
                quantidade=quantidade,
                alcoolico=alcoolico,
                marca=marca,
                imagem=imagem
            )
            bebida.save()
            msg = "Bebida cadastrada com sucesso!"
    # Atualiza lista de marcas ao renderizar
    marcas = Marca.objects.all()
    return render(request, 'cadastro.html', {'marcas': marcas, 'msg': msg})

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

@csrf_exempt
def delete_bebida(request):
    if request.method == "POST":
        bebida_id = request.POST.get("id")
        try:
            Bebida.objects.get(id=bebida_id).delete()
            return JsonResponse({"ok": True})
        except:
            return JsonResponse({"ok": False}, status=404)
    return JsonResponse({"ok": False}, status=405)

@csrf_exempt
def delete_marca(request):
    if request.method == "POST":
        marca_id = request.POST.get("id")
        try:
            Marca.objects.get(id=marca_id).delete()
            return JsonResponse({"ok": True})
        except:
            return JsonResponse({"ok": False}, status=404)
    return JsonResponse({"ok": False}, status=405)