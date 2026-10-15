/** Fields observed in the published API. Optional text can be absent or null. */
interface Entity {
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface PessoaRelation extends Entity {
  pessoa_id?: number | null;
}

export interface Pessoa extends Entity {
  nome?: string | null;
  email?: string | null;
  titulo?: string | null;
  bio?: string | null;
  foto_url?: string | null;
  localizacao?: string | null;
}

export interface Formacao extends PessoaRelation {
  instituicao?: string | null;
  curso?: string | null;
  tipo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  descricao?: string | null;
}

export interface Experiencia extends PessoaRelation {
  empresa?: string | null;
  cargo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  descricao?: string | null;
}

export interface Projeto extends PessoaRelation {
  nome?: string | null;
  descricao?: string | null;
  tecnologias: string[];
  github_url?: string | null;
  deploy_url?: string | null;
  imagem_url?: string | null;
}

export interface Habilidade extends PessoaRelation {
  nome?: string | null;
  categoria?: string | null;
  nivel?: string | null;
}

export interface Contato extends PessoaRelation {
  tipo?: string | null;
  valor?: string | null;
}

export interface Curriculo extends Pessoa {
  formacoes: Formacao[];
  experiencias: Experiencia[];
  projetos: Projeto[];
  habilidades: Habilidade[];
  contatos: Contato[];
}
