# Boas-vindas ao repositório do projeto _Store Manager_

## Entregáveis
  
<details>
<summary>O que foi desenvolvido</summary>

- Uma API RESTful utilizando a arquitetura em camadas;

- A API é um sistema de gerenciamento de vendas em que será possível criar, visualizar, deletar e atualizar produtos e vendas;

- API desenvolvida utilizando o banco de dados MySQL para a gestão de dados;

- Testes unitários para garantir as funcionalidade das implementações.

</details>
  
<details>
  <summary>Habilidades desenvolvidas</summary>

- Interação com um banco de dados relacional (_MySQL_);
- Implementação uma API utilizando arquitetura em camadas (_MSC_);
- Criação de validações para os dados recebidos pela API;
- Desenvolvimento de testes para APIs, garantindo o funcionamento correto da implementação dos endpoints.

</details>

## Orientações

<details>
<summary>Iniciando a aplicação</summary>

```bash
# Instale as dependências
npm install

# Inicie os containers do compose `backend` e `db`
# A aplicação estará disponível em `http://localhost:3001` em modo de desenvolvimento
docker-compose up -d

# É possível ver os logs da aplicação com `docker logs -n 10 -f <nome-do-container>`
docker logs -n 10 -f store_manager
```

</details>

<details>
<summary>Como executar os testes</summary>

Resumo dos comandos relacionados aos testes:

```bash
npm run test:mocha     # roda os testes do mocha
npm run test:coverage  # roda os testes e mostra a cobertura geral
npm run test:mutation  # roda os testes e mostra a cobertura de mutações
```

</details>

## Requisitos do projeto

### 01 - Endpoints para listagem de produtos

- O endpoint para listar todos os produtos é acessível através do caminho `GET /products` e `GET /products/:id`;
- Através de `GET /products`, todos os produtos são retornados;
- Através de `GET /products/:id`, apenas o produto com o `id` presente na URL é retornado;
- Foram criados testes que garantem as funcionalidades implementadas.

<details>
<summary>O que foi desenvolvido:</summary>

- **Listagem de todos os produtos**

  Ao fazer uma requisição para `GET /products`, é retornado o status http `200` com o seguinte:

  ```json
  [
    {
      "id": 1,
      "name": "Martelo de Thor"
    },
    {
      "id": 2,
      "name": "Traje de encolhimento"
    }
    /* ... */
  ]
  ```

- **Não é possível listar um produto que não existe**

  Ao fazer uma requisição para `GET /products/:id` com o id de um produto, o resultado retornado é um status http `404` com o seguinte corpo:

  ```json
  { "message": "Product not found" }
  ```

- **Listagem de um produto específico**

  Ao fazer uma requisição para `GET /products/:id`, caso exista um produto com o `id`, retorna um status http `200` e o seguinte corpo:

  ```json
  {
    "id": 1,
    "name": "Martelo de Thor"
  }
  ```

</details>

### 02 - Endpoint para listagem de vendas

- O endpoint para listar vendas é acessível através do caminho `GET /sales` e `GET /sales/:id`;
- Através do `GET /sales` retorna todas as vendas;
- Através do `GET /sales/:id`, retorna a venda com o `id` presente na URL;

<details>
<summary>O que foi desenvolvido:</summary>

- **Listagem de todas as vendas**

  Ao fazer uma requisição para `GET /sales`, retorna o status http `200` com o seguinte corpo:

  ```json
  [
    {
      "saleId": 1,
      "date": "2021-09-09T04:54:29.000Z",
      "productId": 1,
      "quantity": 2
    },
    {
      "saleId": 1,
      "date": "2021-09-09T04:54:54.000Z",
      "productId": 2,
      "quantity": 2
    }

    /* ... */
  ]
  ```

- **Não é possível listar uma venda que não existe**

  Ao fazer uma requisição para `GET /sales/:id` com um id inexistente, retorna o status http `404` com o seguinte corpo:

  ```json
  { "message": "Sale not found" }
  ```

- **Listagem de uma venda específica**

  Ao fazer uma requisição para `GET /sales/:id` com um id existente, retorna o status http `200` com o seguinte corpo:

  ```json
  [
    {
      "date": "2021-09-09T04:54:29.000Z",
      "productId": 1,
      "quantity": 2
    },
    {
      "date": "2021-09-09T04:54:54.000Z",
      "productId": 2,
      "quantity": 2
    }

    /* ... */
  ]
  ```

</details>

### 03 - Endpoint para cadastro de produtos

- O endpoint é acessível através do caminho `POST /products`;
- Os produtos enviados são salvos na tabela `products` do banco de dados;
- O corpo da requisição segue o formato abaixo:

```json
{
  "name": "ProdutoX"
}
```

<details>
<summary>O que foi desenvolvido:</summary>

- **É possível cadastrar um produto**

  Ao fazer uma requisição para `POST /products`, o resultado é um status http `201`:

  ```json
  {
    "id": 4,
    "name": "ProdutoX"
  }
  ```

</details>

### 04 - Validações para o cadastro de produtos

- O endpoint de cadastro de produtos retorna mensagens de erro para requisições com dados inválidos;

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível cadastrar um produto sem o campo `name`**

  Se a requisição para `POST /products` não tiver o campo `name`, o resultado retornado é um status http `400` :

  ```json
  { "message": "\"name\" is required" }
  ```

- **Não é possível cadastrar um produto com o campo `name` menor que 5 caracteres**

  Se a requisição para `POST /products` não tiver `name` com pelo menos 5 caracteres, o resultado retornado é um status http `422` com a seguinte mensagem:

  ```json
  { "message": "\"name\" length must be at least 5 characters long" }
  ```

</details>

### 05 - Endpoint para cadastro de vendas

- O endpoint de vendas é acessível através do caminho `POST /sales`;
- As vendas enviadas são salvas nas tabelas `sales` e `sales_products` do banco de dados;
- É possível cadastrar a venda de vários produtos através da uma mesma requisição;
- O corpo da requisição segue o seguinte formato:

```json
[
  {
    "productId": 1,
    "quantity": 1
  },
  {
    "productId": 2,
    "quantity": 5
  }
]
```

<details>
<summary>O que foi desenvolvido:</summary>

- **É possível cadastrar uma venda**

  Ao fazer uma requisição válida para `POST /sales`, o resultado é um status http `201` com o seguinte corpo:

  ```json
  {
    "id": 3,
    "itemsSold": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 5
      }
    ]
  }
  ```

</details>

### 06 - Validações para o cadastro de vendas

- O endpoint de cadastro de vendas retorna mensagens de erro para requisições com dados inválidos;

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível cadastrar uma venda sem o campo `productId`**

  Se algum dos itens da requisição para `POST /sales` não tiver o campo `productId`, o resultado retornado é um status http `400` com a seguinte mensagem:

  ```json
  { "message": "\"productId\" is required" }
  ```

- **Não é possível cadastrar uma venda sem o campo `quantity`**

  Se algum dos itens da requisição para `POST /sales` não tiver o campo `quantity`, o resultado retornado é um status http `400` com a seguinte mensagem:

  ```json
  { "message": "\"quantity\" is required" }
  ```

- **Não é possível cadastrar uma venda com o campo `quantity` menor ou igual a zero**

  Se a requisição para `POST /sales` tiver algum item em que o campo `quantity` seja menor ou igual a zero, o resultado retornado é um status http `422` com a seguinte mensagem:

  ```json
  { "message": "\"quantity\" must be greater than or equal to 1" }
  ```

- **Não é possível cadastrar uma venda com o campo `productId` inexistente, em uma requisição com um único item**

  Se o campo `productId` do item da requisição para `POST /sales` não existir no banco de dados, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
  { "message": "Product not found" }
  ```

- **Não é possível cadastrar uma venda com o campo `productId` inexistente, em uma requisição com vários items**

  Se a requisição para `POST /sales` tiver algum item cujo campo `productId` não existe no banco de dados, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
  { "message": "Product not found" }
  ```

</details>

### 07 - Endpoint para atualização de um produto

- O endpoint é acessível através do caminho `PUT /products/:id`;
- Apenas o produto com o `id` presente na URL é atualizado;
- O corpo da requisição é validado igual ao cadastro;
- O corpo da requisição segue o seguinte formato:

```json
{
  "name": "Martelo do Batman"
}
```

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível alterar um produto sem o campo `name`**

  Se a requisição para `PUT /products/:id` não tiver o campo `name`, o resultado retornado é um status http `400` com a seguinte mensagem:

  ```json
  { "message": "\"name\" is required" }
  ```

- **Não é possível alterar um produto com o campo `name` menor que 5 caracteres**

  Se a requisição para `PUT /products/:id` não tiver `name` com pelo menos 5 caracteres, o resultado retornado é um status http `422` com a seguinte mensagem:

  ```json
  { "message": "\"name\" length must be at least 5 characters long" }
  ```

- **Não é possível alterar um produto que não existe**
  
  Se a requisição para `PUT /products/:id` informar o `id` de um produto inexistente, o resultado retornado é um status http `404` com a seguint mensagem:

    ```json
      { "message": "Product not found" }
    ```

- **É possível alterar um produto**

  Ao fazer uma requisição válida para `PUT /products/:id`, o resultado retornado é um status http`200` com o seguinte corpo:

  ```json
  {
    "id": 1,
    "name": "Martelo do Batman"
  }
  ```

</details>

### 08 - Endpoint para deletar um produto

- O endpoint é acessível através do caminho `DELETE /products/:id`;
- Apenas o produto com o `id` presente na URL é deletado;

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível deletar um produto que não existe**

  Se a requisição para `DELETE /products/:id` informar o `id` de um produto inexistente, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
    { "message": "Product not found" }
  ```

- **É possível deletar um produto com sucesso**

  Ao fazer uma requisição válida para `DELETE /products/:id`, não é retornada nenhuma resposta, apenas um status http `204`;

</details>

### 09 - Endpoint para deletar uma venda

- O endpoint é acessível através do caminho `DELETE /sales/:id`;
- Apenas a venda com o `id` presente na URL é deletada;

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível deletar uma venda que não existe**
  
  Se a requisição para `DELETE /sales/:id` informar o `id` de uma venda inexistente, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
    { "message": "Sale not found" }
  ```

- **É possível deletar uma venda com sucesso**

  Ao fazer uma requisição válida para `DELETE /sales/:id`, não é retornada nenhuma resposta, apenas um status http `204`;

</details>

### 10 - Endpoint para atualizar a quantidade de um produto em uma venda

- O endpoint é acessível através do caminho `/sales/:saleId/products/:productId/quantity`;
- Apenas a quantidade do produto vendido com o `productId` na URL é atualizada;

```json
{
  "quantity": 20
}
```

<details>
<summary>O que foi desenvolvido:</summary>

- **Não é possível realizar alterações em uma venda sem o campo `quantity`**

  Se a requisição para `PUT /sales/:saleId/products/:productId/quantity` não tiver o campo `quantity`, o resultado retornado é um status http `400` com a seguinte mensagem:

  ```json
  { "message": "\"quantity\" is required" }
  ```

- **Não é possível realizar alterações em uma venda com o campo `quantity` menor ou igual a zero**

  Se a requisição para `PUT /sales/:saleId/products/:productId/quantity` tiver o campo `quantity` menor que zero, o resultado retornado é um status http `422` com a seguinte mensagem:

  ```json
  { "message": "\"quantity\" must be greater than or equal to 1" }
  ```

- **Não é possível realizar alterações em uma venda com `productId` inexistente**

  Se a requisição para `PUT /sales/:saleId/products/:productId/quantity` tiver o campo `productId` com um valor não existente no banco, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
  { "message": "Product not found in sale" }
  ```

- **Não é possível alterar uma venda que não existe**

  Se a requisição para `PUT /sales/:saleId/products/:productId/quantity` informar o `saleId` de uma venda inexistente, o resultado retornado é um status http `404` com a seguinte mensagem:

  ```json
    { "message": "Sale not found" }
  ```

- **É possível alterar a quantidade de um produto de uma venda**

  Ao fazer uma requisição válida para `PUT /sales/:saleId/products/:productId/quantity`, a requisição retorna um status http `200` com o seguinte corpo:

  ```json
  {
    "date": "2023-05-06T03:14:28.000Z",
    "productId": 2,
    "quantity": 20,
    "saleId": 1
  }
  ```

</details>

### 11 - Endpoint para pesquisar produtos

- O endpoint é acessível através do URL `GET /products/search`;
- O endpoint é capaz de trazer todos os produtos no banco de dados contendo o valor da query `q` em `name`, se existirem;
- Retorna um array de produtos que contenham em seu nome o termo passado na URL;
- Retorna todos os produtos caso a _query_ `q` esteja vazia;
- Retorna um array vazio caso nenhum nome satisfaça a busca;
- A _query_ da requisição segue o seguinte formato:

```text
  http://localhost:PORT/products/search?q=Martelo
```

<details>
<summary>O que foi desenvolvido:</summary>

- **É possível buscar um produto pelo `name`**

  Se a requisição para `GET /products/search` for feita com uma _query_ `q` cujo valor exista no atributo `name` de algum produto, o resultado retornado é um status http `200` com o seguinte corpo:

  ```json
  // GET /products/search?q=Martelo

  [
    {
      "id": 1,
      "name": "Martelo de Thor"
    }
  ]
  ```

- **É possível buscar todos os produtos quando passa a busca vazia**

  Se a requisição para `GET /products/search` foi feita com uma _query_ `q` vazia, retorna um status http `200` e o seguinte corpo:

  ```json
  // GET /products/search?q=

  [
    {
      "id": 1,
      "name": "Martelo de Thor",
    },
    {
      "id": 2,
      "name": "Traje de encolhimento",
    }
    /* ... */
  ]
  ```

- **A busca retorna um array vazio quando não há produtos correspondentes**

  Se a requisição para `GET /products/search` for feita com uma _query_ `q` cujo valor não exista no atributo `name` de nenhum produto, retorna um array vazio, com um status http `200`:

  ```json
  // GET /products/search?q=ProdutoInexistente

  []
  ```

</details>
