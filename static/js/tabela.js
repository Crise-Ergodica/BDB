document.addEventListener("DOMContentLoaded", () => {
  const tabelaBebidas = document.querySelector("#tabela-bebidas tbody");
  const tabelaMarcas = document.querySelector("#tabela-marcas tbody");

  document.getElementById("btn-toggle-menu").addEventListener("click", () => {
    const menu = document.getElementById("menu-lateral");
    menu.classList.toggle("visivel");
  });

  const filtros = {
    id: document.getElementById("filtro-id"),
    nome: document.getElementById("filtro-nome"),
    valor: document.getElementById("filtro-valor"),
    quantidade: document.getElementById("filtro-quantidade"),
    alcoolico: document.getElementById("filtro-alcoolico"),
    marca: document.getElementById("filtro-marca")
  };

  Object.values(filtros).forEach(input => {
    input.addEventListener("input", carregarTabelaBebidas);
  });

  function confirmar(mensagem) {
    return new Promise((resolve) => {
      let modal = document.getElementById("modal-confirmacao");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-confirmacao";
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); max-width: 400px; width: 90%; text-align: center;">
        <p style="margin-bottom: 20px;">${mensagem}</p>
        <button id="btn-confirmar" style="margin-right: 10px; background-color: #28a745; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Sim</button>
        <button id="btn-cancelar" style="background-color: #dc3545; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Não</button>
      </div>
    `;

      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999"
      });

      modal.querySelector("#btn-confirmar").onclick = () => {
        modal.style.display = "none";
        resolve(true);
      };
      modal.querySelector("#btn-cancelar").onclick = () => {
        modal.style.display = "none";
        resolve(false);
      };
    });
  }

  function confirmarDesvincularOuExcluir(mensagem) {
    return new Promise((resolve) => {
      let modal = document.getElementById("modal-confirmacao");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-confirmacao";
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); max-width: 400px; width: 90%; text-align: center;">
          <p style="margin-bottom: 20px;">${mensagem}</p>
          <button id="btn-desvincular" style="margin-right: 10px;">Desvincular</button>
          <button id="btn-excluir-tudo">Excluir tudo</button>
        </div>
      `;

      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999"
      });

      modal.querySelector("#btn-desvincular").onclick = () => {
        modal.style.display = "none";
        resolve("desvincular");
      };
      modal.querySelector("#btn-excluir-tudo").onclick = () => {
        modal.style.display = "none";
        resolve("excluir");
      };
    });
  }

  function exibirAlerta(mensagem, tipo = 'sucesso', duracao = 3000) {
    let alerta = document.getElementById("alerta-dinamico");
    if (!alerta) {
      alerta = document.createElement("div");
      alerta.id = "alerta-dinamico";
      document.body.appendChild(alerta);
    }

    Object.assign(alerta.style, {
      backgroundColor: tipo === 'erro' ? "#f8d7da" : "#d4edda",
      color: tipo === 'erro' ? "#721c24" : "#155724",
      padding: "15px 20px",
      borderRadius: "8px",
      margin: "15px auto",
      width: "90%",
      maxWidth: "450px",
      textAlign: "center",
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "9999"
    });

    alerta.textContent = mensagem;

    setTimeout(() => {
      alerta.style.opacity = "0";
      setTimeout(() => alerta.remove(), 300);
    }, duracao);
  }

  function carregarTabelaBebidas() {
    tabelaBebidas.innerHTML = "";
    const bebidas = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith("bebida_")) continue;
      const bebida = JSON.parse(localStorage.getItem(key));
      bebidas.push(bebida);
    }

    bebidas.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const marcas = ["Sem marca"];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("marca_")) {
        const marca = JSON.parse(localStorage.getItem(key));
        marcas.push(marca.nome);
      }
    }

    for (const bebida of bebidas) {
      if (
        (filtros.id.value && !bebida.id.toLowerCase().includes(filtros.id.value.toLowerCase())) ||
        (filtros.nome.value && !bebida.nome.toLowerCase().includes(filtros.nome.value.toLowerCase())) ||
        (filtros.valor.value && !String(bebida.valor).includes(filtros.valor.value)) ||
        (filtros.quantidade.value && !String(bebida.quantidade).includes(filtros.quantidade.value)) ||
        (filtros.alcoolico.value && !bebida.alcoolico.toLowerCase().includes(filtros.alcoolico.value.toLowerCase())) ||
        (filtros.marca.value && !bebida.marca?.toLowerCase().includes(filtros.marca.value.toLowerCase()))
      ) continue;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" value="${bebida.id}" disabled></td>
        <td><input type="text" value="${bebida.nome}" disabled></td>
        <td><input type="number" value="${bebida.valor}" disabled></td>
        <td><input type="number" value="${bebida.quantidade}" disabled></td>
        <td><input type="text" value="${bebida.alcoolico}" disabled></td>
        <td></td>
        <td>
          <img src="${bebida.imagem}" alt="Imagem" style="max-width:120px;">
          <input type="file" accept="image/*" style="display:none" disabled>
        </td>
        <td>
          <button class="editar">Editar</button>
          <button class="excluir">Excluir</button>
        </td>
      `;

      const cellMarca = tr.querySelectorAll("td")[5];
      const selectMarca = document.createElement("select");
      marcas.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        if (bebida.marca === m) option.selected = true;
        selectMarca.appendChild(option);
      });
      selectMarca.disabled = true;
      cellMarca.appendChild(selectMarca);

      tabelaBebidas.appendChild(tr);

      const inputs = tr.querySelectorAll("input[type='text'], input[type='number']");
      const fileInput = tr.querySelector("input[type='file']");
      const img = tr.querySelector("img");
      const btnEditar = tr.querySelector(".editar");
      const btnExcluir = tr.querySelector(".excluir");

      btnEditar.addEventListener("click", () => {
        if (btnEditar.textContent === "Editar") {
          inputs.forEach(input => input.disabled = false);
          selectMarca.disabled = false;
          fileInput.style.display = "block";
          fileInput.disabled = false;
          btnEditar.textContent = "Salvar";
        } else {
          const bebidaAtualizada = {
            id: inputs[0].value.trim(),
            nome: inputs[1].value.trim(),
            valor: inputs[2].value,
            quantidade: inputs[3].value,
            alcoolico: inputs[4].value,
            imagem: img.src,
            marca: selectMarca.value
          };

          localStorage.removeItem(`bebida_${bebida.id}`);
          localStorage.setItem(`bebida_${bebidaAtualizada.id}`, JSON.stringify(bebidaAtualizada));
          exibirAlerta("Bebida atualizada com sucesso!");
          carregarTabelaBebidas();
        }
      });

      btnExcluir.addEventListener("click", async () => {
        const confirmarExclusao = await confirmar("Tem certeza que deseja excluir esta bebida?");
        if (confirmarExclusao) {
          localStorage.removeItem(`bebida_${bebida.id}`);
          exibirAlerta("Bebida excluída!");
          carregarTabelaBebidas();
        }
      });
    }
  }

  function carregarTabelaMarcas() {
    tabelaMarcas.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith("marca_")) continue;
      const marca = JSON.parse(localStorage.getItem(key));

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" value="${marca.nome}" disabled></td>
        <td>
          <img src="${marca.imagem}" alt="Imagem" style="max-width:120px;">
          <input type="file" accept="image/*" style="display:none" disabled>
        </td>
        <td>
          <button class="editar">Editar</button>
          <button class="excluir">Excluir</button>
        </td>
      `;

      tabelaMarcas.appendChild(tr);

      const inputNome = tr.querySelector("input[type='text']");
      const imgTag = tr.querySelector("img");
      const btnEditar = tr.querySelector(".editar");
      const btnExcluir = tr.querySelector(".excluir");

      btnEditar.addEventListener("click", () => {
        if (btnEditar.textContent === "Editar") {
          inputNome.disabled = false;
          btnEditar.textContent = "Salvar";
        } else {
          const novaMarca = {
            nome: inputNome.value.trim(),
            imagem: imgTag.src
          };
          localStorage.removeItem(key);
          localStorage.setItem(`marca_${novaMarca.nome}`, JSON.stringify(novaMarca));
          exibirAlerta("Marca atualizada com sucesso!");
          carregarTabelaMarcas();
          carregarTabelaBebidas();
        }
      });

      btnExcluir.addEventListener("click", async () => {
        const bebidasVinculadas = [];
        for (let j = 0; j < localStorage.length; j++) {
          const keyB = localStorage.key(j);
          if (keyB.startsWith("bebida_")) {
            const bebida = JSON.parse(localStorage.getItem(keyB));
            if (bebida.marca === marca.nome) {
              bebidasVinculadas.push(bebida);
            }
          }
        }

        if (bebidasVinculadas.length > 0) {
          const escolha = await confirmarDesvincularOuExcluir(
            `Existem ${bebidasVinculadas.length} bebidas vinculadas a esta marca. O que deseja fazer?`
          );

          const confirmarAcao = await confirmar("Tem certeza que deseja executar esta ação?");
          if (!confirmarAcao) {
            exibirAlerta("Ação cancelada pelo usuário.");
            return;
          }

          if (escolha === "excluir") {
            bebidasVinculadas.forEach(b => localStorage.removeItem(`bebida_${b.id}`));
            exibirAlerta("Marca e bebidas vinculadas excluídas!");
          } else {
            bebidasVinculadas.forEach(b => {
              b.marca = "Sem marca";
              localStorage.setItem(`bebida_${b.id}`, JSON.stringify(b));
            });
            exibirAlerta("Marca excluída e bebidas desvinculadas!");
          }
        } else {
          const confirmarAcao = await confirmar("Tem certeza que deseja excluir esta marca?");
          if (!confirmarAcao) {
            exibirAlerta("Ação cancelada pelo usuário.");
            return;
          }
          exibirAlerta("Marca excluída!");
        }

        localStorage.removeItem(key);
        carregarTabelaMarcas();
        carregarTabelaBebidas();
      });
    }
  }

  carregarTabelaBebidas();
  carregarTabelaMarcas();
});
