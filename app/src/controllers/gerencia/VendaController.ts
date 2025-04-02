import { type Request, type Response } from "express";
import { type Pool } from "pg";

export default class VendaController {
  private conexao: Pool | undefined;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
  }

  public criarVenda = async (req: Request, res: Response): Promise<void> => {
    const { data, valor, itens, visitante_id } = req.body;

    try {
      const gerente_id = req.cookies.usuario.gerente_id;

      const resultado = await this.conexao?.query(
        `INSERT INTO museum.venda (data, valor, visitante_id, gerente_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [data, valor, visitante_id, gerente_id]
      );

      itens.forEach(async (item: any) => {
        const itensResultado = await this.conexao?.query(
          `SELECT * FROM museum.item WHERE id = $1`,
          [item]
        );

        if (itensResultado?.rowCount === 0) {
          res.status(404).json({
            erros: ["Item não encontrado!"],
          });
          return;
        }

        await this.conexao?.query(
          `INSERT INTO museum.vendaitem (venda_id, item_id) VALUES ($1, $2)`,
          [resultado?.rows[0].id, item]
        );
      });

      res.status(201).json({
        mensagem: "Venda criada com sucesso!",
        venda: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.log(erro);
      res.status(500).json({ erros: ["Não foi possível criar venda!"] });
    }
  };

  public listarVendas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        "SELECT v.*, vi.telefone, vi.email, COALESCE(pf.nome, pj.razao_social) AS nome_comprador, COALESCE(pf.cpf, pj.cnpj) AS identificacao_comprador, json_agg(json_build_object('id', i.id, 'nome', i.nome)) as itens FROM museum.venda v INNER JOIN museum.visitante vi ON v.visitante_id = vi.id LEFT JOIN museum.pessoajuridica pj ON vi.id = pj.visitante_id INNER JOIN museum.gerente g ON v.gerente_id = g.id LEFT JOIN museum.pessoafisica pf ON vi.id = pf.visitante_id JOIN museum.vendaitem vei ON v.id = vei.venda_id JOIN museum.item i ON vei.item_id = i.id GROUP BY v.id, vi.telefone, vi.email, pf.nome, pj.razao_social, pf.cpf, pj.cnpj"
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

  public buscarVendaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = req.params.id;

    try {
      const resultado = await this.conexao?.query(
        "SELECT v.*, vi.telefone, vi.email, COALESCE(pf.nome, pj.razao_social) AS nome_comprador, COALESCE(pf.cpf, pj.cnpj) AS identificacao_comprador, json_agg(json_build_object('id', i.id, 'nome', i.nome)) as itens FROM museum.venda v INNER JOIN museum.visitante vi ON v.visitante_id = vi.id LEFT JOIN museum.pessoajuridica pj ON vi.id = pj.visitante_id INNER JOIN museum.gerente g ON v.gerente_id = g.id LEFT JOIN museum.pessoafisica pf ON vi.id = pf.visitante_id JOIN museum.vendaitem vei ON v.id = vei.venda_id JOIN museum.item i ON vei.item_id = i.id WHERE v.id = $1 GROUP BY v.id, vi.telefone, vi.email, pf.nome, pj.razao_social, pf.cpf, pj.cnpj",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Venda não encontrada!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar venda!"] });
    }
  };

  public editarVenda = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { data, valor, visitante_id, itens } = req.body;

    try {
      const resultado = await this.conexao?.query(
        "UPDATE museum.venda SET data = $1, valor = $2, visitante_id = $3 WHERE id = $4 RETURNING *",
        [data, valor, visitante_id, id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Venda não encontrada!"] });
        return;
      }

      await this.conexao?.query(
        "DELETE FROM museum.vendaitem WHERE venda_id = $1",
        [id]
      );

      itens.forEach(async (item: any) => {
        const itensResultado = await this.conexao?.query(
          "SELECT * FROM museum.item WHERE id = $1",
          [item]
        );

        if (itensResultado?.rowCount === 0) {
          res.status(404).json({ erros: ["Item não encontrado!"] });
          return;
        }

        await this.conexao?.query(
          "INSERT INTO museum.vendaitem (venda_id, item_id) VALUES ($1, $2)",
          [id, item]
        );
      });

      res.status(200).json({
        mensagem: "Venda editada com sucesso!",
        venda: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar venda!"] });
    }
  };

  public excluirVenda = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.venda WHERE id = $1 RETURNING *",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Venda não encontrada!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Venda excluída com sucesso!",
        venda: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir venda!"] });
    }
  };
}