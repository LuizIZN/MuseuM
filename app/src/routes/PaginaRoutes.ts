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

  roteador.get(
    "/noticias",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/noticias.html")
      );
    }
  );

  roteador.get(
    "/exposicoes",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/exposicoes.html")
      );
    }
  );

  roteador.get(
    "/itens",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/itens.html")
      );
    }
  );

  roteador.get(
    "/doacoes",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/doacoes.html")
      );
    }
  );

  roteador.get(
    "/contratos",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/contratos.html")
      );
    }
  );

  roteador.get(
    "/horarios",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/horario.html")
      );
    }
  );

  roteador.get(
    "/emprestimos",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/emprestimos.html")
      );
    }
  );

  roteador.get(
    "/vendas",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/vendas.html")
      );
    }
  );

  roteador.get(
    "/eventos",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, "../views/telas/eventos.html")
      );
    }
  );

  return roteador;
}
