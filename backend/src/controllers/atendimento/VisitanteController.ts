import { type Request, type Response } from "express";
import { type Pool } from "pg";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import Visitante from "../../entities/atendimento/Visitante";
import Pessoafisica from "../../entities/atendimento/Pessoafisica";
import Pessoajuridica from "../../entities/atendimento/Pessoajuridica";

class VisitanteController {
  private conexao: Pool | undefined;
  private visitante: Visitante;
  private segredo: string | undefined;

  constructor(conexao: Pool | undefined) {
    this.segredo = process.env.JWT_SECRET;
    this.conexao = conexao;
    this.visitante = new Visitante();
  }

  private gerarToken = (id: number): string => {
    if (!this.segredo) {
      throw new Error("Segredo JWT não está definido!");
    }
    return jwt.sign({ id }, this.segredo, {
      expiresIn: "7d",
    });
  };

  public criarVisitante = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { telefone, email, endereco, tipodepessoa } = req.body;

    try {
      const atendente_id = req.cookies?.usuario?.atendente_id;
      const verificarAtendente = await this.conexao?.query(
        "SELECT * FROM museum.atendente WHERE id = $1",
        [atendente_id]
      );

      if (verificarAtendente?.rows.length === 0) {
        res.status(401).json({ erros: ["Atendente não encontrado!"] });
        return;
      }
      const visitanteExistente = await this.conexao?.query(
        "SELECT * FROM museum.visitante WHERE email = $1",
        [email]
      );

      if (visitanteExistente && visitanteExistente?.rows.length > 0) {
        res.status(422).json({ erros: ["E-mail já cadastrado!"] });
        return;
      }
      
      this.visitante.setTelefone(telefone);
      this.visitante.setEmail(email);
      this.visitante.setEndereco(endereco);


      const resultado = await this.conexao?.query(
        "INSERT INTO museum.visitante (telefone, email, endereco, atendente_id) VALUES ($1, $2, $3, $4) RETURNING id, telefone, email",
        [
          this.visitante.getTelefone(),
          this.visitante.getEmail(),
          this.visitante.getEndereco(),
          atendente_id,
        ]
      );
      let cpf, nome, cnpj, razao_social;
      let pessoa;
      if (tipodepessoa === "pessoafisica") {
        ({ cpf, nome } = req.body);
        const pessoaFisica = new Pessoafisica();
        pessoa=pessoaFisica;
        pessoaFisica.setVisitanteId(resultado?.rows[0].id);
        pessoaFisica.setCpf(cpf);
        pessoaFisica.setNome(nome);
      
        await this.conexao?.query(
          "INSERT INTO museum.pessoafisica (visitante_id, cpf, nome) VALUES ($1, $2, $3)",
          [pessoaFisica.getVisitanteId(), pessoaFisica.getCpf(), pessoaFisica.getNome()]
        );
      }
      
      if (tipodepessoa === "pessoajuridica") {
        ({ cnpj, razao_social} = req.body);
        const pessoaJuridica = new Pessoajuridica();
        pessoa=pessoaJuridica;
        pessoaJuridica.setVisitanteId(resultado?.rows[0].id);
        pessoaJuridica.setCnpj(cnpj);
        pessoaJuridica.setRazao_social(razao_social);
      
        await this.conexao?.query(
          "INSERT INTO museum.pessoajuridica (visitante_id, cnpj, razao_social) VALUES ($1, $2, $3)",
          [pessoaJuridica.getVisitanteId(), pessoaJuridica.getCnpj(), pessoaJuridica.getRazao_social()]
        );
      }

      res.status(201).json({
        mensagem: "Visitante criado com sucesso!",
        visitante: resultado?.rows[0],
        tipodepessoa: tipodepessoa,
        pessoa,
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível criar visitante!"] });
    }
  };

  public listarVisitantes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const query = `
        SELECT 
          v.* AS visitante_id, 
          f.nome AS funcionario_nome
          FROM museum.visitante v
          LEFT JOIN museum.atendentes a ON (a.id = v.atendente_id)
          LEFT JOIN museum.funcionario f ON (f.id = a.funcionario_id)
      `;

      const resultado = await this.conexao?.query(query);

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Nenhum visitante encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res
        .status(500)
        .json({ erros: ["Não foi possível listar visitantes!"] });
    }
  };

  public buscarVisitantePorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT v.* AS visitante_id, f.nome AS funcionario_nome FROM museum.visitante v LEFT JOIN museum.atendentes a ON (a.id = v.atendente_id) LEFT JOIN museum.funcionario f ON (f.id = a.funcionario_id) WHERE v.id = $1",
        [id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Visitante não encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar funcionário"] });
    }
  };

  public editarVisitante = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { telefone, email, endereco}:{ telefone: string; email: string; endereco: string}= req.body;

    if (telefone) this.visitante.setTelefone(telefone);
    if (email) this.visitante.setEmail(email);
    if (endereco) this.visitante.setEndereco(endereco);

    try {
      const resultado = await this.conexao?.query(
        "UPDATE museum.visitante SET telefone = $1, email = $2, endereco=$3 WHERE id = $4 RETURNING id, telefone, email, endereco",
        [this.visitante.getTelefone(), this.visitante.getEmail(), this.visitante.getEndereco(), id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Não foi encontrado visitante!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Visitante atualizado com sucesso!",
        visitante: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar funcionário!"] });
    }
  };

  public excluirVisitante = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM museum.visitante WHERE id = $1 RETURNING id, telefone, email, endereco",
        [id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Visitante não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Visitante excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir visitante"] });
    }
  };
}

export default VisitanteController;
