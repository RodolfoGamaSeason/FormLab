// Função para alternar tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Alternar para tema escuro';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Alternar para tema claro';
        localStorage.setItem('theme', 'dark');
    }
}

// Aplicar tema salvo no localStorage
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Alternar para tema claro';
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Alternar para tema escuro';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
    
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
});

function validaFormatacao() {
    const formatacaoSim = document.getElementById('formatacao-sim').checked;
    const formatacaoNao = document.getElementById('formatacao-nao').checked;
    let formatacao = true;

    if (formatacaoSim) {
        formatacao = true;
    }

    if (formatacaoNao) {
        formatacao = false;
    }

    return formatacao;
}

document.getElementById('gerar-cpf').addEventListener('click', function () {
    const cpf = gerarCPF(validaFormatacao());
    document.getElementById('cpf').value = cpf;

    copiarCPF();
});

document.getElementById('gerar-nome').addEventListener('click', function () {
    nomeAleatorio().then(nome => {
        document.getElementById('nome').value = nome;

        copiarNome();
    });
});

document.getElementById('gerar-cns').addEventListener('click', function () {
    const cns = gerarCNS();
    document.getElementById('cns').value = cns;
    
    copiarCNS();
});

document.getElementById('gerar-nome-sobrenome').addEventListener('click', function () {
    nomeSobrenomeAleatorio().then(nomeCompleto => {
        document.getElementById('nome').value = nomeCompleto;

        copiarNome();
    });
});

document.getElementById('gerar-telefone').addEventListener('click', function () {
    gerarNumTelefone(validaFormatacao()).then(telefone => {
        document.getElementById('telefone').value = telefone;

        copiarTelefone();
    }
    );
});

document.getElementById('gerar-telefone-celular').addEventListener('click', function () {
    gerarNumTelefoneCelular(validaFormatacao()).then(telefone => {
        document.getElementById('telefone').value = telefone;

        copiarTelefone();
    }
    );
});

document.getElementById('gerar-data').addEventListener('click', function () {
    const data = gerarDataAleatoria(validaFormatacao());
    document.getElementById('data').value = data;

    copiarData();
});

function gerarCPF(formatacao) {
    const gerarDigito = (base, fator) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base[i]) * fator--;
        }
        const resto = soma % 11;
        return resto < 2 ? '0' : (11 - resto).toString();
    };

    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }

    cpf += gerarDigito(cpf, 10);
    cpf += gerarDigito(cpf, 11);

    if (formatacao) {
        var cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
        var cpfFormatado = cpf;
    }

    return cpfFormatado;
}

function gerarCNS() {
    const tipo = Math.random() < 0.5 ? 'definitivo' : 'provisorio';

    if (tipo === 'definitivo') {
        while (true) {
            let pis = (Math.floor(Math.random() * 2) + 1).toString(); // Inicia com 1 ou 2
            for (let i = 0; i < 10; i++) {
                pis += Math.floor(Math.random() * 10);
            }

            let soma = 0;
            let peso = 15;
            for (let i = 0; i < 11; i++) {
                soma += parseInt(pis[i]) * peso--;
            }

            let resto = soma % 11;
            let dv = 11 - resto;
            if (dv === 11) dv = 0;

            if (dv === 10) continue;

            return pis + "001" + dv;
        }
    } else {
        while (true) {
            const prefixos = [7, 8, 9];
            let cns = prefixos[Math.floor(Math.random() * prefixos.length)].toString();
            
            for (let i = 0; i < 14; i++) {
                cns += Math.floor(Math.random() * 10);
            }

            let soma = 0;
            for (let i = 0; i < 15; i++) {
                soma += parseInt(cns[i]) * (15 - i);
            }

            if (soma % 11 === 0) {
                return cns;
            }
        }
    }
}

function copiarCPF() {
    var cpfInput = document.getElementById('cpf');
    cpfInput.select();
    cpfInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(cpfInput.value);

    document.getElementById('pop-up-cpf').style.display = 'block';
    setTimeout(function () {
        document.getElementById('pop-up-cpf').style.display = 'none';
    }, 3000);
}

function copiarNome() {
    var nomeInput = document.getElementById('nome');
    nomeInput.select();
    nomeInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(nomeInput.value);

    document.getElementById('pop-up-nome').style.display = 'block';
    setTimeout(function () {
        document.getElementById('pop-up-nome').style.display = 'none';
    }, 3000);
}

function copiarCNS() {
    var cnsInput = document.getElementById('cns');
    cnsInput.select();
    cnsInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(cnsInput.value);

    document.getElementById('pop-up-cns').style.display = 'block';
    setTimeout(function () {
        document.getElementById('pop-up-cns').style.display = 'none';
    }, 3000);
}

async function nomeAleatorio() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const nomes = data.nomes;
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        return nome;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

async function nomeSobrenomeAleatorio() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const nomes = data.nomes;
        const sobrenomes = data.sobrenomes;
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
        return `${nome} ${sobrenome}`;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

async function gerarNumTelefone(formatacao) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const ddd = data.ddd[Math.floor(Math.random() * data.ddd.length)];
        const numero = Math.floor(Math.random() * 90000000) + 10000000;

        if (formatacao) {
            var telefoneFormatado = `(${ddd}) ${numero.toString().replace(/(\d{4})(\d{4})/, "$1-$2")}`;
        } else {
            var telefoneFormatado = `${ddd} ${numero}`;
        }

        return telefoneFormatado;
    } catch (error) { 
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

async function gerarNumTelefoneCelular(formatacao) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const ddd = data.ddd[Math.floor(Math.random() * data.ddd.length)];
        const numero = Math.floor(Math.random() * 90000000) + 900000000;

        if (formatacao) {
            var telefoneFormatado = `(${ddd}) ${numero.toString().replace(/(\d{5})(\d{4})/, "$1-$2")}`;
        } else {
            var telefoneFormatado = `${ddd} ${numero}`;
        }

        return telefoneFormatado;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function copiarTelefone() {
    var telefoneInput = document.getElementById('telefone');
    telefoneInput.select();
    telefoneInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(telefoneInput.value);

    document.getElementById('pop-up-telefone').style.display = 'block';
    setTimeout(function () {
        document.getElementById('pop-up-telefone').style.display = 'none';
    }, 3000);
}

function gerarDataAleatoria() {
    const ano = Math.floor(Math.random() * (2023 - 1900 + 1)) + 1900;
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 31) + 1;

    const data = new Date(ano, mes - 1, dia);

    return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
}

function copiarData() {
    var dataInput = document.getElementById('data');
    dataInput.select();
    dataInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(dataInput.value);

    document.getElementById('pop-up-data').style.display = 'block';
    setTimeout(function () {
        document.getElementById('pop-up-data').style.display = 'none';
    }, 3000);
}