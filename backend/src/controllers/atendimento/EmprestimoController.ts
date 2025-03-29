import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Emprestimo from "../../entities/atendimento/Emprestimo";

class EmprestimoController {
  private conexao: Pool | undefined;
  private emprestimo: Emprestimo;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.emprestimo = new Emprestimo();
  }

  public criarEmprestimo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { dataEmprestimo, dataDevolucao, codigo, visitanteId, itemId } =
      req.body;

    try {
      const atendenteId = req.cookies.usuario.atendente_id;

      const resultadoVisitante = await this.conexao?.query(
        "SELECT * FROM museum.visitante WHERE id = $1",
        [visitanteId]
      );

      if (resultadoVisitante?.rowCount === 0) {
        res.status(404).json({ erros: ["Visitante não encontrado!"] });
        return;
      }

      const resultadoItem = await this.conexao?.query(
        "SELECT * FROM museum.item WHERE id = $1",
        [itemId]
      );

      if (resultadoItem?.rowCount === 0) {
        res.status(404).json({ erros: ["Item não encontrado!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.emprestimo (data_emprestimo, data_devolucao, cod_emprestimo, atendente_id, visitante_id, item_id) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          dataEmprestimo,
          dataDevolucao,
          codigo,
          atendenteId,
          visitanteId,
          itemId,
        ]
      );

      res.status(201).json({
        mensagem: "Empréstimo criado com sucesso!",
        emprestimo: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar empréstimo!"] });
    }
  };

  public listarEmprestimos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const emprestimos = await this.conexao?.query(
        "SELECT emp.id, emp.data_emprestimo, emp.data_devolucao, emp.cod_emprestimo, COALESCE(pf.nome, pj.razao_social) AS visitante_nome, COALESCE(pf.cpf, pj.cnpj) AS visitante_identificacao, it.nome AS item FROM museum.emprestimo emp JOIN museum.visitante vis ON emp.visitante_id = vis.id JOIN museum.item it ON emp.item_id = it.id LEFT JOIN museum.pessoafisica pf ON vis.id = pf.visitante_id LEFT JOIN museum.pessoajuridica pj ON vis.id = pj.visitante_id"
      );

      if (emprestimos?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum empréstimo encontrado!"] });
        return;
      }

      res.status(200).json( emprestimos?.rows);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível listar empréstimos!"] });
    }
  };

  public buscarEmprestimoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const emprestimo = await this.conexao?.query(
        "SELECT emp.id, emp.data_emprestimo, emp.data_devolucao, emp.cod_emprestimo, COALESCE(pf.nome, pj.razao_social) AS visitante_nome, COALESCE(pf.cpf, pj.cnpj) AS visitante_identificacao, it.nome AS item FROM museum.emprestimo emp JOIN museum.visitante vis ON emp.visitante_id = vis.id JOIN museum.item it ON emp.item_id = it.id LEFT JOIN museum.pessoafisica pf ON vis.id = pf.visitante_id LEFT JOIN museum.pessoajuridica pj ON vis.id = pj.visitante_id WHERE emp.id = $1",
        [id]
      );

      if (emprestimo?.rowCount === 0) {
        res.status(404).json({ erros: ["Empréstimo não encontrado!"] });
        return;
      }

      res.status(200).json(emprestimo?.rows[0]);
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível buscar empréstimo!"] });
    }
  };

  public editarEmprestimo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { dataEmprestimo, dataDevolucao, codigo } =
      req.body;

    try {
      const resultadoEmprestimo = await this.conexao?.query(
        "SELECT * FROM museum.emprestimo WHERE id = $1",
        [id]
      );

      if (resultadoEmprestimo?.rowCount === 0) {
        res.status(404).json({ erros: ["Empréstimo não encontrado!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        `UPDATE museum.emprestimo SET data_emprestimo = $1, data_devolucao = $2, cod_emprestimo = $3 WHERE id = $4 RETURNING *`,
        [dataEmprestimo, dataDevolucao, codigo, id]
      );

      res.status(200).json({
        mensagem: "Empréstimo editado com sucesso!",
        emprestimo: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível editar empréstimo!"] });
    }
  };

  public excluirEmprestimo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultadoEmprestimo = await this.conexao?.query(
        "SELECT * FROM museum.emprestimo WHERE id = $1",
        [id]
      );

      if (resultadoEmprestimo?.rowCount === 0) {
        res.status(404).json({ erros: ["Empréstimo não encontrado!"] });
        return;
      }

      await this.conexao?.query("DELETE FROM museum.emprestimo WHERE id = $1", [
        id,
      ]);

      res.status(200).json({ mensagem: "Empréstimo excluído com sucesso!" });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível excluir empréstimo!"] });
    }
  };
}

export default EmprestimoController;