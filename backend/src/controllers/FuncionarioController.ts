import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import Funcionario from '../entities/Funcionario';

class FuncionarioController {
  private pool: Pool | undefined;
  private funcionario: Funcionario;

  constructor(pool: Pool | undefined) {
    this.pool = pool;
    this.funcionario = new Funcionario();
  }

  public criptografarSenha = async (senha: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    return senhaCriptografada;
  }

  public criarFuncionario = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, senha } = req.body;

    const funcionarioExistente = await this.pool?.query("SELECT * FROM mydb.funcionario WHERE email = $1", [email]);

    if (funcionarioExistente && funcionarioExistente?.rows.length > 0) {
      res.status(422).json({ error: 'E-mail já cadastrado!' });
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
      res.status(201).json({ message: 'Funcionário criado com sucesso!', funcionario: result?.rows[0] });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Erro ao criar funcionário!' });
    }
  }

  public listarFuncionarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.pool?.query("SELECT id, nome, email FROM mydb.funcionario");

      if (result?.rows.length === 0) {
        res.status(404).json({ error: 'Nenhum funcionário encontrado!' });
        return;
      }

      res.status(200).json(result?.rows);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Erro ao listar funcionários!' });
    }
  };

  public buscarFuncionarioPorId = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const result = await this.pool?.query("SELECT * FROM mydb.funcionario WHERE id = $1", [id]);

      if (result?.rows.length === 0) {
        res.status(404).json({ error: 'Funcionário não encontrado!' });
        return;
      }

      res.status(200).json(result?.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Erro ao buscar funcionário!' });
    }
  }

  public editarFuncionario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nome, email }: { nome: string, email: string } = req.body;

    if (nome) this.funcionario.setNome(nome);
    if (email) this.funcionario.setEmail(email);

    try {
      const result = await this.pool?.query("UPDATE mydb.funcionario SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email", [this.funcionario.getNome(), this.funcionario.getEmail(), id]);

      if (result?.rows.length === 0) {
        res.status(404).json({ error: "Não foi encontrado funcionário!" });
        return;
      }

      res.status(200).json({ message: "Funcionário atualizado com sucesso!", funcionario: result?.rows[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao atualizar funcionário!" })
    }
  }

  public excluirFuncionario = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await this.pool?.query("DELETE FROM mydb.funcionario WHERE id = $1 RETURNING id, nome, email", [id]);

      if (result?.rows.length === 0) {
        res.status(404).json({ error: "Funcionario não encontrado!" });
        return;
      }

      res.status(200).json({ excluido: result?.rows[0], message: "Funcionário excluído com sucesso!"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Não foi possível excluir funcionário" })
    }
  }

}

export default FuncionarioController;