document.addEventListener("DOMContentLoaded", () => {
    // ======== CAMPOS DO CADASTRO DE BEBIDAS ========
    const formCadastro = document.querySelector("form[action='/Principal/Principal.html']");
    const idCadastro = document.getElementById("id");
    const nomeCadastro = document.getElementById("nome");
    const valorCadastro = document.getElementById("valor");
    const quantidadeCadastro = document.getElementById("quantidade");
    const alcoolicoCadastro = document.getElementById("alcoolico");
    const imagemInput = document.getElementById("imagem");
    const previewCadastro = document.getElementById("preview-cadastro");

    const formMarca = document.getElementById("form-marca");
    const nomeMarca = document.getElementById("nome-marca");
    const imagemMarca = document.getElementById("imagem-marca");
    const previewMarca = document.getElementById("preview-marca");

    document.getElementById("btn-toggle-menu").addEventListener("click", () => {
        const menu = document.getElementById("menu-lateral");
        const body = document.body;
        const aberto = menu.classList.toggle("visivel");
        body.classList.toggle("menu-aberto", aberto);
    });

    const marcaSelecao = document.getElementById("marca-selecao");

    // Preencher o select com as marcas do localStorage
    function carregarMarcasNoSelect() {
        marcaSelecao.innerHTML = '<option value="">Selecione uma marca</option>';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("marca_")) {
                const marca = JSON.parse(localStorage.getItem(key));
                const option = document.createElement("option");
                option.value = marca.nome;
                option.textContent = marca.nome;
                marcaSelecao.appendChild(option);
            }
        }
    }
    carregarMarcasNoSelect(); // Executa ao carregar a página


    // Pré-visualização da imagem da marca
    imagemMarca.addEventListener("change", () => {
        const file = imagemMarca.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => previewMarca.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Validação personalizada
    configurarValidacaoPersonalizada(nomeMarca, "Informe o nome da marca.");
    configurarValidacaoPersonalizada(marcaSelecao, "Selecione uma marca para a bebida.");
    configurarValidacaoPersonalizada(imagemMarca, "Selecione uma imagem da marca.");

    // Cadastro de marca
    formMarca.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = nomeMarca.value.trim().toLowerCase();

        // Verifica duplicidade
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("marca_")) {
                const marca = JSON.parse(localStorage.getItem(key));
                if (marca.nome.toLowerCase() === nome) {
                    exibirAlerta("Já existe uma marca com esse nome.");
                    return;
                }
            }
        }

        const confirmarMarca = await confirmar("Deseja cadastrar esta nova marca?");
        if (!confirmarMarca) return;

        const marca = {
            nome: nomeMarca.value.trim(),
            imagem: previewMarca.src
        };

        localStorage.setItem(`marca_${marca.nome}`, JSON.stringify(marca));
        exibirAlerta("Marca cadastrada com sucesso!");
        formMarca.reset();
        previewMarca.src = "";

        location.reload();
    });

    // Validação personalizada dos campos obrigatórios
    function configurarValidacaoPersonalizada(input, mensagem) {
        input.addEventListener("invalid", function (e) {
            e.preventDefault(); // evita mensagem padrão
            input.setCustomValidity(mensagem);
            exibirAlerta(mensagem);
        });

        input.addEventListener("input", function () {
            input.setCustomValidity(""); // limpa ao digitar
        });
    }

    // Aplicar mensagens personalizadas
    configurarValidacaoPersonalizada(imagemInput, "Selecione uma imagem para a bebida.");
    configurarValidacaoPersonalizada(idCadastro, "Informe o ID da bebida.");
    configurarValidacaoPersonalizada(nomeCadastro, "Informe o nome da bebida.");
    configurarValidacaoPersonalizada(valorCadastro, "Informe o valor da bebida.");
    configurarValidacaoPersonalizada(quantidadeCadastro, "Informe a quantidade da bebida.");
    configurarValidacaoPersonalizada(alcoolicoCadastro, "Selecione se a bebida é alcoólica.");


    imagemInput.addEventListener("change", () => {
        const file = imagemInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                previewCadastro.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });


    // Cadastro de bebida
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idNovo = idCadastro.value.trim();
        const nomeNovo = nomeCadastro.value.trim().toLowerCase();

        // 🚫 Verifica duplicidade de ID
        if (localStorage.getItem(`bebida_${idNovo}`)) {
            exibirAlerta("Já existe uma bebida com esse ID.");
            return;
        }

        // 🚫 Verifica duplicidade de Nome
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("bebida_")) {
                const bebida = JSON.parse(localStorage.getItem(key));
                if (bebida.nome.toLowerCase() === nomeNovo) {
                    exibirAlerta("Já existe uma bebida com esse nome.");
                    return;
                }
            }
        }

        const continuar = await confirmar("Deseja cadastrar esta nova bebida?");
        if (!continuar) return;

        const bebida = {
            id: idNovo,
            nome: nomeCadastro.value.trim(),
            valor: valorCadastro.value,
            quantidade: quantidadeCadastro.value,
            alcoolico: alcoolicoCadastro.checked ? "Sim" : "Não",
            imagem: previewCadastro.src,
            marca: marcaSelecao.value

        };

        localStorage.setItem(`bebida_${bebida.id}`, JSON.stringify(bebida));
        exibirAlerta("Bebida cadastrada com sucesso!");
        formCadastro.reset();
        marcaSelecao.selectedIndex = 0;
        previewCadastro.src = "";
    });


    // === Função de Alerta Estilizado ===
    function exibirAlerta(mensagem, duracao = 3000) {
        let alerta = document.getElementById("alerta-dinamico");
        if (!alerta) {
            alerta = document.createElement("div");
            alerta.id = "alerta-dinamico";
            document.body.appendChild(alerta);
        }
        Object.assign(alerta.style, {
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "15px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            margin: "15px auto",
            width: "90%",
            maxWidth: "450px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "9999",
            display: "block",
            border: "1px solid #ffeeba",
            opacity: "1",
            transition: "opacity 0.3s ease-out"
        });
        alerta.textContent = mensagem;
        setTimeout(() => {
            alerta.style.opacity = "0";
            setTimeout(() => alerta.style.display = "none", 300);
        }, duracao);
    }

    function confirmar(mensagem) {
        return new Promise((resolve) => {
            let modal = document.getElementById("modal-confirmacao");
            if (!modal) {
                modal = document.createElement("div");
                modal.id = "modal-confirmacao";
                document.body.appendChild(modal);
            }
            modal.innerHTML = `
                <div style="
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    font-family: Arial, sans-serif;
                ">
                    <p style="margin-bottom: 20px; font-size: 1rem;">${mensagem}</p>
                    <button id="btn-confirmar" style="
                        margin-right: 10px;
                        background-color: #28a745;
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Sim</button>
                    <button id="btn-cancelar" style="
                        background-color: #dc3545;
                        border: none;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Não</button>
                </div>
            `;
            Object.assign(modal.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});