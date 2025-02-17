import { type Request, type Response } from "express";
import { type Pool } from "pg";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import Funcionario from "../../entities/gerencia/Funcionario";

class FuncionarioController {
  private conexao: Pool | undefined;
  private funcionario: Funcionario;
  private segredo: string | undefined;

  constructor(conexao: Pool | undefined) {
    this.segredo = process.env.JWT_SECRET;
    this.conexao = conexao;
    this.funcionario = new Funcionario();
  }

  private criptografarSenha = async (senha: string): Promise<string> => {
    const sal = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, sal);
    return senhaCriptografada;
  };

  private gerarToken = (id: number): string => {
    if (!this.segredo) {
      throw new Error("Segredo JWT não está definido!");
    }
    return jwt.sign({ id }, this.segredo, {
      expiresIn: "7d",
    });
  };

  public criarFuncionario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { nome, email, senha } = req.body;

    try {
      const funcionarioExistente = await this.conexao?.query(
        "SELECT * FROM mydb.funcionario WHERE email = $1",
        [email]
      );

      if (funcionarioExistente && funcionarioExistente?.rows.length > 0) {
        res.status(422).json({ erros: ["E-mail já cadastrado!"] });
        return;
      }

      const senhaCriptografada: string = await this.criptografarSenha(senha);

      this.funcionario.setNome(nome);
      this.funcionario.setEmail(email);
      this.funcionario.setSenha(senhaCriptografada);

      const resultado = await this.conexao?.query(
        "INSERT INTO mydb.funcionario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
        [
          this.funcionario.getNome(),
          this.funcionario.getEmail(),
          this.funcionario.getSenha(),
        ]
      );
      res.status(201).json({
        mensagem: "Funcionário criado com sucesso!",
        funcionario: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível criar funcionário!"] });
    }
  };

  public listarFuncionarios = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.conexao?.query(
        "SELECT id, nome, email FROM mydb.funcionario"
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Nenhum funcionário encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows);
    } catch (erro: any) {
      console.error(erro);
      res
        .status(500)
        .json({ erros: ["Não foi possível listar funcionários!"] });
    }
  };

  public buscarFuncionarioPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "SELECT id, nome, email FROM mydb.funcionario WHERE id = $1",
        [id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Funcionário não encontrado!"] });
        return;
      }

      res.status(200).json(resultado?.rows[0]);
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível buscar funcionário"] });
    }
  };

  public editarFuncionario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { nome, email }: { nome: string; email: string } = req.body;

    if (nome) this.funcionario.setNome(nome);
    if (email) this.funcionario.setEmail(email);

    try {
      const resultado = await this.conexao?.query(
        "UPDATE mydb.funcionario SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email",
        [this.funcionario.getNome(), this.funcionario.getEmail(), id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Não foi encontrado funcionário!"] });
        return;
      }

      res.status(200).json({
        mensagem: "Funcionário atualizado com sucesso!",
        funcionario: resultado?.rows[0],
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível editar funcionário!"] });
    }
  };

  public excluirFuncionario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const resultado = await this.conexao?.query(
        "DELETE FROM mydb.funcionario WHERE id = $1 RETURNING id, nome, email",
        [id]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Funcionario não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: resultado?.rows[0],
        mensagem: "Funcionário excluído com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível excluir funcionário"] });
    }
  };

  public logar = async (req: Request, res: Response): Promise<void> => {
    const { email, senha }: { email: string; senha: string } = req.body;

    try {
      const resultado = await this.conexao?.query(
        "SELECT id, nome, email, senha FROM mydb.funcionario WHERE email = $1",
        [email]
      );

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Usuário não encontrado!"] });
        return;
      }

      if (!(await bcrypt.compare(senha, resultado?.rows[0].senha))) {
        res.status(422).json({ erros: ["Senha inválida!"] });
        return;
      }

      let { senha: _, ...usuario } = resultado?.rows[0];
      this.funcionario.setUsuario(usuario);

      const token = (await this.gerarToken(usuario.id)).valueOf();

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(201).json({
        usuario: this.funcionario.getUsuario(),
        mensagem: "Usuário logado com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível realizar login!"] });
    }
  };
}

export default FuncionarioController;
