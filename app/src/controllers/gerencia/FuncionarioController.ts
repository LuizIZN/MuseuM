import { type Request, type Response } from "express";
import { type Pool } from "pg";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import Funcionario from "../../entities/gerencia/Funcionario";
import Gerente from "../../entities/gerencia/Gerente";
import Diretor from "../../entities/gerencia/Diretor";
import Atendente from "../../entities/gerencia/Atendente";

class FuncionarioController {
  private conexao: Pool | undefined;
  private funcionario: Funcionario;
  private segredo: string | undefined;
  private usuario: Gerente | Diretor | Atendente | undefined;

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
    const { nome, email, senha, cargo } = req.body;

    try {
      const gerente_id = req.cookies.usuario.gerente_id;

      const funcionarioExistente = await this.conexao?.query(
        "SELECT * FROM museum.funcionario WHERE email = $1",
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

      const verificarGerente = await this.conexao?.query(
        "SELECT * FROM museum.gerente WHERE id = $1",
        [gerente_id]
      );

      if (verificarGerente?.rows.length === 0) {
        res.status(401).json({ erros: ["Gerente não encontrado!"] });
        return;
      }

      const resultado = await this.conexao?.query(
        "INSERT INTO museum.funcionario (nome, email, senha, gerente_id) VALUES ($1, $2, $3, $4) RETURNING id, nome, email",
        [
          this.funcionario.getNome(),
          this.funcionario.getEmail(),
          this.funcionario.getSenha(),
          gerente_id,
        ]
      );

      const resultadoCargo = await this.conexao?.query(
        `INSERT INTO museum.${cargo} (funcionario_id) VALUES ($1)`,
        [resultado?.rows[0].id]
      );

      res.status(201).json({
        mensagem: "Funcionário criado com sucesso!",
        funcionario: resultado?.rows[0],
        cargo: cargo,
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
      const query = `
        SELECT 
          f.id AS funcionario_id, 
          g.id AS gerente_id, 
          d.id AS diretor_id, 
          a.id AS atendente_id,
          f.gerente_id AS gerente_id_cadastro, 
          f.nome, f.email FROM museum.funcionario f
          LEFT JOIN museum.gerente g ON (g.funcionario_id = f.id)
          LEFT JOIN museum.diretor d ON (d.funcionario_id = f.id)
          LEFT JOIN museum.atendente a ON (a.funcionario_id = f.id)
      `;

      const resultado = await this.conexao?.query(query);

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Nenhum funcionário encontrado!"] });
        return;
      }

      resultado?.rows.forEach((funcionario) => {
        if (funcionario.gerente_id) {
          funcionario.cargo = "gerente";
        } else if (funcionario.diretor_id) {
          funcionario.cargo = "diretor";
        } else if (funcionario.atendente_id) {
          funcionario.cargo = "atendente";
        }
      });

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
        "SELECT id, nome, email FROM museum.funcionario WHERE id = $1",
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
        "UPDATE museum.funcionario SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email",
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
        "DELETE FROM museum.funcionario WHERE id = $1 RETURNING id, nome, email",
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
      const query: string = `
        SELECT 
          f.id AS funcionario_id, 
          g.id AS gerente_id, 
          d.id AS diretor_id, 
          a.id AS atendente_id, 
          f.nome, f.email, f.senha FROM museum.funcionario f
          LEFT JOIN museum.gerente g ON (g.funcionario_id = f.id)
          LEFT JOIN museum.diretor d ON (d.funcionario_id = f.id)
          LEFT JOIN museum.atendente a ON (a.funcionario_id = f.id)
          WHERE f.email = $1;
      `;

      const resultado = await this.conexao?.query(query, [email]);

      if (resultado?.rows.length === 0) {
        res.status(404).json({ erros: ["Usuário não encontrado!"] });
        return;
      }

      if (!(await bcrypt.compare(senha, resultado?.rows[0].senha))) {
        res.status(422).json({ erros: ["Senha inválida!"] });
        return;
      }

      if (resultado?.rows[0].gerente_id) {
        this.usuario = new Gerente();
      } else if (resultado?.rows[0].diretor_id) {
        this.usuario = new Diretor();
      } else if (resultado?.rows[0].atendente_id) {
        this.usuario = new Atendente();
      }

      let { senha: _, ...usuario } = resultado?.rows[0];
      this.usuario?.setUsuario(usuario);

      const token = (await this.gerarToken(usuario.id)).valueOf();

      res.cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });

      res.cookie("usuario", this.usuario?.getUsuario(), {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });

      res.status(201).json({
        usuario: this.usuario?.getUsuario(),
        mensagem: "Usuário logado com sucesso!",
      });
    } catch (erro: any) {
      console.error(erro);
      res.status(500).json({ erros: ["Não foi possível realizar login!"] });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", { path: "/", sameSite: "none", secure: true });
    res.clearCookie("usuario", { path: "/", sameSite: "none", secure: true });

    res.status(200).json({ mensagem: "Usuário deslogado com sucesso!" });
  };
}

export default FuncionarioController;
