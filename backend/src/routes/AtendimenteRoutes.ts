import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

//Controllers
import VisitanteController from "../controllers/atendimento/VisitanteController";
import VisitaController from "../controllers/atendimento/VisitaController";

//Middlewares
import VisitanteValidation from "../middlewares/atendimento/VisitanteValidation";
import VisitaValidation from "../middlewares/atendimento/VisitaValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

export default class AtendenteRoutes {
  //Controllers
  private visitanteController: VisitanteController;
  private visitaController: VisitaController;

  //Middlewares
  private visitanteValidation: VisitanteValidation;
  private visitaValidation: VisitaValidation;
  private autenticacao: Autenticacao;
  private validacao: Validacao;

  constructor(conexao: Pool | undefined) {
    this.visitanteController = new VisitanteController(conexao);
    this.visitaController = new VisitaController(conexao);
    this.visitanteValidation = new VisitanteValidation();
    this.visitaValidation = new VisitaValidation();
    this.autenticacao = new Autenticacao(conexao);
    this.validacao = new Validacao();
  }

  public visitanteRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.visitanteValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitanteController.listarVisitantes
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.visitanteValidation.criarVisitanteValidacao(),
      this.validacao.validar,
      this.visitanteController.criarVisitante
    );

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitanteValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitanteController.buscarVisitantePorId
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitanteValidation.editarVisitanteValidacao(),
      this.validacao.validar,
      this.visitanteController.editarVisitante
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitanteValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitanteController.excluirVisitante
    );

    return roteador;
  }

  public visitaRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.visitaValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitaController.listarVisitas
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.visitaValidation.criarEditarVisitaValidacao(),
      this.validacao.validar,
      this.visitaController.criarVisita
    );

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitaValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitaController.buscarVisitaPorId
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitaValidation.criarEditarVisitaValidacao(),
      this.validacao.validar,
      this.visitaController.editarVisita
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.visitaValidation.verificarPermissoes(),
      this.validacao.validar,
      this.visitaController.excluirVisita
    );

    return roteador;
  }
}
