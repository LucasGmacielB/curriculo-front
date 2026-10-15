const assert = require('node:assert/strict');
const test = require('node:test');
const { AxiosError } = require('axios');

const { loadTypescript } = require('./helpers/load-typescript.cjs');
const { pessoasFixture, curriculoFixture } = require('./fixtures/portfolio.cjs');

function serviceWithResponse(data) {
  const service = loadTypescript('src/services/api.ts');
  const requests = [];
  service.api.defaults.adapter = async (config) => {
    requests.push(config);
    return { data, status: 200, statusText: 'OK', headers: {}, config };
  };
  return { service, requests };
}

test('GET /pessoas accepts the real bare array and preserves API text', async () => {
  const fixture = pessoasFixture();
  const { service, requests } = serviceWithResponse(fixture);
  const controller = new AbortController();
  const pessoas = await service.getPessoas(controller.signal);

  assert.equal(requests[0].url, '/pessoas');
  assert.equal(requests[0].signal, controller.signal);
  assert.deepEqual(pessoas.map(({ id }) => id), [2, 3]);
  assert.equal(pessoas[0].nome, fixture[0].nome);
  assert.equal(pessoas[1].bio, fixture[1].bio);
  assert.equal(pessoas[0].foto_url, null);
});

test('GET /pessoas/:id/curriculo reads the actual root person and all relations', async () => {
  const fixture = curriculoFixture();
  const { service, requests } = serviceWithResponse(fixture);
  const curriculo = await service.getCurriculo(2);

  assert.equal(requests[0].url, '/pessoas/2/curriculo');
  assert.equal(curriculo.id, 2);
  assert.equal(curriculo.bio, fixture.bio);
  assert.equal(curriculo.formacoes[0].instituicao, fixture.formacoes[0].instituicao);
  assert.equal(curriculo.experiencias[0].data_inicio, '2026-09-01');
  assert.deepEqual(curriculo.projetos[0].tecnologias, fixture.projetos[0].tecnologias);
  assert.equal(curriculo.habilidades[0].categoria, 'Back-end');
  assert.equal(curriculo.contatos[0].valor, fixture.contatos[0].valor);
});

test('GET /pessoas/:id/projetos accepts the real project array', async () => {
  const fixture = curriculoFixture().projetos;
  const { service, requests } = serviceWithResponse(fixture);
  const projetos = await service.getProjetos(2);

  assert.equal(requests[0].url, '/pessoas/2/projetos');
  assert.equal(projetos[0].nome, 'Voltix');
  assert.equal(projetos[0].imagem_url, null);
  assert.equal(projetos[0].github_url, null);
  assert.deepEqual(projetos[0].tecnologias, fixture[0].tecnologias);
});

test('missing and null relation arrays become empty lists without invented content', async () => {
  const { service } = serviceWithResponse({ id: 2, formacoes: null, projetos: null, contatos: null });
  const curriculo = await service.getCurriculo(2);

  for (const relation of ['formacoes', 'experiencias', 'projetos', 'habilidades', 'contatos']) {
    assert.deepEqual(curriculo[relation], []);
  }
  assert.equal(curriculo.nome, null);
  assert.equal(curriculo.foto_url, null);
});

test('projects with missing or null technologies remain usable empty lists', async () => {
  const { service } = serviceWithResponse([{ id: 2 }, { id: 3, tecnologias: null }]);
  const projetos = await service.getProjetos(2);
  assert.deepEqual(projetos.map(({ tecnologias }) => tecnologias), [[], []]);
});

test('empty people/project arrays are valid API results', async () => {
  const { service } = serviceWithResponse([]);
  assert.deepEqual(await service.getPessoas(), []);
  assert.deepEqual(await service.getProjetos(2), []);
});

test('people payload wrappers, null bodies, and duplicate IDs fail explicitly', async (t) => {
  const malformed = [
    { name: 'wrapper', data: { pessoas: pessoasFixture() } },
    { name: 'null', data: null },
    { name: 'duplicate IDs', data: [pessoasFixture()[0], pessoasFixture()[0]] },
  ];
  for (const { name, data } of malformed) {
    await t.test(name, async () => {
      const { service } = serviceWithResponse(data);
      await assert.rejects(service.getPessoas(), { name: 'ApiDataError' });
    });
  }
});

test('malformed curriculum fields identify the invalid path', async (t) => {
  const malformed = [
    { name: 'root ID', data: { id: '2' }, path: /currículo\.id/ },
    { name: 'person text', data: { id: 2, nome: 123 }, path: /currículo\.nome/ },
    { name: 'relation array', data: { id: 2, formacoes: {} }, path: /currículo\.formacoes/ },
    { name: 'relation entity', data: { id: 2, experiencias: [null] }, path: /experiencias\[0\]/ },
    { name: 'relation ID', data: { id: 2, formacoes: [{ id: '1' }] }, path: /formacoes\[0\]\.id/ },
    { name: 'technology', data: { id: 2, projetos: [{ id: 1, tecnologias: [42] }] }, path: /tecnologias\[0\]/ },
  ];
  for (const { name, data, path } of malformed) {
    await t.test(name, async () => {
      const { service } = serviceWithResponse(data);
      await assert.rejects(service.getCurriculo(2), path);
    });
  }
});

test('responses for another person cannot commit to the requested curriculum', async () => {
  const { service } = serviceWithResponse({ ...curriculoFixture(), id: 3 });
  await assert.rejects(service.getCurriculo(2), /currículo\.id/);
  await assert.rejects(service.getPessoa(2), /pessoa\.id/);
});

test('invalid person IDs fail before an HTTP request is dispatched', async () => {
  const { service, requests } = serviceWithResponse(curriculoFixture());
  await assert.rejects(service.getCurriculo(-1), /currículo\.id/);
  await assert.rejects(service.getProjetos(NaN), /pessoa\.id/);
  assert.equal(requests.length, 0);
});

test('timeouts, offline errors, and HTTP 503 produce actionable Portuguese messages', async (t) => {
  for (const code of ['ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK', 'ERR_BAD_RESPONSE']) {
    await t.test(code, async () => {
      const { service } = serviceWithResponse(null);
      service.api.defaults.adapter = async (config) => {
        const response = code === 'ERR_BAD_RESPONSE'
          ? { data: {}, status: 503, statusText: 'Service Unavailable', headers: {}, config }
          : undefined;
        throw new AxiosError('Request failed', code, config, undefined, response);
      };
      const error = await service.getCurriculo(2).then(
        () => assert.fail('The request should reject'),
        (failure) => failure,
      );
      const message = service.getApiErrorMessage(error);
      if (code === 'ERR_BAD_RESPONSE') assert.match(message, /temporariamente indisponível/);
      else if (code === 'ERR_NETWORK') assert.match(message, /Verifique sua conexão/);
      else assert.match(message, /demorou mais que o esperado/);
      assert.match(message, /[Tt]ente novamente/);
    });
  }
});

test('aborted requests are identifiable and do not reach the Axios adapter', async () => {
  const { service, requests } = serviceWithResponse(pessoasFixture());
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(service.getPessoas(controller.signal), (error) => service.isCanceledRequest(error));
  assert.equal(requests.length, 0);
});
