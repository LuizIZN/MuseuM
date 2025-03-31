import { type Request, type Response } from "express";
import { type Pool } from "pg";

export default class DoacaoController {
  private conexao: Pool | undefined;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
  }

  public criarDoacao = async (req: Request, res: Response): Promise<void> => {
    const { data, valor, visitante_id, cod_item, nome, estadoconservacao, classificacao } = req.body;

    try {
      const gerente_id = req.cookies.usuario.gerente_id;

      const visitante = await this.conexao?.query(
        `SELECT * FROM museum.visitante WHERE id = $1`,
        [visitante_id]
      );

      if (visitante?.rowCount === 0) {
        res.status(404).json({
          erros: ["Visitante não encontrado!"],
        });
        return;
      }

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.doacao (data, valor, visitante_id, gerente_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [data, valor, visitante_id, gerente_id]
      );

      const item = await this.conexao?.query(
        `INSERT INTO museum.item (cod_item, nome, estadoconservacao, classificacao, doacao_id, gerente_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [cod_item, nome, estadoconservacao, classificacao, resultado?.rows[0].id, gerente_id]
      );

      res.status(201).json({
        mensagem: "Doação criada com sucesso!",
        doacao: resultado?.rows[0],
        item: item?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar doação!"] });
    }
  };

  public listarDoacoes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        "SELECT d.id AS doacao_id, d.data, d.valor, vi.telefone, vi.email, COALESCE(pf.nome, pj.razao_social) AS nome_doador, COALESCE(pf.cpf, pj.cnpj) AS identificacao_doador, i.id AS item_id, i.nome AS item_nome, g.id AS gerente_id FROM museum.doacao d INNER JOIN museum.visitante vi ON d.visitante_id = vi.id LEFT JOIN museum.pessoajuridica pj ON vi.id = pj.visitante_id LEFT JOIN museum.pessoafisica pf ON vi.id = pf.visitante_id INNER JOIN museum.gerente g ON d.gerente_id = g.id LEFT JOIN museum.item i ON d.id = i.doacao_id"
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({
          erros: ["Nenhuma doação encontrada!"],
        });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível listar doações!"] });
    }  
  }

  public buscarDoacaoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT d.id AS doacao_id, d.data, d.valor, vi.telefone, vi.email, COALESCE(pf.nome, pj.razao_social) AS nome_doador, COALESCE(pf.cpf, pj.cnpj) AS identificacao_doador, i.id AS item_id, i.nome AS item_nome, g.id AS gerente_id FROM museum.doacao d INNER JOIN museum.visitante vi ON d.visitante_id = vi.id LEFT JOIN museum.pessoajuridica pj ON vi.id = pj.visitante_id LEFT JOIN museum.pessoafisica pf ON vi.id = pf.visitante_id INNER JOIN museum.gerente g ON d.gerente_id = g.id LEFT JOIN museum.item i ON d.id = i.doacao_id WHERE d.id = $1",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({
          erros: ["Doação não encontrada!"],
        });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível listar doação!"] });
    }
  }

  public editarDoacao = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { data, valor } = req.body;

    try {

      const doacao = await this.conexao?.query(
        `SELECT * FROM museum.doacao WHERE id = $1`,
        [id]
      );

      if (doacao?.rowCount === 0) {
        res.status(404).json({
          erros: ["Doação não encontrada!"],
        });
        return;
      }

      const resultado = await this.conexao?.query(
        `UPDATE museum.doacao SET data = $1, valor = $2 WHERE id = $3 RETURNING *`,
        [data, valor, id]
      );

      res.status(200).json({
        mensagem: "Doação editada com sucesso!",
        doacao: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível editar doação!"] });
    }
  }

  public excluirDoacao = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const doacao = await this.conexao?.query(
        `SELECT * FROM museum.doacao WHERE id = $1`,
        [id]
      );

      if (doacao?.rowCount === 0) {
        res.status(404).json({
          erros: ["Doação não encontrada!"],
        });
        return;
      }

      await this.conexao?.query(
        `DELETE FROM museum.doacao WHERE id = $1`,
        [id]
      );

      res.status(200).json({
        mensagem: "Doação deletada com sucesso!",
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível deletar doação!"] });
    }
  }
}