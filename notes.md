# ANOTAÇÕES

## CONCEITOS INICIAIS

- [Async, Promises, Callbacks, Event Loop - JS](https://youtu.be/NQFQQonyAxI)
- [Promise do zero em Javascript/Node js [pt1]: Async I/O, Callbacks e Event Loop](https://youtu.be/CcL2WZRvROQ)


## #3 API em NodeJS com Clean Architecture e TDD - Login Router 1/4

O conceito de TDD é justamente criar o teste instanciando classes que ainda não existem para depois criar o código dessas classes.

Uma prática comum é criar as classes dentro do arquivo de teste até o teste que usa elas passar, após isso fazemos a modularização, movemos elas para a pasta correta.

Nosso primeiro teste vai dar erro justamente por que estas classes não existem e devemos cria-las até o teste passar com o que se espera (`expect`) delas. 

**SUT**

Um padrão muito utilizado em testes unitarios é chamar o objeto que estamos testando de `SUT` (System Under Test). 

```js
const sut = new LoginRouter()
```

Isso é feito por que em testes mais complexos pode ter varias instancias de uma classe ou objeto, e o sut é uma forma de identificador para aquele objeto que se esta testando.

**STANDARD E LINT-STAGED**

Este comando vai corrigir o código para o padrão [https://standardjs.com/](https://standardjs.com/):

```sh
npx standard --fix
```

Este comando vai executar todos os outros comandos `"lint-staged` listados `package.json` somente para os arquivos no stage area (`git add`) do git:

```sh
npx lint-staged
```

**REFATORAÇÃO: LEGIBILIDADE DE CÓDIGO**

Antes, nossa classe `LoginRouter` retornava o statusCode assim:

```js
return {
  statusCode: 400
}
```

Mas existem varios `statusCode` cada um com uma mensagem diferentes. Uma forma de padronizar e abstrair é criar uma classe somente para o retorno de httpResponse:

```js
class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param ${paramName}`)
    this.name = 'MissingParamError'
  }
}

class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }
  ...
}
```

Agora o retorno vai ser assim:

```js
return HttpResponse.badRequest('email')
```

## #4 API em NodeJS com Clean Architecture e TDD - Login Router 2/4

**ESTRUTURA DE PASTAS**

Faça em sh no markwdown uma estrutura de pastas explicando o que cada uma tem de arquivo e a função dela:

`src/presentation/helpers/**`

Dentro de helpers ficam as classes auxiliares, abstração de retornos e customização de erros.

`src/presentation/router/**`

Em router ficam nossas rotas cada uma com seu arquivo de teste.

**FACTORY**

Design Pattern Factory serve para evitar de quebrar a nossa aplicação quando a gente altera a instancia de um objeto.

No nosso caso estavamos criando uma instancia diferente de `LoginRouter` para cada teste. 

```js
const sut = new LoginRouter()
```

Com o patter a gente cria uma função externa que retorna a instancia uma unica vez.

```js
const makeSut = () => {
  const sut = new LoginRouter()
  return {
    sut
  }
}

describe('', () => {
  it('', () => {
    const { sut } = makeSut()
  })
})
```

Desta forma a gente reduz as mudanças individuais em cada teste.

**DEPENDECY INJECTION**

```js
class AuthUseCaseSpy {
  auth (email, password) {
    this.email = email
    this.password = password
  }
}
class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }
  ...
}
const makeSut = () => {
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy) 
  return { sut, authUseCaseSpy }
}
```

Estamos "injetando" a instancia `authUseCaseSpy` no construtor da classe `LoginRouter`. Desta forma, mesmo que o módulo da classe não esteja importada em `LoginRouter` ela passa a fazer parte como um médoto interno herdado por ela.

```js
class LoginRouter {
  ...
  route (httpRequest) {
    const { email, password } = httpRequest.body
    this.authUseCase.auth(email, password)
  }
}
```

**TESTE DE INTEGRAÇÃO**

Estamos fazendo um teste de integração entre nosso caso de uso (Regras de Negócio) `AuthUseCaseSpy` com nossa rota de autenticação `LoginRouter`.

Isto a nível de código com a Dependency Injection e nos teste verificamos se os valores que passamos para o sut é a mesma (`toBe`) do authUseCaseSpy que ele recebeu internamente:

```js
it('', () => {
  const { sut, authUseCaseSpy } = makeSut()
  const httpRequest = {...}
  sut.route(httpRequest)
  expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
})
```

**TEST DOUBLES**

O que estamos testando é o comportamento de `LoginRouter`, portanto a classe `AuthUseCaseSpy` ainda esta no arquivo de teste, ela é um spie que esta nos ajudando a testar `LoginRouter`.

Existe varios "Test Doubles" (Dublês de testes): Mocks, Stubs, Fakes, Spies e Dummies.

Leitura adicional: ["Test Doubles (Mocks, Stubs, Fakes, Spies e Dummies)" Escrito por Pablo Rodrigo Darde](https://medium.com/rd-shipit/test-doubles-mocks-stubs-fakes-spies-e-dummies-a5cdafcd0daf)

**STATUS CODE**

Ainda existe muita confusão quanto aos `STATUS_CODE/401` e `STATUS_CODE/403`. O 401 (unauthorized) é usado quando o sistema não identificou quem é o usuário na base de dados. O 403 é usado quando o sistema conseguiu identificar quem é o usuário, mas ele não tem permissão para executar aquela ação, um exemplo de quando isso ocorre é em perfis com níveis de permissão (user x admin).

## #5 API em NodeJS com Clean Architecture e TDD - Login Router 3/4

## #6 API em NodeJS com Clean Architecture e TDD - Login Router 4/4

Quando não se modifica um arquivo de teste e tanta rodar o comando lint-staged o Jest falha quand não existe tests, a flag `--passWithNoTests` faz ele pular ou executar mesmo na ausência de testes.

Linguagens compiladas (C#, Java, Swift, Kotlin) geralmente possuem Interfaces (protocolos). Em JavaScript as dependence injection se comportam como protocolos, conheço somente a assinatura dele (sei que é uma classe, qual método ele tem, quais parametros ele tem e o que ele retorna, igual um protocolo)

## #7 API em NodeJS com Clean Architecture e TDD - CI & Jest 1/2

Configurações para o Jest.

`--passWithNoTests` executa mesmo quando não existem testes.
`--watchAll` roda todos os testes em qualquer arquivo.
`--watch` internamente usa o `--onlyChange` que só executa os arquivos de teste modificados. 
`--findRelatedTests` só executa os arquivos de teste modificados sem o o modo `--watch`.
`--silent` oculta a lista de testes e só mostra o resultado.
`--silent --verbose` mostra a lista de testes mas sem os console do código.
`--colors` aplica cores de sucesso ou erro em terminais fora do vscode.
`--noStackTrace` mostra somente o que falhou.
`--coverage` relatório se todos os arquivos do projetos estão cobertos por testes.

Hook de CI:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "pre-push": "npm run test:ci"
  }
},
```

## #8 API em NodeJS com Clean Architecture e TDD - CI & Jest 2/2

Tem uma forma de reaproveitar comandos/flag nos scripts do `package.json`, basta adiciona os comando que se repetem em um script e executa ele nos próximos que dependam dele com `npm [script-nome] --` (não precisa de `npm run`) os dois traços indicam que os próximo comandos farão parte dele ao final.

```json
"scripts": {
  "test": "jest --colors --noStackTrace --passWithNoTests --runInBand",
  "test:unit": "npm test -- --watch -c jest-unit-config.js",
  "test:integration": "npm test -- --watch -c jest-integration-config.js",
  "test:staged": "npm test -- --findRelatedTests --silent",
  "test:ci": "npm test -- --coverage --silent",
  "test:coveralls": "npm run test:ci && coveralls < coverage/lcov.info"
},
```

Então, quando executamos `test:coveralls` ele executa o `test:ci` e recebe todos os comandos dele, e o `test:ci` por fim recebe todos os parametros do `test`.

Por padrão, o Jest reconhece como arquivo de teste todo arquivo com `.test.js` ou `.spec.js`. Para que não se mistura as duas formas você pdoe especificar criando um arquivo `jest-unit-config.js` com configurações especificas para testes unitários e `jest-integration-config.js` com configurações especificas para testes de integração.

```javascript 
// jest-unit-config.js
const config = require('./jest-config')
config.testMatch = ['**/*.spec.js']
module.exports = config
```

Neste exemplo estamos importando as configurações gerais do `jest-config.js` e adicionando as configurações especificas para o teste unitário. Neste caso estamos trabalhando com testes unitários em arquivos `.spec.js` e testes de integração em `.test.js`.

Para vincular cada configuração a um script diferente basta adicionar -c e o nome do arquivo

```json
"scripts": {
  "test:unit": "npm test -- --watch -c jest-unit-config.js",
  "test:integration": "npm test -- --watch -c jest-integration-config.js"
}
```

Por default, sem o `-c` o Jests usa as configurações de `jest.config.js`.

## #9 API em NodeJS com Clean Architecture e TDD - Email Validator

Refatoração:

- `/helpers` está poluída (muitos arquivos), misturando response com errors. Vamos separar em `/helpers/errors/`.
- Existem muitos arquivos de import. Uma estratégia elegante é exportar tudo a partir de um arquivo `index.js`:

```js
// errors/index.js
const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')
const ServerError = require('./server-error')
const InvalidParamError = require('./invalid-param-error')

module.exports = {
  MissingParamError,
  UnauthorizedError,
  ServerError,
  InvalidParamError
}

// login-router.spec.js
const { MissingParamError, UnauthorizedError, ServerError, InvalidParamError } = require('../errors')
```

Temos que implementar nossa classe `EmailValidator`, ja temos um mock/spy dela nos testes mas ela não esta implementada de fato. Como este recurso é bem genérico e pode ser reaproveitado em varios casos de uso é melhor deixa-lo em um diretório `presentation/utils/`. Nossa classe será simplesmente um wrapper para um serviço de terceiro, seja uma lib ou um regex. Vamos usar nesse exemplo o componente `validator@13.12.0`.

O primeiro teste será para a validação retornar true quando for um email valido;
O segundo teste será para a validação retornar false quando for um email invalido. Neste passo devemos usar o `validator`. 

Porém, não queremos testar se o validator funciona, por que a gente usa bibliotecas ja partindo deste pressuposto. Então, o que queremos na verdade é a integração dele com o meu componente. Devemos mockar para não utilizar ele nos testes. 

Com o Jest, criamos uma pasta `__mocks__` com um arquivo com o mesmo nome da lib que estamos testando (`validator.js`). O Jest ja entende que a lib vai ser substituida pelo arquivo da versão "mockada".

O terceiro teste verifica se o email a ser validado é o mesmo que foi validado.

## #10 API em NodeJS com Clean Architecture e TDD - Auth UseCase 1/4

Casos de uso ou regras de negócio ficam na camada de dominio (DDD). Nossa classe `AuthUseCase` e os testes `auth-usecase.spec.js` ficarão na pasta `src/domain/usecases/`.

Ao invés de se escrever uma `new Promise()` com `reject` e o `resolve` a gente substitui pelo `async/await` que é uma forma mais elegante de escrever `promises` no JavaScript.

```js
class AuthUseCaseSpy {
  async auth (email, password) {}
}

it('should throw if no email is provided', async () => {
  const sut = new AuthUseCaseSpy()
  const promise = sut.auth()
  expect(promise).rejects.toThrow()
})
```

No nosso caso chamamos uma função asincrona sem o await no nosso teste, isso é possível por que a função esta retornando simplesmente uma `promise` (.then, .cath)

## #11 API em NodeJS com Clean Architecture e TDD - Auth UseCase 2/4

Para autenticar o usuário vamos partir da premissa de que a gente vai guardar a senha no banco de dados criptografada. 

O algorítmo que usaremos não permite descriptografar uma senha. Não podemos fazer uma consulta simples no banco de dados, os algoritmos de critografia sempre geram uma hash diferente, mesmo para valores iguais, então a hash gerada após o usuário escrever a senha de login sempre será diferente e nunca retornará uma consulta válida no banco de dados. É por isso que as bibliotecas de criptografia oferecem um método auxiliar de comparação, onde vamos informar nos parametros do método a string com a senha do usuário e a hash que é a senha do usuário criptografada e armazenada no banco de dados.

Vídeos auxiliares:

- [#1 UTF-8 Encoding](https://youtu.be/RNL8m2voKbI?si=vC32Yzv34QRTGI8Y)
- [#2 Base-64 Encoding](https://youtu.be/7rTStT34G9M?si=P8AewP5TNBJYMnoK)
- [#3 Hashing vs Encryption](https://youtu.be/u-H0jSyoMjc?si=RjE2y28MeIqg_Quj)

`AuthUseCase` não faz acesso ao banco de dados, quem fica responsável por isso é a camada de infraestrura (`repository`). 

Então temos que integrar os dois via `dependency injection`: passando a instancia da classe `LoadUserByEmailRepositorySpy` no construtor do AuthUseCaseSpy e validando no teste (`expect`) se o email passado no método `sut.auth()` é o mesmo (`toBe()`) que o do `LoadUserByEmailRepositorySpy`.

Os próximos testes são para validar se `AuthUseCaseSpy` e `LoadUserByEmailRepositorySpy` estão integrados corretamente.

O primeiro teste é se `AuthUseCaseSpy` esta recebendo no construtor o `loadUserByEmailRepositorySpy`.

## #12 API em NodeJS com Clean Architecture e TDD - Auth UseCase 3/4

Modularizar `AuthUseCase`.
Refatoração:

```js
// auth-usecase.js
class AuthUseCase {
  async auth (email, password) {
    if (!this.loadUserByEmailRepository) throw new MissingParamError('loadUserByEmailRepository')
    if (!this.loadUserByEmailRepository.load) throw new InvalidParamError('loadUserByEmailRepository')
  }
}
```

É opcional, mas vamos sacrificar os erros personalizados em cada if por algumas linhas de código. A classe ainda retorna uma exceção, então nos testes nós vamos dizer que esperamos (`expect`) uma exceção genérica (`toThrow()`)

Em nossos testes queremos que o user seja null se método `load` da classe `LoadUserByEmailRepositorySpy` retornar null, mas não estamos retornando nada, então `user` é undefined (`!undefined = null`). Nosso teste era um falso positivo.
`
Então temos que mockar um valor padrão de user valido, como fizemos em outros testes.

```js
// auth-usecase.spec.js
const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
loadUserByEmailRepositorySpy.user = {} // por padrão um user válido	
```

Agora vamos testar a integração com a biblioteca de criptografia.
- Não estamos preocupados com o retorno do AuthUseCase
- Tem que ter uma email valido, mas a senha pode ser qualquer coisa
- Criar a classe `EncrypterSpy` 

Para o teste esperamos (`expect`) que `encrypterSpy.password` seja a mesma (`toBe`) que a password que passamos e que `encrypterSpy.hashedPassword` seja a mesma (`toBe`) que `loadUserByEmailRepositorySpy.user.password`.

Para gerar o token de autenticação devemos integrar com outro componente que vamos chamar de `TokenGenerator` que gerará um token pelo ID do usuário. O token generator é similiar a bibliotecas de criptografia mas ele permite descriptografar.

## #13 API em NodeJS com Clean Architecture e TDD - Auth UseCase 4/4

Precisamos armazenar o token de acesso na tabela do usuário para concluir o Use Case. Mas para fazer isso a gente vai precisar incluir mais uma `dependency injection` no construtor da classe `AuthUseCase`, que ja tem três, a ordem importa, portanto vamos refatorar essa classe.

O que podemos fazer é passar um unico objeto para o construtor e este objeto vai ter cada dependencia como propriedades internas.

```js
class AuthUseCase {
  constructor ({ 
    loadUserByEmailRepository, 
    encrypter, 
    tokenGenerator 
  }) {}
}

new AuthUseCase({
  loadUserByEmailRepository: loadUserByEmailRepositorySpy, 
  encrypter: encrypterSpy, 
  tokenGenerator: tokenGeneratorSpy
})
```

Desta forma, dois testes que usam diretamente a instancia de `AuthUseCase` nossos testes vão falhar:

```js
it('should throw if no loadUserByEmailRepository is provided', async () => {
  // const sut = new AuthUseCase()
  const sut = new AuthUseCase({})
})

it('should throw if no loadUserByEmailRepository has no load method', async () => {
  // const sut = new AuthUseCase({})
  const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
})
```

Com essa refatoração criamos mais um caso para testar: quando o construtor não receber nenhum objeto `new AuthUseCase()` ele deve retornar um Throw também.

Podemos refatorar o construtor para receber um args ou valor padrão (objeto vazio):

```js
class AuthUseCase {
  // primeira opção: um if sempre é o mais deselegante
  constructor (args) {
    if(args){
      this.loadUserByEmailRepository = args.loadUserByEmailRepository
      this.encrypter = args.encrypter
      this.tokenGenerator = args.tokenGenerator
    }
  }

  // segunda opção: é bom, mas pode melhorar
  constructor (args = {}) {
    this.loadUserByEmailRepository = args.loadUserByEmailRepository
    this.encrypter = args.encrypter
    this.tokenGenerator = args.tokenGenerator
  }

  // ✅ terceira opção: nossa solução definitiva
  constructor ({ loadUserByEmailRepository, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }
}
```