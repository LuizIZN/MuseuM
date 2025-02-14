import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import Funcionario from '../entities/Funcionario'; // Certifique-se de que o caminho está correto

class FuncionarioController {
  private pool: Pool | undefined;
  private funcionario: Funcionario;

  constructor(pool: Pool | undefined) {
    this.pool = pool;
    this.funcionario = new Funcionario(); // Inicialize a propriedade funcionario
  }

  public criptografarSenha = async (senha: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    return senhaCriptografada;
  }

  public criarFuncionario = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, senha } = req.body;

    const senhaCriptografada: string = await this.criptografarSenha(senha);

    this.funcionario.setNome(nome);
    this.funcionario.setEmail(email);
    this.funcionario.setSenha(senhaCriptografada);

    try {
      const result = await this.pool?.query(
        "INSERT INTO mydb.funcionario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
        [
          this.funcionario.getNome(),
          this.funcionario.getEmail(),
          this.funcionario.getSenha(),
        ]
      );
      res.status(201).json(result?.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
  }
}

export default FuncionarioController;