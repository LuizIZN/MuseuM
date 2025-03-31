import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Item from "../../entities/gerencia/Item";

class ItemController {
  private conexao: Pool | undefined;
  private item: Item;

  constructor(conexao: Pool | undefined) {
    this.conexao = conexao;
    this.item = new Item();
  }

  public criarItem = async (req: Request, res: Response): Promise<void> => {
    const { nome, codigo, classificacao, estado_conservacao } = req.body;
  
    try {
      const itemExistente = await this.conexao?.query(
        "SELECT * FROM museum.item WHERE cod_item = $1",
        [codigo]
      );

      if (itemExistente && itemExistente?.rows.length > 0) {
        res.status(422).json({ erros: ["Item já cadastrado!"] });
        return;
      }

      const gerente_id = req.cookies.usuario.gerente_id;

      this.item.setNome(nome);
      this.item.setClassificacao(classificacao);
      this.item.setEstadoConservacao(estado_conservacao);

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.item (nome, cod_item, classificacao, estadoconservacao, gerente_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nome, codigo, classificacao, estado_conservacao, gerente_id]
      );

      res.status(201).json({
        mensagem: "Item criado com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível criar item!"] });
    }
  };

  public listarItens = async (req: Request, res: Response): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        `SELECT i.*, f.nome as gerente_nome FROM museum.item i 
          JOIN museum.gerente g ON i.gerente_id = g.id 
          JOIN museum.funcionario f ON g.funcionario_id = f.id;`
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Nenhum item encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível listar itens!"] });
    }
  };

  public buscarItemPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT i.*, f.nome as gerente_nome FROM museum.item i JOIN museum.gerente g ON i.gerente_id = g.id JOIN museum.funcionario f ON g.funcionario_id = f.id WHERE i.id = $1;",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Item não encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar item!"] });
    }
  };

  public editarItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nome, codigo, classificacao, estado_conservacao } = req.body;

    try {
      const resultado = await this.conexao?.query(
        "UPDATE museum.item SET nome = $1, cod_item = $2, classificacao = $3, estadoconservacao = $4 WHERE id = $5 RETURNING *",
        [nome, codigo, classificacao, estado_conservacao, id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Item não encontrado!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Item atualizado com sucesso!",
        item: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar item!"] });
    }
  };

  public excluirItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.item WHERE id = $1",
        [id]
      );

      if (resultado?.rowCount === 0) {
        res.status(404).json({ erros: ["Item não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Item excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir item!"] });
    }
  };
}

export default ItemController;
