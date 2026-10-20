// =====================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// Turma e número de chamada definidos fixamente
// =====================================================
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 2,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// =====================================================
// DADOS FICTÍCIOS / LOCAIS — 9º ANO
// =====================================================
let disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Media mínima de referência
const MEDIA_MINIMA = 6.0;

// Frequência FICTÍCIA / DEMONSTRATIVA
const FREQUENCIA_DEMONSTRATIVA = 92;

// Guarda o PIN na memória da sessão
let pinSessao = "";

// =====================================================
// NORMALIZAÇÃO E CÁLCULOS (PRESERVADOS DO PROJETO)
// =====================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const numero = Number(String(valor).replace(",", "."));
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });
  if (validas.length === 0) {
    return null;
  }
  let soma = 0;
  validas.forEach(function (n) {
    soma = soma + n;
  });
  return soma / validas.length;
}

function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

function formatarNota(valor) {
  if (valor === null) {
    return "Ainda não lançada";
  }
  return valor.toFixed(1).replace(".", ",");
}

// =====================================================
// RENDERIZAÇÃO SEGURA DA TABELA E CARDS
// =====================================================
function criarLinha(dados) {
  const linha = document.createElement("tr");

  let classeSituacao = "situacao-sem-nota";
  if (dados.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (dados.situacao === "Atenção") classeSituacao = "situacao-atencao";

  const tdDisc = document.createElement("td");
  tdDisc.textContent = dados.disciplina;
  linha.appendChild(tdDisc);

  const tdN1 = document.createElement("td");
  tdN1.textContent = formatarNota(dados.tri1);
  linha.appendChild(tdN1);

  const tdN2 = document.createElement("td");
  tdN2.textContent = formatarNota(dados.tri2);
  linha.appendChild(tdN2);

  const tdN3 = document.createElement("td");
  tdN3.textContent = formatarNota(dados.tri3);
  linha.appendChild(tdN3);

  const tdMed = document.createElement("td");
  tdMed.textContent = formatarNota(dados.media);
  linha.appendChild(tdMed);

  const tdFaltas = document.createElement("td");
  tdFaltas.textContent = dados.totalFaltas;
  linha.appendChild(tdFaltas);

  const tdSit = document.createElement("td");
  tdSit.className = classeSituacao;
  tdSit.textContent = dados.situacao;
  linha.appendChild(tdSit);

  return linha;
}

function preencherTabela(lista) {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  lista.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);

    let totalFaltas = 0;
    if (Array.isArray(item.faltas)) {
      item.faltas.forEach(function (f) {
        totalFaltas += (Number(f) || 0);
      });
    }

    const situacao = definirSituacao(media);

    const dados = {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      totalFaltas: totalFaltas,
      situacao: situacao
    };

    corpo.appendChild(criarLinha(dados));
  });
}

function preencherCards(lista) {
  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltas = 0;
  let bomDesempenho = 0;
  let atencao = 0;

  lista.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);

    if (Array.isArray(item.faltas)) {
      item.faltas.forEach(function (f) {
        totalFaltas += (Number(f) || 0);
      });
    }

    if (media !== null) {
      somaMedias += media;
      qtdMedias++;
      if (media >= MEDIA_MINIMA) bomDesempenho++;
      else atencao++;
    }
  });

  const mediaGeral = qtdMedias > 0 ? (somaMedias / qtdMedias) : null;

  document.getElementById("card-media-geral").textContent =
    mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

  document.getElementById("card-total-faltas").textContent = totalFaltas;
  document.getElementById("card-bom-desempenho").textContent = bomDesempenho;
  document.getElementById("card-atencao").textContent = atencao;

  document.getElementById("card-frequencia").textContent = FREQUENCIA_DEMONSTRATIVA + "%";
  document.getElementById("card-frequencia-texto").textContent = "Frequência adequada";
}

// =====================================================
// ABRIR BOLETIM (API OU DADOS LOCAIS)
// =====================================================
async function fazerLogin() {
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.className = "mensagem-status";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    // Sucesso: armazena o PIN apenas em memória e limpa o campo
    pinSessao = pinDigitado;
    campoPin.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      disciplinas = resultado.dados.disciplinas;
    }

    // Exibe o painel e oculta o login
    document.getElementById("area-login").style.display = "none";
    document.getElementById("painel-boletim").style.display = "block";

    preencherTabela(disciplinas);
    preencherCards(disciplinas);

  } catch (erro) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// =====================================================
// EDIÇÃO E SALVAMENTO NA API
// =====================================================
function abrirEdicao() {
  const corpoEdicao = document.getElementById("corpo-tabela-edicao");
  corpoEdicao.innerHTML = "";
  document.getElementById("mensagem-salvar").textContent = "";

  disciplinas.forEach(function (item, index) {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;
    tr.appendChild(tdNome);

    function valorInputNota(v) {
      const n = normalizarNota(v);
      return n === null ? "" : String(n).replace(".", ",");
    }

    const f1 = (item.faltas && item.faltas[0] !== undefined) ? item.faltas[0] : 0;
    const f2 = (item.faltas && item.faltas[1] !== undefined) ? item.faltas[1] : 0;
    const f3 = (item.faltas && item.faltas[2] !== undefined) ? item.faltas[2] : 0;

    tr.innerHTML += `
      <td><input type="text" class="in-nota" data-index="${index}" data-tri="1" value="${valorInputNota(item.tri1)}"></td>
      <td><input type="text" class="in-nota" data-index="${index}" data-tri="2" value="${valorInputNota(item.tri2)}"></td>
      <td><input type="text" class="in-nota" data-index="${index}" data-tri="3" value="${valorInputNota(item.tri3)}"></td>
      <td><input type="text" class="in-falta" data-index="${index}" data-tri="1" value="${f1}"></td>
      <td><input type="text" class="in-falta" data-index="${index}" data-tri="2" value="${f2}"></td>
      <td><input type="text" class="in-falta" data-index="${index}" data-tri="3" value="${f3}"></td>
    `;

    corpoEdicao.appendChild(tr);
  });

  document.getElementById("area-edicao").style.display = "flex";
}

function fecharEdicao() {
  document.getElementById("area-edicao").style.display = "none";
}

function validarEConverterNota(str) {
  const v = str.trim();
  if (v === "") return { valido: true, valor: null };
  const num = Number(v.replace(",", "."));
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function validarEConverterFalta(str) {
  const v = str.trim();
  if (v === "") return { valido: false };
  const num = Number(v);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

async function salvarAlteracoes() {
  const msgSalvar = document.getElementById("mensagem-salvar");
  msgSalvar.className = "mensagem-status";
  msgSalvar.textContent = "Salvando...";

  let temErro = false;

  const inputsNotas = document.querySelectorAll(".in-nota");
  const inputsFaltas = document.querySelectorAll(".in-falta");

  inputsNotas.forEach(input => input.classList.remove("campo-invalido"));
  inputsFaltas.forEach(input => input.classList.remove("campo-invalido"));

  const novasDisciplinas = JSON.parse(JSON.stringify(disciplinas));

  inputsNotas.forEach(input => {
    const res = validarEConverterNota(input.value);
    if (!res.valido) {
      input.classList.add("campo-invalido");
      temErro = true;
    } else {
      const idx = input.dataset.index;
      const tri = input.dataset.tri;
      novasDisciplinas[idx][`tri${tri}`] = res.valor;
    }
  });

  inputsFaltas.forEach(input => {
    const res = validarEConverterFalta(input.value);
    if (!res.valido) {
      input.classList.add("campo-invalido");
      temErro = true;
    } else {
      const idx = input.dataset.index;
      const tri = Number(input.dataset.tri) - 1;
      if (!Array.isArray(novasDisciplinas[idx].faltas)) {
        novasDisciplinas[idx].faltas = [0, 0, 0];
      }
      novasDisciplinas[idx].faltas[tri] = res.valor;
    }
  });

  if (temErro) {
    msgSalvar.className = "mensagem-status erro";
    msgSalvar.textContent = "Corrija os campos destacados em vermelho antes de salvar.";
    return;
  }

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgSalvar.className = "mensagem-status erro";
      msgSalvar.textContent = "Erro ao salvar os dados no servidor. Tente novamente.";
      return;
    }

    disciplinas = novasDisciplinas;
    preencherTabela(disciplinas);
    preencherCards(disciplinas);

    msgSalvar.className = "mensagem-status sucesso";
    msgSalvar.textContent = "Dados salvos com sucesso.";

    setTimeout(() => {
      fecharEdicao();
    }, 1200);

  } catch (erro) {
    msgSalvar.className = "mensagem-status erro";
    msgSalvar.textContent = "Erro de conexão ao salvar. Tente novamente.";
  }
}
