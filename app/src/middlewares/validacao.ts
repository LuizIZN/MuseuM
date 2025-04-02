const { validationResult } = require("express-validator");
import { type Request, type Response, type NextFunction } from "express";
import path from "path";

class Validacao {
  private erros: any;
  private errosExtraidos: string[];

  constructor() {
    this.erros = undefined;
    this.errosExtraidos = [];
  }

  public validar = (req: Request, res: Response, next: NextFunction) => {
    this.erros = validationResult(req);

    if (this.erros.isEmpty()) {
      return next();
    }

    this.erros.array().map((erro: { msg: string }) => this.errosExtraidos.push(erro.msg));

    if (this.errosExtraidos.includes("Usuário não possui permissão!")) {
      return res.status(403).sendFile(path.join(__dirname, "../views/telas/restrito.html"));
    }

    res.status(422).json({
      erros: this.errosExtraidos
    });

    this.errosExtraidos = [];
  };
}

export default Validacao;
