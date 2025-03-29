import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

// Controllers
import HorarioFuncionamentoController from "../controllers/direcao/HorarioFuncionamento";

// Middlewares
import HorarioFuncionamentoValidation from "../middlewares/direcao/horarioFuncionamento";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

export default class DirecaoRoutes {
    private horarioFuncionamentoController: HorarioFuncionamentoController;
    private horarioFuncionamentoValidation: HorarioFuncionamentoValidation;
    private autenticacao: Autenticacao;
    private validacao: Validacao;

    constructor(conexao: Pool | undefined) {
        this.horarioFuncionamentoController = new HorarioFuncionamentoController(conexao);
        this.horarioFuncionamentoValidation = new HorarioFuncionamentoValidation();
        this.autenticacao = new Autenticacao(conexao);
        this.validacao = new Validacao();
    }

    public horarioFuncionamentoRoutes(): Router {
        const roteador = express.Router();

        roteador.get(
            "/",
            this.autenticacao.autenticacao,
            this.validacao.validar,
            this.horarioFuncionamentoController.listarHorarioFuncionamento
        );

        roteador.post(
            "/",
            this.autenticacao.autenticacao,
            this.horarioFuncionamentoValidation.criarHorarioValidacao(),
            this.validacao.validar,
            this.horarioFuncionamentoController.criarHorarioFuncionamento
        );

        roteador.put(
            "/:id",
            this.autenticacao.autenticacao,
            this.horarioFuncionamentoValidation.editarHorarioValidacao(),
            this.validacao.validar,
            this.horarioFuncionamentoController.editarHorarioFuncionamento
        );

        roteador.delete(
            "/:id",
            this.autenticacao.autenticacao,
            this.horarioFuncionamentoValidation.excluirHorarioValidacao(),
            this.validacao.validar,
            this.horarioFuncionamentoController.excluirHorarioFuncionamento
        );

        return roteador;
    }
}