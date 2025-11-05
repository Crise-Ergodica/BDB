// Carregar e filtrar Bebidas e Marcas via API Django, preenchendo as tabelas dinamicamente
document.addEventListener('DOMContentLoaded', () => {
  let marcasCache = [];

  function fetchMarcas() {
    return fetch('/api/marcas/')
      .then(r => r.json())
      .then(data => {
        marcasCache = data;
        preencherTabelaMarcas(data);
      });
  }

  function fetchBebidas() {
    return fetch('/api/bebidas/')
      .then(r => r.json())
      .then(data => {
        preencherTabelaBebidas(data);
      });
  }

  function preencherTabelaMarcas(marcas) {
    const tbody = document.querySelector('#tabela-marcas tbody');
    const busca = document.getElementById('busca-nome-marca').value.toLowerCase();
    tbody.innerHTML = '';
    marcas.filter(m => m.nome.toLowerCase().includes(busca)).forEach(marca => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${marca.nome}</td>
        <td>${marca.imagem ? `<img src="${marca.imagem}" alt="${marca.nome}">` : ''}</td>
        <td><button class="excluir-marca" data-id="${marca.id}">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });

    // Adiciona evento de exclusão
    tbody.querySelectorAll('.excluir-marca').forEach(btn => {
      btn.onclick = function() {
        if (confirm('Deseja realmente excluir esta marca?')) {
          fetch('/api/delete_marca/', {
            method: 'POST',
            body: new URLSearchParams({id: btn.dataset.id}),
          })
          .then(r => r.json())
          .then(res => {
            if(res.ok) fetchMarcas();
            else alert('Erro ao excluir!');
          });
        }
      }
    });
  }

  function preencherTabelaBebidas(bebidas) {
    const tbody = document.querySelector('#tabela-bebidas tbody');
    const nomeFiltro = document.getElementById('busca-nome-bebida').value.toLowerCase();
    const marcaFiltro = document.getElementById('filtro-marca-bebida').value;
    const alcoolFiltro = document.getElementById('filtro-alcoolico-bebida').value;

    tbody.innerHTML = '';
    bebidas.filter(bebida => {
      const nomeMatch = bebida.nome.toLowerCase().includes(nomeFiltro);
      const marcaMatch = !marcaFiltro || bebida.marca === marcaFiltro;
      const alcoolMatch = !alcoolFiltro || bebida.alcoolico.toLowerCase() === (alcoolFiltro === 'sim' ? 'sim' : 'não');
      return nomeMatch && marcaMatch && alcoolMatch;
    }).forEach(bebida => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${bebida.nome}</td>
        <td>${bebida.marca}</td>
        <td>R$ ${bebida.valor}</td>
        <td>${bebida.quantidade} ml</td>
        <td>${bebida.alcoolico}</td>
        <td>${bebida.imagem ? `<img src="${bebida.imagem}" alt="${bebida.nome}">` : ''}</td>
        <td>${bebida.data_cadastro ? formatarData(bebida.data_cadastro) : ''}</td>
        <td><button class="excluir-bebida" data-id="${bebida.id}">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });

    // Adiciona evento de exclusão
    tbody.querySelectorAll('.excluir-bebida').forEach(btn => {
      btn.onclick = function() {
        if (confirm('Deseja realmente excluir esta bebida?')) {
          fetch('/api/delete_bebida/', {
            method: 'POST',
            body: new URLSearchParams({id: btn.dataset.id}),
          })
          .then(r => r.json())
          .then(res => {
            if(res.ok) fetchBebidas();
            else alert('Erro ao excluir!');
          });
        }
      }
    });
  }

  function formatarData(dataIso) {
    try {
      const dt = new Date(dataIso);
      return dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR').substring(0,5);
    } catch (e) {
      return dataIso;
    }
  }

  // Event Listeners para filtros
  document.getElementById('btn-filtrar-bebidas').onclick = fetchBebidas;
  document.getElementById('btn-filtrar-marcas').onclick = fetchMarcas;
  document.getElementById('filtro-marca-bebida').onchange = fetchBebidas;
  document.getElementById('filtro-alcoolico-bebida').onchange = fetchBebidas;
  document.getElementById('busca-nome-bebida').oninput = fetchBebidas;
  document.getElementById('busca-nome-marca').oninput = fetchMarcas;

  // Inicialização
  fetchMarcas().then(fetchBebidas);
});