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
      const exposicaoExistente = await this.conexao?.query(
        "SELECT * FROM museum.exposicao WHERE titulo = $1",
        [titulo]
      );

      if (exposicaoExistente && exposicaoExistente?.rows.length > 0) {
        res.status(422).json({ erros: ["Exposição já cadastrada!"] });
        return;
      }

      const gerente_id = req.cookies.usuario.gerente_id;

      this.exposicao.setTitulo(titulo);
      this.exposicao.setDescricao(descricao);
      this.exposicao.setDias(dias);

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.exposicao (titulo, dias, descricao VALUES ($1, $2, $3) RETURNING *",
        [titulo, dias, descricao]
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
        `SELECT i.*, d.nome as diretor_exposicao
         FROM museum.exposicao i 
          JOIN museum.diretor d ON i.diretor_id = d.id 
          GROUP BY museum.exposicao.dias;`
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum Exposicao encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível listar Exposicao!"] });
    }
  };

  public buscarExposicaoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT i.*, f.nome as funcionario_exposicao FROM museum.exposicao i JOIN museum.diretor g ON i.diretor_id = g.id JOIN museum.funcionario f ON g.funcionario_id = f.id WHERE i.id = $1;",
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
        "UPDATE museum.exposicao SET titulo = $1, cod_Exposicao = $2, descricao = $3 WHERE id = $4 RETURNING *",
        [titulo, dias, descricao, , id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Exposiçâo não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Exposiçâo atualizado com sucesso!",
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
        res.status(404).json({ erros: ["Exposição não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Exposição excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir exposição!"] });
    }
  };
}

export default ExposicaoController;
