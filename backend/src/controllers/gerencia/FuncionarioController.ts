import { Request, Response } from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
import Funcionario from "../../entities/gerencia/Funcionario";

class FuncionarioController {
  private pool: Pool | undefined;
  private funcionario: Funcionario;
  private secret: string | undefined;

  constructor(pool: Pool | undefined) {
    this.secret = process.env.JWT_SECRET;
    this.pool = pool;
    this.funcionario = new Funcionario();
  }

  private criptografarSenha = async (senha: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    return senhaCriptografada;
  };

  private gerarToken = (id: number): Promise<string> => {
    return jwt.sign({ id }, this.secret, {
      expiresIn: "7d",
    });
  };

  public criarFuncionario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { nome, email, senha } = req.body;

    const funcionarioExistente = await this.pool?.query(
      "SELECT * FROM mydb.funcionario WHERE email = $1",
      [email]
    );

    if (funcionarioExistente && funcionarioExistente?.rows.length > 0) {
      res.status(422).json({ error: "E-mail já cadastrado!" });
      return;
    }

    const senhaCriptografada: string = await this.criptografarSenha(senha);

    this.funcionario.setNome(nome);
    this.funcionario.setEmail(email);
    this.funcionario.setSenha(senhaCriptografada);

    try {
      const result = await this.pool?.query(
        "INSERT INTO mydb.funcionario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
        [
          this.funcionario.getNome(),
          this.funcionario.getEmail(),
          this.funcionario.getSenha(),
        ]
      );
      res.status(201).json({
        message: "Funcionário criado com sucesso!",
        funcionario: result?.rows[0],
      });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ errors: ["Erro ao criar funcionário!"] });
    }
  };

  public listarFuncionarios = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await this.pool?.query(
        "SELECT id, nome, email FROM mydb.funcionario"
      );

      if (result?.rows.length === 0) {
        res.status(404).json({ errors: ["Nenhum funcionário encontrado!"] });
        return;
      }

      res.status(200).json(result?.rows);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ errors: ["Erro ao listar funcionários!"] });
    }
  };

  public buscarFuncionarioPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const result = await this.pool?.query(
        "SELECT id, nome, email FROM mydb.funcionario WHERE id = $1",
        [id]
      );

      if (result?.rows.length === 0) {
        res.status(404).json({ errors: ["Funcionário não encontrado!"] });
        return;
      }

      res.status(200).json(result?.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ errors: ["Erro ao buscar funcionário!"] });
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
      const result = await this.pool?.query(
        "UPDATE mydb.funcionario SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email",
        [this.funcionario.getNome(), this.funcionario.getEmail(), id]
      );

      if (result?.rows.length === 0) {
        res.status(404).json({ errors: ["Não foi encontrado funcionário!"] });
        return;
      }

      res.status(200).json({
        message: "Funcionário atualizado com sucesso!",
        funcionario: result?.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: ["Erro ao atualizar funcionário!"] });
    }
  };

  public excluirFuncionario = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const result = await this.pool?.query(
        "DELETE FROM mydb.funcionario WHERE id = $1 RETURNING id, nome, email",
        [id]
      );

      if (result?.rows.length === 0) {
        res.status(404).json({ errors: ["Funcionario não encontrado!"] });
        return;
      }

      res.status(200).json({
        excluido: result?.rows[0],
        message: "Funcionário excluído com sucesso!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errors: ["Não foi possível excluir funcionário"] });
    }
  };

  public logar = async (req: Request, res: Response): Promise<void> => {
    const { email, senha }: { email: string; senha: string } = req.body;

    try {
      const result = await this.pool?.query(
        "SELECT id, nome, email, senha FROM mydb.funcionario WHERE email = $1",
        [email]
      );

      if (result?.rows.length === 0) {
        res.status(404).json({ errors: ["Usuário não encontrado!"] });
        return;
      }

      if (!(await bcrypt.compare(senha, result?.rows[0].senha))) {
        res.status(422).json({ errors: ["Senha inválida!"] });
        return;
      }

      let { senha: _, ...usuario } = result?.rows[0];
      usuario = {
        ...usuario,
        token: (await this.gerarToken(usuario.id)).valueOf(),
      };
      this.funcionario.setUsuario(usuario);

      res.status(201).json({
        usuario: this.funcionario.getUsuario(),
        message: "Usuário logado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: ["Não foi possível realizar login!"] });
    }
  };
}

export default FuncionarioController;
