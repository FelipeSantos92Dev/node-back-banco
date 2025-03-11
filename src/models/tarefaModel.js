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

  update = (id, concluida) => {
    const tarefa = this.tarefas.find((t) => t.id === Number(id));
    if (tarefa) {
      tarefa.concluida = concluida !== undefined ? concluida : tarefa.concluida;
      return tarefa;
    }
    return null;
  };
  delete = (id) => {
    const index = this.tarefas.findIndex((t) => t.id === Number(id));
    if (index !== -1) {
      this.tarefas.splice(index, 1);
      return true;
    }
    return false;
  };
}
export default new TarefaModel();
