
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".principalCerveja");
  const marcaContainer = document.querySelector(".marca");

  try {
    // Buscar marcas do banco de dados
    const responseMarcas = await fetch('/api/marcas/');
    const marcas = await responseMarcas.json();
    
    // Limpar e exibir marcas
    marcaContainer.innerHTML = '';
    marcas.forEach(marca => {
      const a = document.createElement("a");
      a.href = "#";

      const img = document.createElement("img");
      img.className = "imgMarca";
      img.src = marca.imagem;
      img.alt = `Marca: ${marca.nome}`;

      a.appendChild(img);
      marcaContainer.appendChild(a);
    });

    // Buscar bebidas do banco de dados
    const responseBebidas = await fetch('/api/bebidas/');
    const bebidas = await responseBebidas.json();
    
    // Limpar container e adicionar título
    container.innerHTML = '<h2 class="tituloProduto">Novos Produtos</h2>';
    
    // Criar div para as bebidas
    const cervejaDiv = document.createElement("div");
    cervejaDiv.className = "cerveja";
    
    bebidas.forEach(bebida => {
      const div = document.createElement("div");
      div.className = "produto-item";

      const btnFavorito = document.createElement("button");
      btnFavorito.className = "favorito";
      btnFavorito.textContent = "❤️";

      const img = document.createElement("img");
      img.src = bebida.imagem;
      img.alt = `Imagem da bebida ${bebida.nome}`;
      img.width = 100;

      const nome = document.createElement("p");
      nome.textContent = bebida.nome;

      const valor = document.createElement("p");
      valor.textContent = `R$ ${parseFloat(bebida.valor).toFixed(2)}`;

      const alcoolico = document.createElement("p");
      alcoolico.textContent = `Alcoólico: ${bebida.alcoolico}`;

      div.appendChild(btnFavorito);
      div.appendChild(img);
      div.appendChild(nome);
      div.appendChild(valor);
      div.appendChild(alcoolico);

      cervejaDiv.appendChild(div);
    });
    
    container.appendChild(cervejaDiv);
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    container.innerHTML = '<h2 class="tituloProduto">Erro ao carregar produtos</h2>';
  }
});
