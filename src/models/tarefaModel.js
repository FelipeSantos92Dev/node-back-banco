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

  delete = async (id) => {
    try {
      const tarefaDeletada = await prisma.task.delete({
        where: { id },
      });

      return tarefaDeletada;
    } catch (error) {
      console.log("Erro ao deletar a tarefa!", error);
      throw error;
    }
  };
}
export default new TarefaModel();
