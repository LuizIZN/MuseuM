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
    console.log("Dados recebidos no corpo da requisição:", req.body);

    try {
      const gerente_id = req.cookies.usuario?.gerente_id; // Necessário para identificar o gerente
      console.log("Gerente ID:", gerente_id);

      // Validação: Certifique-se de que diasComerciais é um array de strings no formato YYYY-MM-DD
      if (
        !Array.isArray(diasComerciais) ||
        !diasComerciais.every((dia: string) => /^\d{4}-\d{2}-\d{2}$/.test(dia))
      ) {
        console.error("Erro de validação: diasComerciais inválido.");
        res.status(400).json({
          erros: [
            "diasComerciais deve ser um array de datas no formato YYYY-MM-DD!",
          ],
        });
        return;
      }

      // Validação: Certifique-se de que horaInicio é menor que horaFim
      if (horaInicio >= horaFim) {
        console.error("Erro de validação: horaInicio deve ser menor que horaFim.");
        res.status(400).json({
          erros: ["horaInicio deve ser menor que horaFim!"],
        });
        return;
      }

      console.log("Inserindo horário no banco de dados...");
      const resultado = await this.conexao?.query(
        "INSERT INTO museum.horarioFuncionamento (horaInicio, horaFim, diasComerciais, gerente_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [horaInicio, horaFim, diasComerciais, gerente_id]
      );

      console.log("Resultado da inserção:", resultado?.rows);

      res.status(201).json({
        mensagem: "Horário inserido com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error("Erro ao inserir horário:", erro);
      res.status(500).json({ erros: ["Não foi possível inserir horário!"] });
    }
  };

  public listarHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log("Recebendo requisição para listar o último horário...");
      const query = `
        SELECT i.id as horario_id, 
               TO_CHAR(i.horaInicio, 'HH24:MI') as "horaInicio", 
               TO_CHAR(i.horaFim, 'HH24:MI') as "horaFim", 
               ARRAY_AGG(d.diaComercial) as "diasComerciais", 
               i.gerente_id, 
               f.nome as gerente_nome 
        FROM museum.horarioFuncionamento i 
        LEFT JOIN LATERAL (
          SELECT TO_CHAR(unnest(i.diasComerciais), 'YYYY-MM-DD') as diaComercial
        ) d ON true
        JOIN museum.gerente g ON i.gerente_id = g.id 
        JOIN museum.funcionario f ON g.funcionario_id = f.id 
        GROUP BY i.id, i.horaInicio, i.horaFim, i.gerente_id, f.nome 
        ORDER BY i.id DESC 
        LIMIT 1;
      `;
      console.log("Executando consulta SQL:", query);

      const resultado = await this.conexao?.query(query);

      console.log("Resultado da consulta (último horário):", resultado?.rows);

      if (!resultado || resultado.rowCount === 0) {
        console.log("Nenhum horário encontrado no banco de dados.");
        res.status(404).json({ erros: ["Nenhum horário encontrado!"] });
        return;
      }

      res.status(200).json(resultado.rows[0]); // Retorna apenas o último registro
    } catch (erro: any) {
      console.error("Erro ao listar horário:", erro); // Log detalhado do erro
      res.status(500).json({ erros: ["Não foi possível listar horário!"] });
    }
  };

  public editarHorarioFuncionamento = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { horaInicio, horaFim, diasComerciais } = req.body;

    try {
      console.log("Recebendo requisição para editar horário...");
      console.log("ID do horário:", id);
      console.log("Dados recebidos:", { horaInicio, horaFim, diasComerciais });

      // Certifique-se de que diasComerciais é um array de strings no formato YYYY-MM-DD
      if (
        !Array.isArray(diasComerciais) ||
        !diasComerciais.every((dia: string) => /^\d{4}-\d{2}-\d{2}$/.test(dia))
      ) {
        console.error("Erro de validação: diasComerciais inválido.");
        res.status(400).json({
          erros: [
            "diasComerciais deve ser um array de datas no formato YYYY-MM-DD!",
          ],
        });
        return;
      }

      console.log("Atualizando horário no banco de dados...");
      const resultado = await this.conexao?.query(
        "UPDATE museum.horarioFuncionamento SET horaInicio = $1, horaFim = $2, diasComerciais = $3 WHERE id = $4 RETURNING *",
        [horaInicio, horaFim, diasComerciais, id]
      );

      console.log("Resultado da atualização:", resultado?.rows);

      if (resultado?.rowCount === 0) {
        console.error("Horário não encontrado para o ID:", id);
        res.status(404).json({ erros: ["Horário não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Horário atualizado com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error("Erro ao editar horário:", erro);
      res.status(500).json({ erros: ["Não foi possível editar horário!"] });
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
        res.status(404).json({ erros: ["Horário não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Horário excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir horário!"] });
    }
  };
}

export default HorarioFuncionamentoController;
