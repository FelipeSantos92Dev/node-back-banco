# Aula: Configuração de Projeto Backend com Prisma

## Cabeçalho de Aula

**Habilidades Trabalhadas:**

- Desenvolvimento de APIs RESTful com Node.js
- Integração de ORM (Prisma) com projetos backend
- Modelagem de dados e persistência
- Tratamento de erros em aplicações assíncronas
- Refatoração de código para padrões modernos

## Introdução

Nesta aula, vamos transformar um projeto backend que utiliza armazenamento em memória para um que utiliza banco de dados persistente através do Prisma ORM. Esta refatoração é um passo importante para criar aplicações escaláveis e robustas.

## Passo a Passo da Configuração

### 1. Instalando o Prisma

Primeiro, instale os pacotes necessários e inicialize o Prisma:

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Configurando o arquivo .env

Crie ou modifique o arquivo `.env` na raiz do projeto:

```
DATABASE_URL="file:./dev.db"
```

Este é o caminho para o banco SQLite que será usado no desenvolvimento.

### 3. Criando o arquivo schema.prisma

O Prisma já criou o arquivo `prisma/schema.prisma`. Modifique-o conforme o modelo final:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Task {
  id        Int     @id @default(autoincrement())
  descricao String
  concluida Boolean @default(false)
  criadaEm  DateTime @default(now())

  @@map("tasks")
}
```

### 4. Criando o cliente Prisma

Crie o arquivo `prisma/client.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### 5. Executando a migração inicial

Execute o comando para criar a migração e aplicá-la ao banco de dados:

```bash
npx prisma migrate dev --name init
```

### 6. Refatorando o modelo (tarefaModel.js)

Modifique o arquivo `src/models/tarefaModel.js` para usar o Prisma:

```javascript
import prisma from "../../prisma/client.js";

class TarefaModel {
  getAll = async () => {
    return await prisma.task.findMany();
  };

  create = async (descricao) => {
    return await prisma.task.create({
      data: {
        descricao,
      },
    });
  };

  update = async (id, concluida) => {
    try {
      return await prisma.task.update({
        where: { id },
        data: {
          concluida: concluida !== undefined ? concluida : true,
        },
      });
    } catch (error) {
      // Se a tarefa não for encontrada, o Prisma lançará uma exceção
      if (error.code === "P2025") {
        return null;
      }
      throw error;
    }
  };

  delete = async (id) => {
    try {
      await prisma.task.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Se a tarefa não for encontrada, o Prisma lançará uma exceção
      if (error.code === "P2025") {
        return false;
      }
      throw error;
    }
  };

  getById = async (id) => {
    return await prisma.task.findUnique({
      where: { id },
    });
  };
}

export default new TarefaModel();
```

### 7. Refatorando o controlador (tarefaController.js)

Modifique o arquivo `src/controllers/tarefaController.js` para trabalhar com operações assíncronas:

```javascript
import tarefaModel from "../models/tarefaModel.js";

class TarefaController {
  getAll = async (req, res) => {
    try {
      const tarefas = await tarefaModel.getAll();
      res.json(tarefas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
  };

  create = async (req, res) => {
    const { descricao } = req.body;
    try {
      if (!descricao) {
        return res.status(400).json({ erro: "Descrição é obrigatória" });
      }
      const novaTarefa = await tarefaModel.create(descricao);
      res.status(201).json(novaTarefa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    const { concluida } = req.body;

    try {
      const tarefaAtualizada = await tarefaModel.update(
        parseInt(id),
        concluida
      );

      if (!tarefaAtualizada) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json(tarefaAtualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;

    try {
      const sucesso = await tarefaModel.delete(parseInt(id));

      if (!sucesso) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao excluir tarefa" });
    }
  };

  getById = async (req, res) => {
    const { id } = req.params;

    try {
      const tarefa = await tarefaModel.getById(parseInt(id));

      if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json(tarefa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar tarefa" });
    }
  };
}

export default new TarefaController();
```

### 8. Atualizando as rotas

Se quiser implementar a nova rota `getById` no arquivo de rotas:

```javascript
import express from "express";
import tarefaController from "../controllers/tarefaController.js";
const router = express.Router();

router.get("/", tarefaController.getAll);
router.get("/:id", tarefaController.getById); // Nova rota
router.post("/", tarefaController.create);
router.put("/:id", tarefaController.update);
router.delete("/:id", tarefaController.delete);

export default router;
```

## Principais Mudanças na Refatoração

1. **Operações Assíncronas**: Todas as operações de banco de dados são assíncronas, utilizando `async/await`
2. **Tratamento de Erros**: Implementação de blocos try/catch para lidar com exceções do Prisma
3. **Persistência de Dados**: Os dados agora são armazenados em um banco SQLite em vez de memória
4. **Tipagem Automática**: O Prisma gera tipos TypeScript automaticamente para os modelos

## Passos Após Git Clone

1. Instale as dependências do projeto:

```bash
npm install
```

2. Crie o arquivo `.env` com a variável `DATABASE_URL` apontando para o banco de dados desejado.

```
DATABASE_URL="file:./dev.db"
```

3. Execute as migrações:

```bash
npx prisma migrate dev
```
