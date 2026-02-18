//Escopo
let app = "MinhaApp";

function Escopo(){
    let versao = "1.0";
    console.log(app);
    console.log(versao);

}
Escopo();

console.log(app);

// o "let versao" não é executado pois ele foi setado dentro da função, com isso o erro é gerado.

// Callback


function executarTarefa(nomeTarefa, callback){
    console.log("Iniciando : " + nomeTarefa);
    callback();
}

executarTarefa("Backup do Sistema", () => {
  console.log("Tarefa concluída!");
});


async function buscarPerfil(params) {
    return "Perfil carregado: Usuário Padrão"
    
}

buscarPerfil().then(console.log);