import { type Router } from "express";
import FuncionarioController from "../controllers/gerencia/FuncionarioController";
import express from "express";
import { type Pool } from "pg";

import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

export default class GerenciaRoutes {
  private funcionarioController: FuncionarioController;
  private roteador: Router;
  private autenticacao: Autenticacao;
  private validacao: Validacao;
  private funcionarioValidation: FuncionarioValidation;

  constructor(conexao: Pool | undefined) {
    this.funcionarioController = new FuncionarioController(conexao);
    this.roteador = express.Router();
    this.autenticacao = new Autenticacao(conexao);
    this.validacao = new Validacao();
    this.funcionarioValidation = new FuncionarioValidation();
  }

  private verificarPermissoes(permissoes: string[]): boolean {
    return permissoes.includes("Gerenciar funcionarios");
  }

  public funcionarioRoutes(): Router {
    this.roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.validacao.validar,
      this.funcionarioController.buscarFuncionarioPorId
    );

    this.roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.validacao.validar,
      this.funcionarioController.listarFuncionarios
    );

    this.roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.funcionarioValidation.criarFuncionarioValidacao(),
      this.validacao.validar,
      this.funcionarioController.criarFuncionario
    );

    this.roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.funcionarioValidation.editarFuncionarioValidacao(),
      this.validacao.validar,
      this.funcionarioController.editarFuncionario
    );

    this.roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.funcionarioController.excluirFuncionario
    );

    this.roteador.post(
      "/login",
      this.funcionarioValidation.logarValidacao(),
      this.validacao.validar,
      this.funcionarioController.logar
    );

    this.roteador.post(
      "/logout",
      this.autenticacao.autenticacao,
      this.funcionarioController.logout
    );

    return this.roteador;
  }
}
