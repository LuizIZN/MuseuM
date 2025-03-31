import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Horario_atendimento from "../../entities/direcao/HorarioFuncionamento";
class HorarioFuncionamentoController {
  private conexao: Pool | undefined;
  private HorarioFuncionamento: Horario_atendimento;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.HorarioFuncionamento = new Horario_atendimento();
  }

  public criarHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { horaInicio, horaFim, diasComerciais } = req.body;
    try {
      const gerente_id = req.cookies.usuario.gerente_id; // Necessário para identificar o gerente

      // Certifique-se de que diasComerciais é um array de strings no formato de data
      if (
        !Array.isArray(diasComerciais) ||
        !diasComerciais.every((dia: string) => /^\d{4}-\d{2}-\d{2}$/.test(dia))
      ) {
        res.status(400).json({
          erros: [
            "diasComerciais deve ser um array de datas no formato YYYY-MM-DD!",
          ],
        });
        return;
      }

      // Converta os valores para o tipo Date
      const diasComerciaisConvertidos = diasComerciais.map(
        (dia: string) => new Date(dia)
      );

      this.HorarioFuncionamento.sethoraInicio(horaInicio);
      this.HorarioFuncionamento.sethoraFim(horaFim);
      this.HorarioFuncionamento.setdiasComerciais(diasComerciaisConvertidos);

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.horarioFuncionamento (horaInicio, horaFim, diasComerciais, gerente_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [horaInicio, horaFim, diasComerciaisConvertidos, gerente_id]
      );

      res.status(201).json({
        mensagem: "Horario inserido com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível inserir horario!"] });
    }
  };

  public listarHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        `SELECT i.*, f.nome as gerente_nome FROM museum.horarioFuncionamento i 
                JOIN museum.gerente g ON i.gerente_id = g.id 
                JOIN museum.funcionario f ON g.funcionario_id = f.id;`
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum Horario encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível listar Horario!"] });
    }
  };

  public editarHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { horaInicio, horaFim, diasComerciais } = req.body;

    try {
      // Certifique-se de que diasComerciais é um array de strings no formato de data
      if (
        !Array.isArray(diasComerciais) ||
        !diasComerciais.every((dia: string) => /^\d{4}-\d{2}-\d{2}$/.test(dia))
      ) {
        res.status(400).json({
          erros: [
            "diasComerciais deve ser um array de datas no formato YYYY-MM-DD!",
          ],
        });
        return;
      }

      // Converta os valores para o tipo Date
      const diasComerciaisConvertidos = diasComerciais.map(
        (dia: string) => new Date(dia)
      );

      const resultado = await this.conexao?.query(
        "UPDATE museum.horarioFuncionamento SET horaInicio = $1, horaFim = $2, diasComerciais = $3 WHERE id = $4 RETURNING *",
        [horaInicio, horaFim, diasComerciaisConvertidos, id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Horario não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Horario atualizado com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar horario!"] });
    }
  };

  public excluirHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.horarioFuncionamento WHERE id = $1",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Horario não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Horario excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir horario!"] });
    }
  };
}

export default HorarioFuncionamentoController;
