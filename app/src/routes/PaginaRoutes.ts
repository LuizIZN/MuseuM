import express from "express";
import { type Request, type Response } from "express";
const path = require("path");
import Autenticacao from "../middlewares/autenticacao";
import { type Pool } from "pg";

import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import ManutencaoValidation from "../middlewares/gerencia/ManutencaoValidation";
import ItemValidation from "../middlewares/gerencia/ItemValidation";
import ContratoValidation from "../middlewares/gerencia/ContratoValidation";
import DoacaoValidation from "../middlewares/gerencia/DoacaoValidation";
import EmprestimoValidation from "../middlewares/atendimento/EmprestimoValidation";
import EventoValidation from "../middlewares/direcao/EventoValidation";
import ExposicaoValidation from "../middlewares/direcao/ExposicaoValidation";
import NoticiaValidation from "../middlewares/direcao/NoticiaValidation";
import VendaValidation from "../middlewares/gerencia/VendaValidation";
import HorarioFuncionamentoValidation from "../middlewares/direcao/HorarioFuncionamentoValidation";
import VisitanteValidation from "../middlewares/atendimento/VisitanteValidation";
import Validacao from "../middlewares/validacao";

export default function paginaRoutes(
  conexao: Pool | undefined
): express.Router {
  const roteador = express.Router();
  const autenticacao = new Autenticacao(conexao);
  const validacao = new Validacao();

  const funcionarioValidation = new FuncionarioValidation();
  const manutencaoValidation = new ManutencaoValidation();
  const itemValidation = new ItemValidation();
  const contratoValidation = new ContratoValidation();
  const doacaoValidation = new DoacaoValidation();
  const emprestimoValidation = new EmprestimoValidation();
  const eventoValidation = new EventoValidation();
  const exposicaoValidation = new ExposicaoValidation();
  const noticiaValidation = new NoticiaValidation();
  const vendaValidation = new VendaValidation();
  const horarioValidation = new HorarioFuncionamentoValidation();
  const visitanteValidation = new VisitanteValidation();

  roteador.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../views/telas/login.html"));
  });

  roteador.get(
    "/dashboard",
    autenticacao.autenticacao,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/dashboard.html"));
    }
  );

  roteador.get(
    "/funcionarios",
    autenticacao.autenticacao,
    funcionarioValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/funcionarios.html"));
    }
  );

  roteador.get(
    "/manutencoes",
    autenticacao.autenticacao,
    manutencaoValidation.verificarPermissoes(),
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/manutencoes.html"));
    }
  );

  roteador.get(
    "/noticias",
    autenticacao.autenticacao,
    noticiaValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/noticias.html"));
    }
  );

  roteador.get(
    "/exposicoes",
    autenticacao.autenticacao,
    exposicaoValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/exposicoes.html"));
    }
  );

  roteador.get(
    "/itens",
    autenticacao.autenticacao,
    itemValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/itens.html"));
    }
  );

  roteador.get(
    "/doacoes",
    autenticacao.autenticacao,
    doacaoValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/doacoes.html"));
    }
  );

  roteador.get(
    "/contratos",
    autenticacao.autenticacao,
    contratoValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/contratos.html"));
    }
  );

  roteador.get(
    "/horarios",
    autenticacao.autenticacao,
    horarioValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/horario.html"));
    }
  );

  roteador.get(
    "/emprestimos",
    autenticacao.autenticacao,
    emprestimoValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/emprestimos.html"));
    }
  );

  roteador.get(
    "/vendas",
    autenticacao.autenticacao,
    vendaValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/vendas.html"));
    }
  );

  roteador.get(
    "/eventos",
    autenticacao.autenticacao,
    eventoValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/eventos.html"));
    }
  );

  roteador.get(
    "/visitantes",
    autenticacao.autenticacao,
    visitanteValidation.verificarPermissoes(),
    validacao.validar,
    (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../views/telas/visitantes.html"));
    }
  );

  roteador.use((req: Request, res: Response) => {
    res.status(404).sendFile(path.join(__dirname, "../views/telas/404.html"));
  });

  return roteador;
}
