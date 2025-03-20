import express from "express";
import { Pool } from "pg";
import GerenciaRoutes from "./GerenciaRoutes";
import DirecaoRoutes from "./DirecaoRoutes";
import Banco from "../config/db";
import AtendenteRoutes from "./AtendimenteRoutes";

export default class Roteador {
    private conexao: Pool | undefined;
    private roteador: express.Router;
    private gerenciaRoutes: GerenciaRoutes;
    private direcaoRoutes: DirecaoRoutes;
    private banco: Banco;
    //private direcaoRoutes: DirecaoRoutes;
    private atendimentoRoutes: AtendenteRoutes;

    constructor() {
        this.banco = new Banco();
        this.conexao = this.banco.criarConexao();
        this.roteador = express.Router();
        this.gerenciaRoutes = new GerenciaRoutes(this.conexao);
        this.direcaoRoutes = new DirecaoRoutes(this.conexao);
        this.atendimentoRoutes = new AtendenteRoutes(this.conexao)
    }

    private setGerenciaRoutes(): void {
        this.roteador.use("/funcionarios", this.gerenciaRoutes.funcionarioRoutes());
        this.roteador.use("/itens", this.gerenciaRoutes.itemRoutes());
    }

    private setDirecaoRoutes(): void {
        this.roteador.use("/exposicoes", this.direcaoRoutes.exposicaoRoutes());
        this.roteador.use("/noticias", this.direcaoRoutes.noticiaRoutes());
    }

    private setAtendimentoRoutes() : void {
        this.roteador.use("/visitante", this.atendimentoRoutes.visitanteRoutes())
    }

    public rotas(): express.Router {

        this.setGerenciaRoutes();
        this.setDirecaoRoutes();
        this.setAtendimentoRoutes();

        return this.roteador;
    }
}