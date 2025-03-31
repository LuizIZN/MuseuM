import { type Request, type Response } from "express";
import { type Pool } from "pg";

export default class ContratoController {
  private conexao: Pool | undefined;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
  }

  public criarContrato = async (req: Request, res: Response): Promise<void> => {
    const { descricao, valor, pjId } = req.body;

    try {
      const gerente_id = req.cookies.usuario.gerente_id;

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.contrato (descricao, valor, pessoa_juridica_id, gerente_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [descricao, valor, pjId, gerente_id]
      );

      res.status(201).json({
        mensagem: "Contrato criado com sucesso!",
        contrato: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar contrato!"] });
    }
  };

  public listarContratos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        "SELECT c.*, pj.razao_social, pj.cnpj, v.email, v.telefone, f.nome AS gerente_nome FROM museum.contrato c JOIN museum.pessoajuridica pj ON c.pessoa_juridica_id = pj.id JOIN museum.funcionario f ON c.gerente_id = f.id JOIN museum.visitante v ON pj.visitante_id = v.id"
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Não existem contratos cadastrados!"]});
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res
        .status(500)
        .json({ erros: ["Não foi possível listar contratos!"] });
    }
  };

  public buscarContratoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = req.params.id;

    try {
      const resultado = await this.conexao?.query(
        `SELECT c.*, pj.razao_social, pj.cnpj, v.email, v.telefone, f.nome AS gerente_nome FROM museum.contrato c JOIN museum.pessoajuridica pj ON c.pessoa_juridica_id = pj.id JOIN museum.funcionario f ON c.gerente_id = f.id JOIN museum.visitante v ON pj.visitante_id = v.id WHERE c.id = $1`,
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Contrato não encontrado!"] });
        return;
      }

      res.json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(400).json({ erros: ["Contrato não encontrado!"] });
    }
  };

  public editarContrato = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { descricao, valor } = req.body;
    const id = req.params.id;

    try {
      const resultado = await this.conexao?.query(
        `UPDATE museum.contrato SET descricao = $1, valor = $2 WHERE id = $3 RETURNING *`,
        [descricao, valor, id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Contrato não encontrado!"] });
        return;
      }

      res.json({
        mensagem: "Contrato atualizado com sucesso!",
        contrato: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível atualizar contrato!"] });
    }
  };

  public excluirContrato = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = req.params.id;

    try {
      const resultado = await this.conexao?.query(
        `DELETE FROM museum.contrato WHERE id = $1`,
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Contrato não encontrado!"] });
        return;
      }

      res.status(200).json({ mensagem: "Contrato deletado com sucesso!" });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível deletar contrato!"] });
    }
  };
}
