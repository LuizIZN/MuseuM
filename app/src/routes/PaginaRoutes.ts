import express from "express";
import { type Request, type Response } from "express";
const path = require("path");
import Autenticacao from "../middlewares/autenticacao";
import { type Pool } from "pg";

import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import ManutencaoValidation from "../middlewares/gerencia/ManutencaoValidation";

export default function paginaRoutes(
  conexao: Pool | undefined
): express.Router {
  const roteador = express.Router();
  const autenticacao = new Autenticacao(conexao);

  const funcionarioValidation = new FuncionarioValidation();
  const manutencaoValidation = new ManutencaoValidation();

  roteador.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../views/telas/login.html"));
  });

  roteador.get(
    "/dashboard",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/dashboard.html")
      );
    }
  );

  roteador.get(
    "/funcionarios",
    funcionarioValidation.verificarPermissoes(),
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/funcionarios.html")
      );
    }
  );

  roteador.get(
    "/manutencoes",
    manutencaoValidation.verificarPermissoes(),
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/manutencoes.html")
      );
    }
  );

  return roteador;
}
