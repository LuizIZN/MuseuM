import express from "express";
import { Pool } from "pg";
import GerenciaRoutes from "./GerenciaRoutes";
import Banco from "../config/db";

export default class Roteador {
    private conexao: Pool | undefined;
    private roteador: express.Router;
    private gerenciaRoutes: GerenciaRoutes;
    private banco: Banco;
    //private direcaoRoutes: DirecaoRoutes;
    //private atendimentoRoutes: AtendimentoRoutes;

    constructor() {
        this.banco = new Banco();
        this.conexao = this.banco.criarConexao();
        this.roteador = express.Router();
        this.gerenciaRoutes = new GerenciaRoutes(this.conexao);
    }

    private setGerenciaRoutes(): void {
        this.roteador.use("/funcionarios", this.gerenciaRoutes.funcionarioRoutes());
        this.roteador.use("/itens", this.gerenciaRoutes.itemRoutes());
    }

    private setDirecaoRoutes(): void {

    }

    private setAtendimentoRoutes() : void {

    }

    public rotas(): express.Router {

        this.setGerenciaRoutes();
        this.setDirecaoRoutes();
        this.setAtendimentoRoutes();

        return this.roteador;
    }
}