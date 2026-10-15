# dev.fólio — Portfólio profissional mobile

Aplicativo de currículos e projetos com React Native, Expo SDK 57, TypeScript e Expo Router. As cinco abas apresentam os dados do perfil selecionado, carregados da API REST publicada na Vercel. A interface usa tema escuro, destaques em azul e roxo, ícones de `@expo/vector-icons` e estilos com `StyleSheet`.

## Executar no Android com Expo Go

Tenha Node.js compatível com o [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), npm e uma versão do Expo Go que suporte esse SDK no celular.

```bash
npm install
npx expo start
```

Conecte o computador e o celular à mesma rede e leia o QR code no Expo Go. O celular precisa de acesso à internet para consultar a API. O comando `npx expo start --go` pode ser usado para escolher explicitamente o Expo Go.

Se o celular não alcançar o servidor de desenvolvimento, tente explicitar a conexão local:

```bash
npx expo start --lan
```

Em redes que bloqueiam conexões entre dispositivos, há também a opção de túnel:

```bash
npx expo start --tunnel
```

O túnel depende do serviço ngrok e pode exigir sua ferramenta auxiliar; siga a orientação da CLI. Ele conecta o celular ao servidor de desenvolvimento, enquanto as consultas à API continuam saindo do próprio celular. Veja as opções na [documentação da Expo CLI](https://docs.expo.dev/more/expo-cli/).

## Telas e organização

| Rota | Aba | Conteúdo |
| --- | --- | --- |
| `src/app/index.tsx` | Início | Identificação, apresentação, localização, contadores, atalhos e destaque de projeto |
| `src/app/sobre.tsx` | Sobre | Biografia, habilidades por categoria e contatos profissionais |
| `src/app/formacao.tsx` | Formação | Cursos e instituições em uma linha do tempo |
| `src/app/experiencias.tsx` | Experiências | Cargos, empresas, períodos e atividades |
| `src/app/projetos.tsx` | Projetos | Descrição, tecnologias, imagens e links disponíveis |

`src/app/_layout.tsx` monta as abas e o provedor global. Existe uma única árvore de rotas, em `src/app/`.

```text
src/
  app/          Rotas e navegação com Expo Router
  components/   Tela base, seletor de perfil, avatar, projetos e elementos reutilizáveis
  constants/    Paleta de cores
  contexts/     Estado global e ciclo de carregamento dos currículos
  hooks/        Acesso tipado ao contexto
  services/     Cliente Axios, validação de respostas e mensagens de erro
  types/        Contrato TypeScript do portfólio
  utils/        Formatação de datas, iniciais, categorias e validação de links
docs/
  api-contract.md  Estrutura observada nas respostas reais da API
```

## Integração e alternância de perfis

A base da API está definida em `src/services/api.ts`:

```text
https://curriculo-back-curriculo-api.vercel.app
```

Ao iniciar, o contexto busca `GET /pessoas` e carrega `GET /pessoas/:id/curriculo` para a primeira pessoa retornada. O seletor **Trocar perfil**, disponível nas telas, permite escolher qualquer pessoa da lista. O currículo completo já contém as relações necessárias às cinco abas; os serviços também expõem consultas de pessoa e projetos individuais.

A seleção é mantida na memória durante a sessão. Ao reabrir ou recarregar completamente o aplicativo, a lista é consultada novamente e o primeiro perfil é selecionado. Não existe armazenamento persistente nem cache offline.

Durante a troca, há indicadores de carregamento. A identidade selecionada e o currículo são atualizados juntos, apenas após uma resposta válida. Se a troca falhar, o currículo anterior permanece disponível e **Tentar novamente** repete a operação. Uma nova solicitação cancela a anterior com `AbortController`; respostas antigas não podem sobrescrever a seleção mais recente. Um erro 404 faz a próxima tentativa atualizar a lista de pessoas.

Puxar o conteúdo para baixo atualiza a lista e o currículo, preservando a pessoa selecionada se ela ainda existir. As chamadas Axios têm timeout de **20 segundos por requisição**. Falhas de rede, indisponibilidade, limite de requisições e dados em formato inesperado recebem mensagens próprias.

## Dados ausentes, imagens e links

Todas as informações profissionais vêm do back-end. Não há currículos ou projetos locais usados como substitutos da API. Fotos ausentes ou com falha exibem iniciais; projetos sem imagem exibem uma capa decorativa criada com elementos da interface. Esses recursos visuais não representam fotos ou capturas reais dos projetos.

Listas vazias têm mensagens específicas. Campos opcionais são ocultados ou recebem uma indicação de ausência. Datas desconhecidas não são inventadas, e uma data final nula não é automaticamente apresentada como vínculo atual.

Links web aceitam somente `https://` ou `http://`, com host válido e sem credenciais embutidas. Endereços de e-mail e telefone são validados antes de gerar links `mailto:` e `tel:`. Links inválidos ficam desabilitados; falhas ao abrir um aplicativo externo exibem um aviso. A validação do endereço não verifica a reputação ou a disponibilidade do site.

Na inspeção de **15/10/2026**, a API retornou Lucas Gabriel Maciel de Barros e Mariana Oliveira. Lucas tinha quatro projetos e Mariana, dois. Fotos, imagens e links dos projetos estavam nulos. O perfil de Mariana contém uma instituição chamada “Universidade Exemplo” e um e-mail no domínio `example.com`: esses valores são retornados pela API, não foram criados pelo aplicativo. Os detalhes técnicos e pontos a confirmar estão em [docs/api-contract.md](docs/api-contract.md).

## Verificações do projeto

Execute os comandos abaixo para validar futuras alterações:

```bash
npx tsc --noEmit
npx expo lint
npx expo install --check
npx expo-doctor
npm test
```

Validação desta implementação: TypeScript e lint sem erros ou avisos, **32 testes aprovados**, dependências compatíveis com o SDK 57, **21/21 verificações do Expo Doctor** e exportação Android com bytecode Hermes concluída. A exportação valida o bundle; o checklist em aparelho abaixo continua pendente.

O `npm audit` reportou **29 alertas de dependências** (11 moderados e 18 altos), incluindo a árvore Expo/Metro. As sugestões automáticas incluem versões incompatíveis com o SDK 57 exigido, como Expo 44 e React Native 0.72. A revisão desses alertas fica pendente antes da publicação; não foi aplicada uma troca de SDK ou uma correção forçada.

Use `npx expo install <pacote>` para adicionar dependências com versões compatíveis com o SDK. Não crie ou edite diretórios nativos gerados manualmente.

## Checklist manual no Android

- [ ] Abrir no Expo Go compatível com SDK 57 e navegar pelas cinco abas e pelos atalhos da Home.
- [ ] Conferir áreas seguras, barras do sistema, rolagem e botão/gesto Voltar do Android; verificar também o fechamento do seletor.
- [ ] Alternar entre os dois perfis e conferir nome, contatos, formação, experiência, habilidades e projetos em todas as abas. Na inspeção de 15/10/2026, os contadores de projetos eram quatro para Lucas e dois para Mariana; alterações no back-end podem mudar esses números.
- [ ] Confirmar que a seleção permanece ao navegar e reinicia no primeiro resultado de `/pessoas` após recarregar completamente o aplicativo.
- [ ] Testar carregamento inicial sem conexão, reconexão e **Tentar novamente**.
- [ ] Testar falha de rede durante uma troca: o perfil anterior deve permanecer disponível, com opção de repetir a tentativa. Testar também trocas rápidas para verificar que prevalece a última solicitação.
- [ ] Puxar para atualizar e conferir a atualização conjunta do perfil e dos contadores.
- [ ] Conferir listas vazias e campos opcionais ausentes; testar imagem inexistente e erro ao baixar uma imagem com dados de teste controlados no back-end ou em testes locais.
- [ ] Abrir os contatos reais disponíveis e verificar ausência de aplicativo de e-mail/telefone. Links de projetos válidos e inválidos precisam de dados de teste controlados, pois estavam todos nulos na API inspecionada.
- [ ] Conferir a interface em celular pequeno, tela maior e com o tamanho de fonte aumentado no Android.

## EAS Update: etapa posterior

EAS Update não foi configurado nem publicado nesta etapa. Depois da validação das telas, será necessário vincular o projeto ao EAS, configurar `expo-updates`, runtime e canais, e gerar um aplicativo próprio compatível para receber atualizações OTA. O Expo Go é utilizado aqui para desenvolvimento e não substitui esse aplicativo na validação da distribuição. Consulte a [introdução ao EAS Update](https://docs.expo.dev/eas-update/introduction/).
