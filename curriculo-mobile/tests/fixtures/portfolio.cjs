// Minimal test fixtures derived from the published API responses inspected on 2026-10-15.
// These objects are used only by tests; the application always requests the live API.
const lucas = {
  id: 2,
  nome: 'Lucas Gabriel Maciel de Barros',
  email: 'lucas.macielbarros01@gmail.com',
  titulo: 'Desenvolvedor Back-end | Full Stack',
  bio: 'Estudante de Sistemas para Internet na UNICAP, com experiência em desenvolvimento de APIs REST, aplicações web e soluções utilizando Java, JavaScript, Node.js, Spring Boot e Salesforce.',
  foto_url: null,
  localizacao: 'Recife, Pernambuco',
};

const mariana = {
  id: 3,
  nome: 'Mariana Oliveira',
  email: 'mariana@example.com',
  titulo: 'Desenvolvedora Front-end',
  bio: 'Estudante de tecnologia com interesse em desenvolvimento de interfaces, experiência do usuário e aplicações mobile.',
  foto_url: null,
  localizacao: 'Recife, Pernambuco',
};

const curriculo = {
  ...lucas,
  formacoes: [{
    id: 1,
    instituicao: 'Universidade Católica de Pernambuco',
    curso: 'Sistemas para Internet',
    tipo: 'Graduação',
    data_inicio: null,
    data_fim: null,
    descricao: 'Formação em desenvolvimento de software, aplicações web, bancos de dados e engenharia de software.',
    pessoa_id: 2,
  }],
  experiencias: [{
    id: 1,
    empresa: 'Prefeitura do Recife',
    cargo: 'Estagiário de Tecnologia',
    data_inicio: '2026-09-01',
    data_fim: null,
    descricao: 'Desenvolvimento e manutenção de soluções utilizando Google Sheets, Google Apps Script e tecnologias web para automação de processos.',
    pessoa_id: 2,
  }],
  projetos: [{
    id: 2,
    nome: 'Voltix',
    descricao: 'Plataforma de e-commerce com front-end em Next.js, API REST em Spring Boot, autenticação JWT e banco de dados PostgreSQL.',
    tecnologias: ['Next.js', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL'],
    github_url: null,
    deploy_url: null,
    imagem_url: null,
    pessoa_id: 2,
  }],
  habilidades: [{ id: 1, nome: 'Java', categoria: 'Back-end', nivel: null, pessoa_id: 2 }],
  contatos: [{ id: 1, tipo: 'GitHub', valor: 'https://github.com/LucasGmacielB', pessoa_id: 2 }],
};

module.exports = {
  pessoasFixture: () => structuredClone([lucas, mariana]),
  curriculoFixture: () => structuredClone(curriculo),
};
