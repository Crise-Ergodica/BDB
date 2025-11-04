import os
from django.core.management.base import BaseCommand
# O from django.db import models não é necessário aqui
from bebidas.models import Marca, Bebida

# --- Variáveis de Dados de Teste ---
MARCAS_TESTE = [
    'Coca-Cola', 'Ambev', 'Heineken', 'Natura', 'Do Bem'
]

BEBIDAS_TESTE = {
    'Coca-Cola': [
        {'nome': 'Coca-Cola Lata', 'valor': 5.50, 'quantidade': 350, 'alcoolico': 'nao'},
        {'nome': 'Kuat Guaraná', 'valor': 4.00, 'quantidade': 350, 'alcoolico': 'nao'},
    ],
    'Ambev': [
        {'nome': 'Guaraná Antarctica', 'valor': 4.50, 'quantidade': 350, 'alcoolico': 'nao'},
        {'nome': 'Brahma Duplo Malte', 'valor': 6.00, 'quantidade': 600, 'alcoolico': 'sim'},
    ],
    'Heineken': [
        {'nome': 'Heineken Lager', 'valor': 8.50, 'quantidade': 330, 'alcoolico': 'sim'},
        {'nome': 'Amstel Lager', 'valor': 5.00, 'quantidade': 473, 'alcoolico': 'sim'},
    ],
    'Natura': [
        {'nome': 'Água de Côco', 'valor': 7.00, 'quantidade': 500, 'alcoolico': 'nao'},
        {'nome': 'Chá Mate', 'valor': 5.00, 'quantidade': 300, 'alcoolico': 'nao'},
    ],
    'Do Bem': [
        {'nome': 'Suco de Laranja', 'valor': 8.90, 'quantidade': 1000, 'alcoolico': 'nao'},
        {'nome': 'Suco de Morango', 'valor': 8.90, 'quantidade': 1000, 'alcoolico': 'nao'},
    ],
}
# -----------------------------------

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados iniciais de marcas e bebidas.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Iniciando o seeding de dados...'))

        # Armazenar as instâncias de Marca para usar nas Bebidas
        marcas_criadas = {}

        # --- 1. POPULANDO MARCAS ---
        self.stdout.write(self.style.HTTP_INFO('\nCriando Marcas (5)...'))
        for nome_marca in MARCAS_TESTE:
            try:
                marca, created = Marca.objects.get_or_create(
                    nome=nome_marca,
                    defaults={}
                )

                marcas_criadas[nome_marca] = marca

                if created:
                    self.stdout.write(self.style.SUCCESS(f'✅ Marca "{nome_marca}" criada.'))
                else:
                    self.stdout.write(self.style.WARNING(f'⚠️ Marca "{nome_marca}" já existe.'))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Erro ao criar a Marca "{nome_marca}": {e}'))

        # ----------------------------------------------------
        # --- 2. POPULANDO BEBIDAS (INDENTAÇÃO CORRIGIDA!) ---
        # ----------------------------------------------------
        self.stdout.write(self.style.HTTP_INFO('\nCriando Bebidas (2 por Marca)...'))
        for nome_marca, bebidas_lista in BEBIDAS_TESTE.items():
            if nome_marca in marcas_criadas:
                marca_obj = marcas_criadas[nome_marca]

                for dados_bebida in bebidas_lista:
                    try:  # Reintroduzindo o try/except para estabilidade
                        dados_completos = {
                            **dados_bebida,
                            'marca': marca_obj,
                        }

                        bebida, created = Bebida.objects.get_or_create(
                            nome=dados_bebida['nome'],
                            marca=marca_obj,
                            defaults=dados_completos
                        )

                        if created:
                            self.stdout.write(self.style.SUCCESS(f'  - Bebida "{bebida.nome}" criada.'))
                        else:
                            self.stdout.write(self.style.WARNING(f'  - Bebida "{bebida.nome}" já existe.'))

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(
                            f'  - ❌ Erro ao criar Bebida "{dados_bebida["nome"]}" da Marca {nome_marca}: {e}'))
                else:
                    self.stdout.write(
                        self.style.WARNING(f'Marca "{nome_marca}" não encontrada/criada. Pulando bebidas.'))

        self.stdout.write(self.style.SUCCESS('\n\n--- Seeding de dados concluído com sucesso! ---'))