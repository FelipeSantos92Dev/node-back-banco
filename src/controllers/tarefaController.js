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
    // const descricao = req.body.descricao;
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
    const { concluida, descricao } = req.body;

    try {
      const tarefaAtualizada = await tarefaModel.update(
        Number(id),
        concluida,
        descricao
      );

      if (!tarefaAtualizada) {
        return res.status(404).json({ erro: "Tarefa não encontrada!" });
      }

      res.json(tarefaAtualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar tarefa!" });
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;

    try {
      const sucesso = await tarefaModel.delete(Number(id));

      if (!sucesso) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.status(200).send({ message: "Tarefa deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir tarefa!" });
    }
  };
}
export default new TarefaController();
