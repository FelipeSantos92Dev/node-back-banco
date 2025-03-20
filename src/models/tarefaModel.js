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

  update = async (id, concluida, descricao) => {
    try {
      const tarefa = await prisma.task.update({
        where: { id },
        data: {
          concluida: concluida !== undefined ? concluida : true,
          descricao,
        },
      });

      return tarefa;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
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
