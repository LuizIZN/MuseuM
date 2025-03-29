import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

// Controllers
import FuncionarioController from "../controllers/gerencia/FuncionarioController";
import ItemController from "../controllers/gerencia/ItemController";
import ManutencaoController from "../controllers/gerencia/ManutencaoController";
import ContratoController from "../controllers/gerencia/ContratoController";

// Middlewares
import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import ItemValidation from "../middlewares/gerencia/ItemValidation";
import ManutencaoValidation from "../middlewares/gerencia/ManutencaoValidation";
import ContratoValidation from "../middlewares/gerencia/ContratoValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

export default class GerenciaRoutes {
  //Controllers
  private funcionarioController: FuncionarioController;
  private itemController: ItemController;
  private manutencaoController: ManutencaoController;
  private contratoController: ContratoController;

  // Middlewares
  private autenticacao: Autenticacao;
  private validacao: Validacao;
  private funcionarioValidation: FuncionarioValidation;
  private itemValidation: ItemValidation;
  private manutencaoValidation: ManutencaoValidation;
  private contratoValidation: ContratoValidation;

  constructor(conexao: Pool | undefined) {
    this.funcionarioController = new FuncionarioController(conexao);
    this.itemController = new ItemController(conexao);
    this.autenticacao = new Autenticacao(conexao);
    this.validacao = new Validacao();
    this.funcionarioValidation = new FuncionarioValidation();
    this.itemValidation = new ItemValidation();
    this.manutencaoController = new ManutencaoController(conexao);
    this.manutencaoValidation = new ManutencaoValidation();
    this.contratoController = new ContratoController(conexao);
    this.contratoValidation = new ContratoValidation();
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

  public manutencaoRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.manutencaoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.manutencaoController.listarManutencoes
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.manutencaoValidation.criarManutencaoValidacao(),
      this.validacao.validar,
      this.manutencaoController.criarManutencao
    );

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.manutencaoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.manutencaoController.buscarManutencaoPorId
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.manutencaoValidation.editarManutencaoValidacao(),
      this.validacao.validar,
      this.manutencaoController.editarManutencao
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.manutencaoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.manutencaoController.excluirManutencao
    );

    return roteador;
  }

  public contratoRoutes(): Router {
    const roteador = express.Router();

    roteador.get(
      "/",
      this.autenticacao.autenticacao,
      this.contratoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.contratoController.listarContratos
    );

    roteador.post(
      "/",
      this.autenticacao.autenticacao,
      this.contratoValidation.criarContratoValidacao(),
      this.validacao.validar,
      this.contratoController.criarContrato
    );

    roteador.get(
      "/:id",
      this.autenticacao.autenticacao,
      this.contratoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.contratoController.buscarContratoPorId
    );

    roteador.put(
      "/:id",
      this.autenticacao.autenticacao,
      this.contratoValidation.editarContratoValidacao(),
      this.validacao.validar,
      this.contratoController.editarContrato
    );

    roteador.delete(
      "/:id",
      this.autenticacao.autenticacao,
      this.contratoValidation.verificarPermissoes(),
      this.validacao.validar,
      this.contratoController.excluirContrato
    );

    return roteador;
  }
}
