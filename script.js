let classificacaoSelecionada = '';

function irParaProximoPasso() {
    // Captura a classificação da emergência
    const classificacao = document.querySelector('input[name="classificacao"]:checked');
    
    if (!classificacao) {
        alert('Por favor, selecione uma classificação de emergência.');
        return;
    }

    classificacaoSelecionada = classificacao.value;

    // Esconde o primeiro passo e exibe o segundo
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function iniciarAtendimento() {
    // Captura os remédios selecionados
    const remediosSelecionados = document.querySelectorAll('input[name="remedio"]:checked');
    
    if (remediosSelecionados.length > 0) {
        let remedios = Array.from(remediosSelecionados).map(remedio => remedio.value);
        document.getElementById('resultado-remedios').innerText = 
            ` ${remedios.join(', ')}`;
    } else {
        alert('Por favor, selecione ao menos um remédio.');
        return;
    }

    // Exibe a classificação escolhida
    document.getElementById('resultado-classificacao').innerText = 
        `${classificacaoSelecionada}`;

    // Esconde o segundo passo e exibe o terceiro
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';

    // Definir o tempo com base na classificação
    let tempo;
    switch (classificacaoSelecionada) {
        case 'Emergência':
            tempo = 60;  // 1 minuto
            break;
        case 'Muito Grave':
            tempo = 120; // 2 minutos
            break;
        case 'Grave':
            tempo = 180; // 3 minutos
            break;
        case 'Leve':
            tempo = 300; // 5 minutos
            break;
    }

    // Iniciar o timer
    iniciarTimer(tempo);
}

function iniciarTimer(tempoRestante) {
    const timerDisplay = document.getElementById('timer');
    const resetButton = document.getElementById('reset-btn');
    
    const intervalo = setInterval(() => {
        let minutos = Math.floor(tempoRestante / 60);
        let segundos = tempoRestante % 60;
        
        // Formatação para exibir dois dígitos
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;
        
        timerDisplay.innerText = `${minutos}:${segundos}`;
        
        if (tempoRestante > 0) {
            tempoRestante--;
        } else {
            clearInterval(intervalo);
            timerDisplay.innerText = "A ambulância chegou!";
            
            // Mostrar o botão de reset
            resetButton.style.display = 'block';
        }
    }, 1000);  // Atualiza a cada segundo
}

function reiniciarFluxo() {
    // Esconde o passo 3 e volta ao início (passo 1)
    document.getElementById('step-3').style.display = 'none';
   
    
    // Reset das escolhas
    document.querySelectorAll('input[name="classificacao"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="remedio"]').forEach(input => input.checked = false);
    
    // Volta para o primeiro passo
    document.getElementById('step-1').style.display = 'block';
}

async function carregarCaso() {
    try {
        const response = await fetch('casos.json'); // Ajuste o caminho se necessário
        const casos = await response.json();
        
        // Seleciona um caso aleatório
        const casoAleatorio = casos[Math.floor(Math.random() * casos.length)];
        
        // Atualiza o parágrafo com a descrição do caso
        document.getElementById('ocorrencia').innerText = casoAleatorio.descricao;
    } catch (error) {
        console.error('Erro ao carregar o caso:', error);
    }
}

// Chama a função ao carregar a página
window.onload = carregarCaso;
