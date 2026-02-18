// Função A

function calcularArea(base, altura) {
    return (base * altura) / 2 ;
}

console.log(calcularArea(15,2))

const calcularAreaArrow = (base,altura) => (base * altura) / 2
console.log(calcularAreaArrow(20,3))

// Função B

function cumprimentar(nome, periodo) {
    return "Boa " + periodo + ", " + nome + "!";
} 

console.log(cumprimentar("Enzo", "Tarde"))

const cumprimentarArrow = (nome,periodo) => "Boa " + periodo + ", " + nome + "!";
console.log(cumprimentarArrow("Manuela", "Noite"))
