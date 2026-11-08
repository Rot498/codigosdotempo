// Dados do jogo: textos, artes ASCII, fragmentos e desafios.
const ARTE = {
  capa: String.raw`      .-""""""-.
    .'   12     '.
   /  11  |   1   \
  ;10     |      2 ;
  |       o--->    |
  ;9             3 ;
   \  8         4  /
    '.   7 6 5   .'
      '-.______.-'`,
  maq2: String.raw`[ MÁQUINA DO TEMPO ]
      [███]
   ┌────────┐
  ( INVENTOR )
┌──┤ CÁPSULA ├──┐
│  └────────┘  │
└──────────────┘`,
  robo: String.raw`   ┌───────────┐
   │  ◉     ◉  │   Olá!
   │    ___    │
   └─┬───────┬─┘
     │ ░░░░░ │`,
  maq3: String.raw`      ___________
     /           \
    /   [ O O ]   \
   |    _______    |
   |   | M.T.  |   |
   |   |_______|   |
   ||-- CONTROLES --||
    \_____________/`,
  painel: String.raw`  .--------------------------.
 |  [ CÓDIGOS DE ATIVAÇÃO ]   |
 |  [ 0 1 0 1 1 0 1 0 ]       |
 |  [ 1 1 0 0 1 1 0 1 ]       |
 |  [ 0 0 1 1 0 0 1 1 ]       |
 |  [ ATIVAR ]  [ RESETAR ]   |
  '--------------------------'`,
  portal: String.raw`        .  * .
      .    |    .
    *      |      *
 ---=======|=======---
    *      |      *
      .    |    .
        .  * .`
};

const FRAG = {
  babbage1: { t: "Início: A Invenção da Máquina de Diferenças", x: "Charles Babbage, um brilhante matemático do século XIX, ficou frustrado com os erros em tabelas matemáticas. Isso o levou a conceber a Máquina de Diferenças em 1822, um dispositivo mecânico para cálculos automáticos. Ele garantiu financiamento do governo britânico, marcando o começo de sua jornada na computação mecânica." },
  babbage2: { t: "Meio: A Inovação da Máquina Analítica e Desafios", x: "Durante a construção da Máquina de Diferenças, Babbage idealizou a Máquina Analítica (1837), um projeto ainda mais ambicioso e o precursor do computador moderno, com memória e programação por cartões perfurados. No entanto, ele enfrentou enormes obstáculos financeiros e tecnológicos, nunca conseguindo construir uma versão completa de suas máquinas." },
  babbage3: { t: "Fim: O Legado Póstumo do \"Pai do Computador\"", x: "Babbage morreu em 1871 sem ver suas invenções concretizadas e amplamente reconhecidas. Apesar disso, suas ideias e projetos detalhados foram redescobertas e se tornaram fundamentais para o desenvolvimento dos computadores eletrônicos no século XX. Hoje, Charles Babbage é celebrado como o \"Pai do Computador\", um visionário que lançou as bases da era digital." },
  turing1: { t: "Turing: Origens e a Máquina de Turing", x: "Alan Mathison Turing nasceu em 23 de junho de 1912, em Londres. Desde cedo demonstrou grande talento em matemática e lógica, apesar de ser considerado excêntrico por professores e colegas. Estudou no King's College, na Universidade de Cambridge, onde se destacou por seu trabalho em matemática pura. Em 1936, Turing publicou o artigo On Computable Numbers, no qual propôs o conceito de uma máquina abstrata — hoje conhecida como Máquina de Turing. Essa ideia formou a base da computação moderna, ao definir matematicamente o que significa “calcular”." },
  turing2: { t: "Turing: Bletchley Park e a Enigma", x: "Com o início da Segunda Guerra Mundial, Turing foi recrutado para trabalhar em Bletchley Park, o centro de inteligência britânico. Lá, liderou a equipe responsável por quebrar o código da máquina Enigma, usada pelos nazistas para criptografar mensagens militares. Turing projetou uma máquina eletromecânica chamada Bombe, que acelerava a decodificação das mensagens criptografadas. Seu trabalho foi fundamental para o sucesso dos Aliados e estima-se que tenha encurtado a guerra em pelo menos dois anos, salvando milhões de vidas." },
  turing3: { t: "Turing: Os Últimos Anos e o Reconhecimento", x: "Após a guerra, Turing continuou seus estudos, contribuindo para o desenvolvimento da inteligência artificial e da biologia matemática. No entanto, em 1952, foi condenado por ser homossexual — considerado crime no Reino Unido na época. Como punição, foi submetido à castração química. Em 1954, foi encontrado morto, envenenado com cianeto, em um suposto suicídio. Tinha apenas 41 anos. Décadas depois, Turing foi reconhecido por sua genialidade e pela injustiça sofrida. Em 2009, o governo britânico pediu desculpas oficialmente e, em 2013, ele recebeu o perdão real." },
  ada1: { t: "Ada Lovelace 1: Entendimento do Algoritmo", x: "Ada Lovelace, filha do poeta Lord Byron, é considerada a primeira programadora da história. Ela trabalhou com Charles Babbage na Máquina Analítica, percebendo que ela poderia ir além de meros cálculos, criando um algoritmo para a máquina processar números de Bernoulli, o que é reconhecido como o primeiro programa de computador." },
  ada2: { t: "Ada Lovelace 2: Visão do Potencial da Máquina", x: "Enquanto Babbage focava na máquina como um dispositivo de cálculo, Ada Lovelace enxergou seu potencial para manipular símbolos, criar música e arte, e processar informações de forma mais ampla. Essa visão abstrata e futurista foi crucial para o desenvolvimento da computação teórica." }
};

const ITENS_CAP1 = [
  { icone: "⚙️", nome: "Máquina Diferencial", conf: 1, texto: "Colunas de engrenagens de bronze, cada uma guardando um dígito. Ela calcula somando diferenças repetidas.", pista: "A Máquina Diferencial calcula tabelas somando diferenças." },
  { icone: "📓", nome: "Caderno do Professor", conf: 1, texto: "Na capa, a letra do seu avô: \"Lógica é o idioma das máquinas: AND, OR e NOT.\"", pista: "AND exige tudo ligado, OR aceita qualquer um, NOT inverte." },
  { icone: "💡", nome: "Lâmpadas a gás", texto: "Um painel com lâmpadas A, B e C. Um bilhete diz: \"Em binário, cada posição vale o dobro da anterior: 1, 2, 4, 8, 16.\"", pista: "Posições binárias: 1, 2, 4, 8, 16..." },
  { icone: "🚪", nome: "Saída discreta", texto: "Você tenta sair, mas a porta é só um armário. Babbage ri e pede que você fique." }
];
const ITENS_CAP2 = [
  { icone: "🗺️", nome: "Mapa do bunker", texto: "Um mapa mostra duas torres de radar. Anotação: \"Nunca ligue os dois ao mesmo tempo!\"", pista: "Radares: só um pode estar ligado (XOR)." },
  { icone: "📻", nome: "Rádio interceptador", texto: "Mensagens cifradas chegam a todo momento. Um oficial explica: cada letra foi deslocada algumas casas no alfabeto.", pista: "Cifra de César: desloque as letras de volta no alfabeto." },
  { icone: "🔦", nome: "Corredor escuro", texto: "Soldados vigiam o corredor. Ninguém parece saber de onde você veio." }
];
const ITENS_CAP3 = [
  { icone: "🤖", nome: "Robô T-1", texto: "\"Olá, viajante! Detecto fragmentos de história em seu código genético. Conclua os desafios para abrir o portal.\"" },
  { icone: "📓", nome: "Caderno de Ada", texto: "Uma anotação de Ada: \"Um algoritmo é uma sequência de passos: preparar, repetir, mostrar.\"", pista: "Algoritmo: preparar, repetir, mostrar o resultado." },
  { icone: "🕰️", nome: "Painel da máquina", texto: "O painel mostra 2025 piscando. Falta pouco para voltar para casa." }
];

const DESAFIOS_CAP1 = [
  { titulo: "DESAFIO DAS LÂMPADAS", tipo: "lampadas", quem: "babbage", fala: "\"Preciso que as lâmpadas A e C estejam acesas, mas a B apagada.\"",
    pergunta: "Clique nas lâmpadas para montar o circuito: (A OR C) AND NOT B.", alvo: [true, false, true], estrelas: 2, frag: "babbage1",
    dica: "A e C precisam estar ligadas; B precisa ficar desligada.", acerto: "Perfeito! Exatamente o que eu precisava!", erro: "Não parece estar funcionando... tente novamente!" },
  { titulo: "DESAFIO BINÁRIO", tipo: "bits", bits: 5, quem: "babbage", fala: "Como representamos o número 13 em binário?",
    pergunta: "Ligue os bits até formar o número 13.", correta: 13, estrelas: 3, frag: "babbage2",
    dica: "13 = 8 + 4 + 1.", acerto: "Maravilhoso! Você tem uma mente analítica!", erro: "Hmm, esse não é o número certo. Continue tentando!" },
  { titulo: "DESAFIO LÓGICO", tipo: "escolha", quem: "babbage", fala: "Como expressamos 'A máquina está ligada mas o vapor não está fluindo'?",
    opcoes: ["A AND B", "A AND NOT B", "NOT A AND B"], correta: 1, estrelas: 1, frag: "babbage3",
    dica: "'Vapor não fluindo' é o NOT de B.", acerto: "Brilhante! Você dominou a lógica booleana!", erro: "A lógica parece incorreta... tente outra vez!" }
];

const DESAFIOS_CAP2 = [
  { titulo: "DESAFIO DE DECODIFICAÇÃO", tipo: "bool", frag: "turing1", quem: "turing",
    intro: ["Os militares deixam você ficar no bunker, ainda com desconfiança. Uma mensagem codificada é interceptada e você se voluntaria para decifrá-la. Configure os canais de rádio:", "(A AND B) OR (NOT C), ou seja: Antena A ativada E Filtro B ativado, OU Canal C desligado."],
    campos: ["Antena de Alta Frequência (A) ativada?", "Filtro de Ruído (B) ativado?", "Canal de Comunicação C desligado?"], valida: v => (v[0] && v[1]) || v[2],
    dica: "Basta o Canal C estar desligado para a condição valer.", acerto: "Mensagem decodificada! Os Aliados começam a confiar em você.", erro: "Falha na configuração. A mensagem continua codificada." },
  { titulo: "DESAFIO DA ENIGMA", tipo: "cesar", codigo: "DYDQFDU", correta: 3, estrelas: 1, quem: "turing",
    fala: "Interceptamos uma ordem cifrada! Cada letra foi deslocada no alfabeto. Gire o rotor até ler uma palavra.",
    pergunta: "Ajuste o rotor até a mensagem fazer sentido.", dica: "A palavra tem 7 letras e começa e termina com A. Tente 3 casas.",
    acerto: "É isso! AVANCAR: a ordem de ataque dos Aliados.", erro: "Isso não forma uma palavra. Gire mais o rotor." },
  { titulo: "DESAFIO DO SISTEMA DE RADARES", tipo: "bool", frag: "turing2", quem: "turing", tempo: 25,
    intro: ["Na torre de transmissão, o sistema de defesa sofre um ataque aéreo e depende de dois radares. Para evitar interferência, apenas um pode estar ativo por vez (XOR). Depressa!"],
    campos: ["Radar 1 está ligado?", "Radar 2 está ligado?"], valida: v => v[0] !== v[1],
    dica: "Exatamente um dos dois ligado.", acerto: "Sistema de Defesa ativado! Os céus estão protegidos!", erro: "Falha: ou nenhum radar, ou ambos estão ligados." },
  { titulo: "DESAFIO DE INFILTRAÇÃO", tipo: "bool", frag: "turing3", quem: "turing",
    intro: ["Você se infiltra em uma base inimiga. Para desbloquear o terminal, todos os bloqueadores de sinal precisam estar desligados. (AND com NOT)"],
    campos: ["Bloqueador de sinal 1 ativo?", "Bloqueador de sinal 2 ativo?", "Bloqueador de sinal 3 ativo?"], valida: v => !v[0] && !v[1] && !v[2],
    dica: "Todos precisam ficar em false.", acerto: "Terminal desbloqueado! Mensagem enviada à resistência.", erro: "Sinais ainda estão bloqueados. Tente novamente." }
];

const DESAFIOS_CAP3 = [
  { titulo: "DESAFIO DE ADA LOVELACE: O ALGORITMO", tipo: "blocos", frag: "ada1", silencioso: true, quem: "ada",
    fala: "Para ativar o próximo módulo, monte o algoritmo que calcula A × B, com A=5 e B=3.",
    pergunta: "Clique nos blocos na ordem certa para montar o programa.", blocos: ["resultado = 0", "repetir 3 vezes: resultado = resultado + 5", "mostrar resultado (15)"],
    dica: "Primeiro zere o resultado, depois some, por fim mostre.", acerto: "Excelente! Você entendeu a base do processamento!", erro: "Essa ordem não funciona. Pense como uma máquina de cálculo." },
  { titulo: "DESAFIO BINÁRIO FUTURISTA", tipo: "numero", frag: "ada2", silencioso: true, quem: "robo",
    fala: "O sistema de navegação precisa de um ajuste final.", pergunta: "Converta o binário 10110 para decimal.", correta: 22,
    dica: "16 + 4 + 2.", acerto: "Conectado! O ajuste foi um sucesso!", erro: "Não parece ser a conversão correta. Reveja os bits." }
];

const COMO_JOGAR = [
  "Sua missão é viajar no tempo para desvendar os 'Códigos do Tempo' e restaurar fragmentos perdidos da história da computação.",
  "Você passará por 3 capítulos, cada um focado em um inventor ou conceito fundamental.",
  "Em cada capítulo, você enfrentará desafios lógicos e de conhecimento. Responda corretamente para avançar.",
  "Acertar na primeira tentativa desbloqueia 'Fragmentos Históricos', que contam a história dos pioneiros da computação.",
  "Se falhar em um desafio após 3 tentativas, o capítulo é reiniciado.",
  "Colete o máximo de fragmentos possível. Você pode revê-los a qualquer momento no botão 'Fragmentos'. Boa sorte, viajante do tempo!"
];

const REGRAS = [
  "1. Escolhas: clique na opção ou aperte a tecla com o número correspondente.",
  "2. Energia: cada erro gasta 25% da energia da máquina. Sem energia, o capítulo recomeça. Alguns desafios têm tempo limite.",
  "3. Fragmentos Históricos: só são desbloqueados se você acertar o desafio na PRIMEIRA tentativa.",
  "4. Desafios interativos: clique em lâmpadas, bits, rotores e blocos. Nos true/false, use as chaves e confirme.",
  "5. Exploração: clique nos objetos das cenas para achar pistas, anotadas no Caderno. Suas escolhas mudam o final (3 finais).",
  "6. Saída: você pode sair do jogo a qualquer momento pelo Menu Principal."
];

// Variantes sorteadas a cada partida (rejogabilidade)
DESAFIOS_CAP1[1].variantes = [
  { fala: "Como representamos o número 13 em binário?", pergunta: "Ligue os bits até formar o número 13.", correta: 13, dica: "13 = 8 + 4 + 1." },
  { fala: "E o número 11, como fica em binário?", pergunta: "Ligue os bits até formar o número 11.", correta: 11, dica: "11 = 8 + 2 + 1." },
  { fala: "Preciso do número 14 na máquina, em binário!", pergunta: "Ligue os bits até formar o número 14.", correta: 14, dica: "14 = 8 + 4 + 2." }
];
DESAFIOS_CAP1[2].variantes = [
  { fala: "Como expressamos 'A máquina está ligada mas o vapor não está fluindo'?", opcoes: ["A AND B", "A AND NOT B", "NOT A AND B"], correta: 1, dica: "'Vapor não fluindo' é o NOT de B." },
  { fala: "Como expressamos 'A porta está aberta OU o alarme está ligado'?", opcoes: ["A AND B", "A OR B", "NOT A"], correta: 1, dica: "OU aceita qualquer um dos dois." },
  { fala: "Como expressamos 'A chave está girada E o motor não está quente'?", opcoes: ["A AND NOT B", "A OR B", "NOT A AND NOT B"], correta: 0, dica: "O motor 'não quente' é o NOT de B." }
];
DESAFIOS_CAP3[1].variantes = [
  { pergunta: "Converta o binário 10110 para decimal.", correta: 22, dica: "16 + 4 + 2." },
  { pergunta: "Converta o binário 11010 para decimal.", correta: 26, dica: "16 + 8 + 2." },
  { pergunta: "Converta o binário 10011 para decimal.", correta: 19, dica: "16 + 2 + 1." }
];
const TROFEUS = [
  { id: "viajante", i: "🧭", n: "Viajante do Tempo", d: "Conclua toda a jornada." },
  { id: "perfeito", i: "🎯", n: "Sem erros", d: "Termine a jornada sem errar nenhuma vez." },
  { id: "colecionador", i: "📜", n: "Colecionador", d: "Colete os 8 fragmentos históricos." },
  { id: "estrelas", i: "★", n: "Mestre das estrelas", d: "Ganhe todas as 7 estrelas." },
  { id: "guardiao", i: "🤫", n: "Guardião do Tempo", d: "Guarde o segredo de Turing." },
  { id: "detetive", i: "🔎", n: "Detetive", d: "Encontre as 6 pistas do caderno." },
  { id: "engenheiro", i: "🛠️", n: "Engenheiro", d: "Vença os 2 minijogos bônus." }
];
