# Contrato observado da API

Inspeção realizada em **15/10/2026**, antes da definição dos tipos e das telas. Este documento registra a estrutura observada e as decisões de consumo do aplicativo; não reproduz os currículos completos nem os contatos pessoais.

Base: `https://curriculo-back-curriculo-api.vercel.app`.

## Endpoints

| Método e caminho | Formato da resposta observada |
| --- | --- |
| `GET /pessoas` | Array JSON de pessoas: `Pessoa[]` |
| `GET /pessoas/:id` | Um objeto `Pessoa` |
| `GET /pessoas/:id/curriculo` | Um objeto `Curriculo`, com campos da pessoa e relações no mesmo nível |
| `GET /pessoas/:id/projetos` | Array JSON de projetos: `Projeto[]` |

`/pessoas` não possui um envelope `{ value, Count }`. Essa apresentação pode ser produzida pela serialização de uma coleção no PowerShell; ela não faz parte da resposta HTTP da API. O serviço Axios espera o array diretamente.

O currículo é **plano**: `nome`, `email`, `titulo` e os demais campos da pessoa ficam junto de `formacoes`, `experiencias`, `projetos`, `habilidades` e `contatos`. Não existe uma propriedade intermediária `pessoa` ou `data` no formato inspecionado.

## Campos

Nos tipos do aplicativo, o identificador é obrigatório. Os textos e metadados opcionais aceitam ausência ou `null`, pois a interface deve lidar com dados incompletos. Os nomes dos campos preservam a API: datas e chaves estrangeiras usam `snake_case`; os timestamps do Sequelize usam `createdAt` e `updatedAt`.

```typescript
interface Entity {
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface PessoaRelation extends Entity {
  pessoa_id?: number | null;
}

interface Pessoa extends Entity {
  nome?: string | null;
  email?: string | null;
  titulo?: string | null;
  bio?: string | null;
  foto_url?: string | null;
  localizacao?: string | null;
}

interface Formacao extends PessoaRelation {
  instituicao?: string | null;
  curso?: string | null;
  tipo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  descricao?: string | null;
}

interface Experiencia extends PessoaRelation {
  empresa?: string | null;
  cargo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  descricao?: string | null;
}

interface Projeto extends PessoaRelation {
  nome?: string | null;
  descricao?: string | null;
  tecnologias: string[];
  github_url?: string | null;
  deploy_url?: string | null;
  imagem_url?: string | null;
}

interface Habilidade extends PessoaRelation {
  nome?: string | null;
  categoria?: string | null;
  nivel?: string | null;
}

interface Contato extends PessoaRelation {
  tipo?: string | null;
  valor?: string | null;
}

interface Curriculo extends Pessoa {
  formacoes: Formacao[];
  experiencias: Experiencia[];
  projetos: Projeto[];
  habilidades: Habilidade[];
  contatos: Contato[];
}
```

Essas interfaces estão em `src/types/portfolio.ts`. `tecnologias` foi observado como **array de strings**, inclusive em `/pessoas/:id/projetos`; não é um texto separado por vírgulas. `createdAt` e `updatedAt` vieram como strings de timestamp ISO, e a data de início profissional preenchida estava no formato `YYYY-MM-DD`.

## Perfis observados

| ID | Perfil | Formações | Experiências | Projetos | Habilidades | Contatos |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 2 | Lucas Gabriel Maciel de Barros | 2 | 1 | 4 | 12 | 1 |
| 3 | Mariana Oliveira | 1 | 1 | 2 | 6 | 1 |

Esses IDs e números descrevem a inspeção, não são codificados como limite ou seleção fixa na interface. O aplicativo utiliza a lista atual de `/pessoas`.

O perfil de Mariana inclui “Universidade Exemplo” e um e-mail no domínio `example.com`. São valores reais da resposta publicada, embora aparentem ser conteúdo de exemplo do próprio back-end. O aplicativo não os substitui por informações inventadas.

## Campos nulos e confirmações pendentes

- `foto_url` estava nulo nos dois perfis.
- `github_url`, `deploy_url` e `imagem_url` estavam nulos em todos os projetos. É necessário testar URLs preenchidas, imagens válidas e falhas de carregamento antes da entrega final em aparelho.
- `data_inicio` e `data_fim` estavam nulos em todas as formações. Não é possível confirmar o formato de uma data acadêmica preenchida apenas por essas respostas.
- Uma experiência tinha `data_inicio` preenchida e `data_fim` nula; a outra tinha ambas nulas. O aplicativo não interpreta ausência da data final como confirmação de emprego atual.
- `nivel` estava nulo em todas as habilidades. `string | null` é o contrato adotado no cliente para o nível textual opcional, mas um valor não nulo ainda precisa ser confirmado com o back-end. Se o servidor publicar números ou uma estrutura diferente, os tipos e o parser devem ser ajustados explicitamente.
- `categoria` das habilidades e `tipo` das formações estavam preenchidos como texto. Os contatos inspecionados eram do tipo GitHub; outros tipos ainda precisam ser verificados com valores reais.

## Validação e normalização no cliente

O serviço recebe respostas Axios como `unknown` e valida sua estrutura antes de disponibilizá-las às telas. IDs precisam ser inteiros positivos seguros; a lista de pessoas não pode repetir IDs; uma resposta de pessoa ou currículo deve corresponder ao ID solicitado.

Textos ausentes ou nulos tornam-se `null`. Relações e tecnologias ausentes ou nulas tornam-se arrays vazios. Se estiverem presentes com um tipo incompatível, a resposta é tratada como erro de contrato em vez de ser preenchida com dados fictícios. Os endpoints que retornam uma lista na raiz exigem um array válido.

O cliente usa timeout de 20 segundos por requisição e permite cancelamento. O contexto publica currículo e identidade juntos e ignora respostas de operações anteriores. Em caso de erro, a interface oferece **Tentar novamente**; não utiliza snapshots locais como fallback.

## Política de links

`src/utils/links.ts` permite URLs web com protocolo HTTP ou HTTPS, host válido, sem espaços/caracteres de controle e sem credenciais no endereço. O e-mail recebe validação antes de gerar `mailto:`; o telefone precisa produzir de 7 a 15 dígitos, com `+` inicial opcional, antes de gerar `tel:`. Protocolos arbitrários não são aceitos. Falhas na abertura são tratadas pela interface.

## Atualizar este contrato

Ao alterar o back-end, confirme primeiro a resposta HTTP real dos quatro endpoints. Atualize os tipos, parsers e testes em conjunto, especialmente se houver mudança de envelope, nomes, formato de datas ou tipo de `nivel`. Não copie respostas completas com dados pessoais para este documento.
