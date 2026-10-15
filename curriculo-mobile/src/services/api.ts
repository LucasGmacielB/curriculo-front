import { create, isAxiosError, isCancel } from 'axios';

import type {
  Contato,
  Curriculo,
  Experiencia,
  Formacao,
  Habilidade,
  Pessoa,
  Projeto,
} from '@/types/portfolio';

export const API_BASE_URL = 'https://curriculo-back-curriculo-api.vercel.app';

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

class ApiDataError extends Error {
  constructor(path: string) {
    super(`A API retornou dados em um formato inesperado (${path}). Tente novamente.`);
    this.name = 'ApiDataError';
  }
}

type ApiObject = Record<string, unknown>;
type Parser<T> = (value: unknown, path: string) => T;

function object(value: unknown, path: string): ApiObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiDataError(path);
  }
  return value as ApiObject;
}

function id(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new ApiDataError(path);
  }
  return value;
}

function optionalId(value: unknown, path: string): number | null {
  return value == null ? null : id(value, path);
}

function text(value: unknown, path: string): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') throw new ApiDataError(path);
  return value;
}

function list<T>(value: unknown, path: string, parse: Parser<T>, optional = true): T[] {
  if (optional && value == null) return [];
  if (!Array.isArray(value)) throw new ApiDataError(path);
  return value.map((item: unknown, index: number) => parse(item, `${path}[${index}]`));
}

function entity(value: ApiObject, path: string) {
  return {
    id: id(value.id, `${path}.id`),
    createdAt: text(value.createdAt, `${path}.createdAt`),
    updatedAt: text(value.updatedAt, `${path}.updatedAt`),
  };
}

function relation(value: ApiObject, path: string) {
  return {
    ...entity(value, path),
    pessoa_id: optionalId(value.pessoa_id, `${path}.pessoa_id`),
  };
}

function parsePessoa(value: unknown, path: string): Pessoa {
  const data = object(value, path);
  return {
    ...entity(data, path),
    nome: text(data.nome, `${path}.nome`),
    email: text(data.email, `${path}.email`),
    titulo: text(data.titulo, `${path}.titulo`),
    bio: text(data.bio, `${path}.bio`),
    foto_url: text(data.foto_url, `${path}.foto_url`),
    localizacao: text(data.localizacao, `${path}.localizacao`),
  };
}

function parseFormacao(value: unknown, path: string): Formacao {
  const data = object(value, path);
  return {
    ...relation(data, path),
    instituicao: text(data.instituicao, `${path}.instituicao`),
    curso: text(data.curso, `${path}.curso`),
    tipo: text(data.tipo, `${path}.tipo`),
    data_inicio: text(data.data_inicio, `${path}.data_inicio`),
    data_fim: text(data.data_fim, `${path}.data_fim`),
    descricao: text(data.descricao, `${path}.descricao`),
  };
}

function parseExperiencia(value: unknown, path: string): Experiencia {
  const data = object(value, path);
  return {
    ...relation(data, path),
    empresa: text(data.empresa, `${path}.empresa`),
    cargo: text(data.cargo, `${path}.cargo`),
    data_inicio: text(data.data_inicio, `${path}.data_inicio`),
    data_fim: text(data.data_fim, `${path}.data_fim`),
    descricao: text(data.descricao, `${path}.descricao`),
  };
}

function parseProjeto(value: unknown, path: string): Projeto {
  const data = object(value, path);
  return {
    ...relation(data, path),
    nome: text(data.nome, `${path}.nome`),
    descricao: text(data.descricao, `${path}.descricao`),
    tecnologias: list(data.tecnologias, `${path}.tecnologias`, (item, itemPath) => {
      if (typeof item !== 'string') throw new ApiDataError(itemPath);
      return item;
    }),
    github_url: text(data.github_url, `${path}.github_url`),
    deploy_url: text(data.deploy_url, `${path}.deploy_url`),
    imagem_url: text(data.imagem_url, `${path}.imagem_url`),
  };
}

function parseHabilidade(value: unknown, path: string): Habilidade {
  const data = object(value, path);
  return {
    ...relation(data, path),
    nome: text(data.nome, `${path}.nome`),
    categoria: text(data.categoria, `${path}.categoria`),
    nivel: text(data.nivel, `${path}.nivel`),
  };
}

function parseContato(value: unknown, path: string): Contato {
  const data = object(value, path);
  return {
    ...relation(data, path),
    tipo: text(data.tipo, `${path}.tipo`),
    valor: text(data.valor, `${path}.valor`),
  };
}

function parseCurriculo(value: unknown): Curriculo {
  const data = object(value, 'currículo');
  return {
    ...parsePessoa(data, 'currículo'),
    formacoes: list(data.formacoes, 'currículo.formacoes', parseFormacao),
    experiencias: list(data.experiencias, 'currículo.experiencias', parseExperiencia),
    projetos: list(data.projetos, 'currículo.projetos', parseProjeto),
    habilidades: list(data.habilidades, 'currículo.habilidades', parseHabilidade),
    contatos: list(data.contatos, 'currículo.contatos', parseContato),
  };
}

export async function getPessoas(signal?: AbortSignal): Promise<Pessoa[]> {
  const { data } = await api.get<unknown>('/pessoas', { signal });
  const pessoas = list(data, 'pessoas', parsePessoa, false);
  if (new Set(pessoas.map((pessoa) => pessoa.id)).size !== pessoas.length) {
    throw new ApiDataError('pessoas.id duplicado');
  }
  return pessoas;
}

export async function getPessoa(pessoaId: number, signal?: AbortSignal): Promise<Pessoa> {
  id(pessoaId, 'pessoa.id');
  const { data } = await api.get<unknown>(`/pessoas/${pessoaId}`, { signal });
  const pessoa = parsePessoa(data, 'pessoa');
  if (pessoa.id !== pessoaId) throw new ApiDataError('pessoa.id');
  return pessoa;
}

export async function getCurriculo(pessoaId: number, signal?: AbortSignal): Promise<Curriculo> {
  id(pessoaId, 'currículo.id');
  const { data } = await api.get<unknown>(`/pessoas/${pessoaId}/curriculo`, { signal });
  const curriculo = parseCurriculo(data);
  if (curriculo.id !== pessoaId) throw new ApiDataError('currículo.id');
  return curriculo;
}

export async function getProjetos(pessoaId: number, signal?: AbortSignal): Promise<Projeto[]> {
  id(pessoaId, 'pessoa.id');
  const { data } = await api.get<unknown>(`/pessoas/${pessoaId}/projetos`, { signal });
  return list(data, 'projetos', parseProjeto, false);
}

export function isCanceledRequest(error: unknown): boolean {
  return isCancel(error);
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiDataError) return error.message;
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'A conexão demorou mais que o esperado. Tente novamente em instantes.';
    }
    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.';
    }
    if (error.response.status === 404) {
      return 'Este currículo não está disponível. Atualize os perfis e tente novamente.';
    }
    if (error.response.status === 429) {
      return 'A API recebeu muitas solicitações. Aguarde um momento e tente novamente.';
    }
    if (error.response.status >= 500) {
      return 'A API está temporariamente indisponível. Tente novamente em instantes.';
    }
    return 'Não foi possível carregar os dados da API. Tente novamente.';
  }
  return 'Ocorreu um problema ao carregar o currículo. Tente novamente.';
}
