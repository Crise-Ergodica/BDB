from django.db import models

class Marca(models.Model):
    nome = models.CharField(max_length=100)
    imagem = models.ImageField(upload_to='marcas/')
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'


class Bebida(models.Model):
    OPCOES_ALCOOLICO = [
        ('sim', 'Sim'),
        ('nao', 'Não'),
    ]
    
    nome = models.CharField(max_length=200)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.IntegerField()
    alcoolico = models.CharField(max_length=3, choices=OPCOES_ALCOOLICO)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name='bebidas')
    imagem = models.ImageField(upload_to='bebidas/')
    data_cadastro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = 'Bebida'
        verbose_name_plural = 'Bebidas'
        ordering = ['-data_cadastro']
