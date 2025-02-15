// dependências
import express from "express";
import { Request, Response } from "express";
import { Pool } from "pg";

// controllers
import FuncionarioController from "../controllers/gerencia/FuncionarioController";

// middlewares
import FuncionarioValidation from "../middlewares/gerencia/FuncionarioValidation";
import validate from "../middlewares/validacao";
import AuthGuard from "../middlewares/authGuard";

const conn = require("../config/db");

const pool: Pool | undefined = conn();

const router = express.Router();

// rota principal
router.get("/", (req: Request, res: Response) => {
  res.send("API funcionando");
});

// guarda de autenticação
const guarda = new AuthGuard(pool);

/*

ROTAS DE FUNCIONARIOS

*/
const funcionarioController = new FuncionarioController(pool);
const funcionarioValidation = new FuncionarioValidation();

router.get(
  "/funcionarios",
  guarda.autenticacao,
  funcionarioController.listarFuncionarios
);

router.post(
  "/funcionario",
  guarda.autenticacao,
  funcionarioValidation.criarFuncionarioValidacao(),
  validate,
  funcionarioController.criarFuncionario
);

router.get(
  "/funcionario/:id",
  guarda.autenticacao,
  funcionarioController.buscarFuncionarioPorId
);

router.put(
  "/funcionario/:id",
  guarda.autenticacao,
  funcionarioValidation.editarFuncionarioValidacao(),
  validate,
  funcionarioController.editarFuncionario
);

router.delete(
  "/funcionario/:id",
  guarda.autenticacao,
  funcionarioController.excluirFuncionario
);

// rota login
router.post(
  "/login",
  funcionarioValidation.logarValidacao(),
  validate,
  funcionarioController.logar
);

module.exports = {
  router,
};
