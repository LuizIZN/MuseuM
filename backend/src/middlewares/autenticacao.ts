import { type Request, type Response, type NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

import jwt from "jsonwebtoken";
import { type Pool } from "pg";

class Autenticacao {
  private token: string | undefined;
  private conexao: Pool | undefined;

  constructor(conexao: Pool | undefined) {
    this.token = undefined;
    this.conexao = conexao;
  }

  public setToken(req: Request): void {
    this.token = req.cookies.token;
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public autenticacao = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.setToken(req);
    if (!this.getToken()) {
      res.status(401).json({ erros: ["Acesso negado!"] });
      return;
    }

    try {
      const verificado = jwt.verify(
        this.getToken() as string,
        process.env.JWT_SECRET || "museumsecret"
      );

      req.usuario = await this.conexao
        ?.query(
          "SELECT id, nome, email FROM museum.funcionario WHERE id = $1",
          [(verificado as jwt.JwtPayload).id]
        )
        .then((resultado) => resultado?.rows[0]);

      next();
    } catch (erro: any) {
      res.status(401).json({ erros: ["Token inválido!"] });
    }
  };
}

export default Autenticacao;
