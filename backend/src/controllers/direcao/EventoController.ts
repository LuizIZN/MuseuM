import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Evento from "../../entities/direcao/Evento";

class EventoController {
  private conexao: Pool | undefined;
  private evento: Evento;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.evento = new Evento();
  }

  public criarEvento = async (req: Request, res: Response): Promise<void> => {
    const { titulo, tipo, descricao, duracao, horario, coordenador } = req.body;

    try {
      const diretorId = req.cookies.usuario.diretor_id;

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.evento (titulo, descricao, duracao, horario, tipo, coordenador, diretor_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          titulo,
          descricao,
          duracao,
          horario,
          tipo || null,
          coordenador || null,
          diretorId,
        ]
      );

      res.status(201).json({
        mensagem: "Evento criado com sucesso!",
        evento: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar evento!"] });
    }
  };

  public listarEventos = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventos = await this.conexao?.query(
        "SELECT evento.*, funcionario.nome AS diretor_nome FROM museum.evento JOIN museum.diretor ON evento.diretor_id = diretor.id JOIN museum.funcionario ON diretor.funcionario_id = funcionario.id"
      );

      if (eventos?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum evento encontrado!"] });
        return;
      }

      res.status(200).json({ eventos: eventos?.rows });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível listar eventos!"] });
    }
  };

  public buscarEventoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const evento = await this.conexao?.query(
        "SELECT evento.*, funcionario.nome AS diretor_nome FROM museum.evento JOIN museum.diretor ON evento.diretor_id = diretor.id JOIN museum.funcionario ON diretor.funcionario_id = funcionario.id  WHERE evento.id = $1",
        [id]
      );

      if (evento?.rowCount === 0) {
        res.status(404).json({ erros: ["Evento não encontrado!"] });
        return;
      }

      res.status(200).json(evento?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar evento!"] });
    }
  };

  public editarEvento = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { titulo, tipo, descricao, duracao, horario, coordenador } = req.body;

    try {
      const eventoExistente = await this.conexao?.query(
        "SELECT * FROM museum.evento WHERE id = $1",
        [id]
      );

      if (eventoExistente?.rowCount === 0) {
        res.status(404).json({ erros: ["Evento não encontrado!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        "UPDATE museum.evento SET titulo = $1, descricao = $2, duracao = $3, horario = $4, tipo = $5, coordenador = $6 WHERE id = $7 RETURNING *",
        [titulo, descricao, duracao, horario, tipo || null, coordenador || null, id]
      );

      res.status(200).json({
        mensagem: "Evento editado com sucesso!",
        evento: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar evento!"] });
    }
  };

  public excluirEvento = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.evento WHERE id = $1 RETURNING *",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Evento não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Evento excluído com sucesso!",
        evento: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir evento!"] });
    }
  };
}

export default EventoController;
