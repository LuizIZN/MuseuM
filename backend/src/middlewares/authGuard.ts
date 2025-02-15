import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

import jwt from "jsonwebtoken";
import Funcionario from "../entities/gerencia/Funcionario";
import { Pool } from "pg";

class AuthGuard {
  private token: string | undefined;
  private authHeader: string | undefined;
  private pool: Pool | undefined;

  constructor(pool: Pool | undefined) {
    this.token = undefined;
    this.authHeader = undefined;
    this.pool = pool;
  }

  public setAuthHeader(req: Request): void {
    this.authHeader = req.headers.authorization;
  }

  public getAuthHeader(): string | undefined {
    return this.authHeader;
  }

  public setToken(authHeader: string | undefined): void {
    this.token = authHeader?.split(" ")[1];
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public autenticacao = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.setAuthHeader(req);
    this.setToken(this.getAuthHeader());

    if (!this.getToken()) {
      res.status(401).json({ errors: ["Acesso negado!"] });
      return;
    }

    try {
      const decoded = jwt.verify(
        this.getToken() as string,
        process.env.JWT_SECRET || "secret"
      );

      req.usuario = await this.pool?.query(
        "SELECT id, nome, email FROM mydb.funcionario WHERE id = $1",
        [(decoded as jwt.JwtPayload).id]
      );

      next();
    } catch (error) {
      res.status(401).json({ errors: ["Token inválido!"] });
    }
  };
}

export default AuthGuard;
