import {type Request, type Response} from "express";
import {type Pool} from "pg";

import Visita from "../../entities/atendimento/Visita";

class VisitaController {
  private conexao: Pool | undefined;
  private visita: Visita;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.visita = new Visita();
  }

  public criarVisita = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { data, horario, visitanteId } = req.body;

    try {
      const atendente_id = req.cookies.usuario.atendente_id;

      const verificarAtendente = await this.conexao?.query(
        "SELECT * FROM museum.atendente WHERE id = $1",
        [atendente_id]
      );

      const visitanteExistente = await this.conexao?.query(
        "SELECT * FROM museum.visitante v LEFT JOIN museum.pessoafisica pf ON v.id = pf.visitante_id LEFT JOIN museum.pessoajuridica pj ON v.id = pj.visitante_id  WHERE v.id = $1",
        [visitanteId]
      );

      if (visitanteExistente?.rows.length === 0) {
        res.status(404).json({ erros: ["Visitante não encontrado!"] });
        return;
      }

      this.visita.setData(data);
      this.visita.setHorario(horario);
      this.visita.setVisitanteId(visitanteId);

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.visita (data, hora, visitante_id, atendente_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [data, horario, visitanteId, atendente_id]
      );

      res.status(201).json({
        mensagem: "Visita criada com sucesso!",
        visita: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar visita!"] });
    }
  }

  public listarVisitas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const visitas = await this.conexao?.query(
        "SELECT visita.*, visitante.email, visitante.telefone, COALESCE(pessoafisica.nome, pessoajuridica.razao_social) AS nome, COALESCE(pessoafisica.cpf, pessoajuridica.cnpj) AS identificacao FROM museum.visita LEFT JOIN museum.visitante ON visitante_id = visitante.id LEFT JOIN museum.pessoafisica ON visitante.id = pessoafisica.visitante_id LEFT JOIN museum.pessoajuridica ON visitante.id = pessoajuridica.visitante_id"
      );

      if (visitas?.rows.length === 0) {
        res.status(404).json({ erros: ["Nenhuma visita encontrada!"] });
        return;
      }

      res.status(200).json(visitas?.rows);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível listar visitas!"] });
    }
  }

  public buscarVisitaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const visita = await this.conexao?.query(
        "SELECT visita.*, visitante.email, visitante.telefone, COALESCE(pessoafisica.nome, pessoajuridica.razao_social) AS nome, COALESCE(pessoafisica.cpf, pessoajuridica.cnpj) AS identificacao FROM museum.visita LEFT JOIN museum.visitante ON visitante_id = visitante.id LEFT JOIN museum.pessoafisica ON visitante.id = pessoafisica.visitante_id LEFT JOIN museum.pessoajuridica ON visitante.id = pessoajuridica.visitante_id WHERE visita.id = $1",
        [id]
      );

      if (visita?.rows.length === 0) {
        res.status(404).json({ erros: ["Visita não encontrada!"] });
        return;
      }

      res.status(200).json(visita?.rows[0]);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível buscar visita!"] });
    }
  }

  public editarVisita = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { data, horario } = req.body;

    try {
      const visitaExistente = await this.conexao?.query(
        "SELECT * FROM museum.visita WHERE id = $1",
        [id]
      );

      if (visitaExistente?.rows.length === 0) {
        res.status(404).json({ erros: ["Visita não encontrada!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        "UPDATE museum.visita SET data = $1, hora = $2 WHERE id = $3 RETURNING *",
        [data, horario, id]
      );

      res.status(200).json({
        mensagem: "Visita editada com sucesso!",
        visita: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível editar visita!"] });
    }
  }

  public excluirVisita = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const visitaExistente = await this.conexao?.query(
        "SELECT * FROM museum.visita WHERE id = $1",
        [id]
      );

      if (visitaExistente?.rows.length === 0) {
        res.status(404).json({ erros: ["Visita não encontrada!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        "DELETE FROM museum.visita WHERE id = $1 RETURNING *",
        [id]
      );

      res.status(200).json({
        mensagem: "Visita excluída com sucesso!",
        visita: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível excluir visita!"] });
    }
  }
}

export default VisitaController;