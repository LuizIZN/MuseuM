import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Exposicao from "../../entities/direcao/Exposicao";

class ExposicaoController {
  private conexao: Pool | undefined;
  private exposicao: Exposicao;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.exposicao = new Exposicao();
  }

  public criarExposicao = async (req: Request, res: Response): Promise<void> => {
    const { titulo, dias, descricao} = req.body;

    try {
      const diretor_id = req.cookies.usuario.diretor_id;

      this.exposicao.setTitulo(titulo);
      this.exposicao.setDescricao(descricao);
      this.exposicao.setDias(dias);

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.exposicao (titulo, dias, descricao, diretor_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [titulo, dias, descricao, diretor_id]
      );

      res.status(201).json({
        mensagem: "Exposição criado com sucesso!",
        Exposicao: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível criar exposição!"] });
    }
  };

  public listarExposicao = async (req: Request, res: Response): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        `SELECT e.*, f.nome as diretor_exposicao
         FROM museum.exposicao e 
          JOIN museum.diretor d ON e.diretor_id = d.id JOIN museum.funcionario f ON d.funcionario_id = f.id;`
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum exposição encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível listar exposição!"] });
    }
  };

  public buscarExposicaoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT e.*, f.nome as funcionario_exposicao FROM museum.exposicao e JOIN museum.diretor d ON e.diretor_id = d.id JOIN museum.funcionario f ON d.funcionario_id = f.id WHERE e.id = $1;",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Exposicao não encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar exposição!"] });
    }
  };

  public editarExposicao = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { titulo, dias, descricao} = req.body;

    try {
      const resultado = await this.conexao?.query(
        "UPDATE museum.exposicao SET titulo = $1, dias = $2, descricao = $3 WHERE id = $4 RETURNING *",
        [titulo, dias, descricao, id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Exposição não encontrada!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Exposiçâo atualizada com sucesso!",
        exposicao: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar exposiçâo!"] });
    }
  };

  public excluirExposicao = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.exposicao WHERE id = $1",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Exposição não encontrada!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Exposição excluída com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir exposição!"] });
    }
  };
}

export default ExposicaoController;
