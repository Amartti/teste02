// Array que armazena os itens do carrinho
let carrinho = [];

// Adiciona um produto ao carrinho
function adicionarAoCarrinho(botao) {
    let produto = botao.parentElement;
    let nome = produto.getAttribute("data-nome");
    let preco = parseFloat(produto.getAttribute("data-preco"));

    // Captura a quantidade (padrão = 1 se não preenchido)
    let inputQuantidade = produto.querySelector(".quantidade");
    let quantidade = parseInt(inputQuantidade?.value) || 1;

    // Adiciona o item ao array do carrinho
    carrinho.push({ nome, preco, quantidade });
    atualizarCarrinho();
}

// Remove um item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1); // Remove o item do array pelo índice
    atualizarCarrinho(); // Atualiza a exibição
}

// Atualiza a lista do carrinho e o total
function atualizarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let totalElement = document.getElementById("total");
    lista.innerHTML = "";

    let total = 0;
    carrinho.forEach((item, index) => {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;

        let li = document.createElement("li");
        li.innerHTML = `${item.nome} x${item.quantidade} - R$ ${subtotal.toFixed(2)} 
            <button class="remover" onclick="removerDoCarrinho(${index})">❌ Remover</button>`;

        lista.appendChild(li);
    });

    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Exibe o campo de endereço caso o cliente escolha "Entrega"
function verificarEntrega() {
    let tipo = document.getElementById("tipo-retirada").value;
    let enderecoContainer = document.getElementById("endereco-container");

    enderecoContainer.style.display = tipo === "entrega" ? "block" : "none";
}

// Finaliza o pedido e envia para o WhatsApp
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let numeroWhatsApp = "5531990631870"; // Número para contato
    let metodoPagamento = document.getElementById("metodo-pagamento").value;
    let tipoRetirada = document.getElementById("tipo-retirada").value;
    let endereco = document.getElementById("endereco").value;

    let mensagem = "Olá, gostaria de fazer um pedido:\n\n";
    carrinho.forEach(item => {
        let subtotal = item.preco * item.quantidade;
        mensagem += `- ${item.nome} x${item.quantidade} - R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\nTotal: R$ ${document.getElementById("total").textContent.replace("Total: ", "")}`;
    mensagem += `\nForma de Pagamento: ${metodoPagamento}`;
    mensagem += `\nTipo de Retirada: ${tipoRetirada}`;

    if (tipoRetirada === "entrega" && endereco.trim() !== "") {
        mensagem += `\nEndereço: ${endereco}`;
    }

    let url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
