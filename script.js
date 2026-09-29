// =====================================================
// DADOS FICTÍCIOS — 9º ANO
// Cada item é um OBJETO com dados de uma disciplina.
// O conjunto todo é um ARRAY (lista).
// =====================================================
const disciplinas = [
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

// Frequência FICTÍCIA / DEMONSTRATIVA.
// Este valor NÃO é calculado a partir das faltas.
// No futuro será tratado de outra forma.
const FREQUENCIA_DEMONSTRATIVA = 92;

// =====================================================
// FUNÇÃO: normalizarNota(valor)
// Converte qualquer formato de nota para a escala 0–10.
// Retorna null quando a nota ainda não foi lançada
// ou quando o valor é inválido.
// =====================================================
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Aceita "8,5" e "8.5": troca vírgula por ponto
  const numero = Number(String(valor).replace(",", "."));

  // Se não for número válido, ignora
  if (isNaN(numero)) {
    return null;
  }

  // Entre 0 e 10: mantém
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Maior que 10 e até 100: divide por 10
  // 100 vira 10,0 | 89 vira 8,9 | 75 vira 7,5
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras: inválido
  return null;
}

// =====================================================
// FUNÇÃO: calcularMedia(notas)
// Recebe um ARRAY de notas já normalizadas.
// Ignora valores null (nota ausente) — nunca vira zero.
// =====================================================
function calcularMedia(notas) {
  // Filtra apenas as notas válidas
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  // Sem nota válida: retorna null
  if (validas.length === 0) {
    return null;
  }

  // Soma tudo e divide pela quantidade de válidas
  let soma = 0;
  validas.forEach(function (n) {
    soma = soma + n;
  });

  return soma / validas.length;
}

// =====================================================
// FUNÇÃO: definirSituacao(media)
// Retorna o texto de situação conforme a média.
// =====================================================
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// =====================================================
// FUNÇÃO: formatarNota(valor)
// Mostra a nota com uma casa decimal ou "—".
// =====================================================
function formatarNota(valor) {
  if (valor === null) {
    return "Ainda não lançada";
  }
  return valor.toFixed(1).replace(".", ",");
}

// =====================================================
// FUNÇÃO: criarLinha(dados)
// Monta uma linha (<tr>) da tabela com os dados já
// processados de uma disciplina.
// =====================================================
function criarLinha(dados) {
  const linha = document.createElement("tr");

  // Define a classe de cor conforme a situação
  let classeSituacao = "situacao-sem-nota";
  if (dados.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (dados.situacao === "Atenção") classeSituacao = "situacao-atencao";

  linha.innerHTML = `
    <td>${dados.disciplina}</td>
    <td>${formatarNota(dados.tri1)}</td>
    <td>${formatarNota(dados.tri2)}</td>
    <td>${formatarNota(dados.tri3)}</td>
    <td>${formatarNota(dados.media)}</td>
    <td>${dados.totalFaltas}</td>
    <td class="${classeSituacao}">${dados.situacao}</td>
  `;

  return linha;
}

// =====================================================
// FUNÇÃO: preencherTabela(lista)
// Percorre a lista, processa cada disciplina e
// adiciona as linhas no <tbody>.
// =====================================================
function preencherTabela(lista) {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = ""; // limpa antes de preencher

  lista.forEach(function (item) {
    // Normaliza as três notas
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Média usando apenas as notas disponíveis
    const media = calcularMedia([n1, n2, n3]);

    // Soma as faltas dos três trimestres
    let totalFaltas = 0;
    item.faltas.forEach(function (f) {
      totalFaltas = totalFaltas + f;
    });

    // Situação conforme a média
    const situacao = definirSituacao(media);

    // Objeto com os dados já processados
    const dados = {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      totalFaltas: totalFaltas,
      situacao: situacao
    };

    // Cria e adiciona a linha na tabela
    corpo.appendChild(criarLinha(dados));
  });
}

// =====================================================
// FUNÇÃO: preencherCards(lista)
// Calcula e exibe os valores dos cards de resumo.
// =====================================================
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

    // Soma as faltas (independente de ter nota ou não)
    item.faltas.forEach(function (f) {
      totalFaltas = totalFaltas + f;
    });

    // Média geral: só entra quem tem média disponível
    if (media !== null) {
      somaMedias = somaMedias + media;
      qtdMedias = qtdMedias + 1;
    }

    // Contagem por situação
    if (media !== null && media >= MEDIA_MINIMA) bomDesempenho++;
    if (media !== null && media < MEDIA_MINIMA) atencao++;
  });

  // Média geral (ou "—" se não houver nenhuma)
  const mediaGeral = qtdMedias > 0 ? (somaMedias / qtdMedias) : null;

  document.getElementById("card-media-geral").textContent =
    mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

  document.getElementById("card-total-faltas").textContent = totalFaltas;
  document.getElementById("card-bom-desempenho").textContent = bomDesempenho;
  document.getElementById("card-atencao").textContent = atencao;

  // Frequência demonstrativa (fictícia)
  document.getElementById("card-frequencia").textContent =
    FREQUENCIA_DEMONSTRATIVA + "%";
  document.getElementById("card-frequencia-texto").textContent =
    "Frequência adequada";
}

// =====================================================
// INICIALIZAÇÃO
// Quando a página terminar de carregar, preenche
// a tabela e os cards com os dados.
// =====================================================
preencherTabela(disciplinas);
preencherCards(disciplinas);