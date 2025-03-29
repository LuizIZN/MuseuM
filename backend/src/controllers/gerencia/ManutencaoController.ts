import { type Request, type Response } from "express";
import { type Pool } from "pg";

class ManutencaoController {
  private conexao: Pool | undefined;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
  }

  public criarManutencao = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { nomeTecnico, numIdTecnico, data, valor, descricao, itemId } = req.body;

    try {
      const resultadoItem = await this.conexao?.query(
        "SELECT * FROM museum.item WHERE id = $1",
        [itemId]
      );

      if (resultadoItem?.rowCount === 0) {
        res.status(404).json({ erros: ["Item não encontrado!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.manutencao (data, valor, descricao, item_id, nometecnico, numidtecnico) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data, valor, descricao, itemId, nomeTecnico, numIdTecnico]
      );

      res.status(201).json({
        mensagem: "Manutenção criada com sucesso!",
        manutencao: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível criar manutenção!"] });
    }
  }

  public listarManutencoes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        "SELECT m.*, i.nome FROM museum.manutencao m JOIN museum.item i ON m.item_id = i.id"
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Manutenções não encontradas!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível listar manutenções!"] });
    }
  }

  public buscarManutencaoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT m.*, i.nome FROM museum.manutencao m JOIN museum.item i ON m.item_id = i.id WHERE m.id = $1",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Manutenção não encontrada!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar manutenção!"] });
    }
  }

  public editarManutencao = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { nomeTecnico, numIdTecnico, data, valor, descricao } = req.body;

    try {
      const resultadoManutencao = await this.conexao?.query(
        "SELECT * FROM museum.manutencao WHERE id = $1",
        [id]
      );

      if (resultadoManutencao?.rowCount === 0) {
        res.status(404).json({ erros: ["Manutenção não encontrada!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        `UPDATE museum.manutencao SET data = $1, valor = $2, descricao = $3, nometecnico = $4, numidtecnico = $5 WHERE id = $6 RETURNING *`,
        [data, valor, descricao, nomeTecnico, numIdTecnico, id]
      );

      res.status(200).json({
        mensagem: "Manutenção editada com sucesso!",
        manutencao: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar manutenção!"] });
    }
  }

  public excluirManutencao = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultadoManutencao = await this.conexao?.query(
        "SELECT * FROM museum.manutencao WHERE id = $1",
        [id]
      );

      if (resultadoManutencao?.rowCount === 0) {
        res.status(404).json({ erros: ["Manutenção não encontrada!"] });
        return;
      }

      await this.conexao?.query("DELETE FROM museum.manutencao WHERE id = $1", [id]);

      res.status(200).json({ mensagem: "Manutenção excluída com sucesso!" });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir manutenção!"] });
    }
  }
}

export default ManutencaoController;