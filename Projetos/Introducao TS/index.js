"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const produtos = [
    {
        id: 1,
        nome: "iPhone 15",
        preco: 5999.0,
        categoria: "Eletrônicos",
        emEstoque: true,
    },
    {
        id: 2,
        nome: "Cabo HDMI",
        preco: 39.9,
        categoria: "Eletrônicos",
        emEstoque: false,
    },
    {
        id: 3,
        nome: "Tênis Running Pro",
        preco: 349.9,
        categoria: "Esportes",
        emEstoque: true,
    },
    {
        id: 4,
        nome: "Mochila Urbana",
        preco: 189.9,
        categoria: "Acessórios",
        emEstoque: false,
    },
    {
        id: 5,
        nome: "Fone Bluetooth",
        preco: 229.9,
        categoria: "Eletrônicos",
        emEstoque: true,
    },
];
function exibirProduto(produto) {
    const precoFormatado = produto.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    const status = produto.emEstoque ? "✅ disponível" : "❌ indisponível";
    return `[${produto.categoria}] ${produto.nome} - ${precoFormatado} ${status}`;
}
console.log("=== Catálogo de Produtos ===\n");
for (const produto of produtos) {
    console.log(exibirProduto(produto));
}
//# sourceMappingURL=index.js.map