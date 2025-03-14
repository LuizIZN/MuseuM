import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

// Controllers
import FuncionarioController from "../controllers/gerencia/FuncionarioController";
import ItemController from "../controllers/gerencia/ItemController";

// Middlewares
import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import ItemValidation from "../middlewares/gerencia/ItemValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

export default class GerenciaRoutes {
  //Controllers
  private funcionarioController: FuncionarioController;
  private itemController: ItemController;

  // Middlewares
  private autenticacao: Autenticacao;
  private validacao: Validacao;
  private funcionarioValidation: FuncionarioValidation;
  private itemValidation: ItemValidation;

  constructor(conexao: Pool | undefined) {
    this.funcionarioController = new FuncionarioController(conexao);
    this.itemController = new ItemController(conexao);
    this.autenticacao = new Autenticacao(conexao);
    this.validacao = new Validacao();
    this.funcionarioValidation = new FuncionarioValidation();
    this.itemValidation = new ItemValidation();
  }

  private verificarPermissoes(permissoes: string[]): boolean {
    return permissoes.includes("Gerenciar funcionarios");
  }

  public funcionarioRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.validacao.validar,
      this.funcionarioController.buscarFuncionarioPorId
    );

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.validacao.validar,
      this.funcionarioController.listarFuncionarios
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.funcionarioValidation.criarFuncionarioValidacao(),
      this.validacao.validar,
      this.funcionarioController.criarFuncionario
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.funcionarioValidation.editarFuncionarioValidacao(),
      this.validacao.validar,
      this.funcionarioController.editarFuncionario
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.funcionarioValidation.verificarPermissoes(),
      this.validacao.validar,
      this.funcionarioController.excluirFuncionario
    );

    roteador.post(
      "/login",
      this.funcionarioValidation.logarValidacao(),
      this.validacao.validar,
      this.funcionarioController.logar
    );

    roteador.post(
      "/logout",
      this.autenticacao.autenticacao,
      this.funcionarioController.logout
    );

    return roteador;
  }

  public itemRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.itemValidation.verificarPermissoesConsulta(),
      this.validacao.validar,
      this.itemController.listarItens
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.itemValidation.criarItemValidacao(),
      this.validacao.validar,
      this.itemController.criarItem
    );

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.itemValidation.verificarPermissoesConsulta(),
      this.validacao.validar,
      this.itemController.buscarItemPorId
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.itemValidation.editarItemValidacao(),
      this.validacao.validar,
      this.itemController.editarItem
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.itemValidation.excluirItemValidacao(),
      this.validacao.validar,
      this.itemController.excluirItem
    );

    return roteador;
  }
}
