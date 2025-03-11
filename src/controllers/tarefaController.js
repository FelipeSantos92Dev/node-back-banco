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

  create = ({ body: { descricao } }, res) => {
    if (!descricao) {
      return res.status(400).json({ erro: "Descrição é obrigatória" });
    }
    const novaTarefa = tarefaModel.create(descricao);
    res.status(201).json(novaTarefa);
  };
  update = ({ params: { id }, body: { concluida } }, res) => {
    const tarefaAtualizada = tarefaModel.update(id, concluida);
    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json(tarefaAtualizada);
  };
  delete = ({ params: { id } }, res) => {
    const sucesso = tarefaModel.delete(id);
    if (!sucesso) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.status(204).send();
  };
}
export default new TarefaController();
