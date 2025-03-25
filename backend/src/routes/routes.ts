import express from "express";
import { Pool } from "pg";
import GerenciaRoutes from "./GerenciaRoutes";
import DirecaoRoutes from "./DirecaoRoutes";
import Banco from "../config/db";
import AtendenteRoutes from "./AtendimenteRoutes";

export default class Roteador {
  private conexao: Pool | undefined;
  private roteador: express.Router;
  private gerenciaRoutes: GerenciaRoutes | undefined;
  private direcaoRoutes: DirecaoRoutes | undefined;
  private atendimentoRoutes: AtendenteRoutes | undefined;
  private banco: Banco;

  constructor() {
    this.banco = new Banco();
    this.banco
      .criarConexao()
      .then((conexao) => {
        this.conexao = conexao;
        console.log("Conexão com o banco de dados estabelecida!");

        this.gerenciaRoutes = new GerenciaRoutes(this.conexao);
        this.direcaoRoutes = new DirecaoRoutes(this.conexao);
        this.atendimentoRoutes = new AtendenteRoutes(this.conexao);
        this.setDirecaoRoutes();
        this.setGerenciaRoutes();
        this.setAtendimentoRoutes();
      })
      .catch((erro) => {
        console.error("Erro ao conectar ao banco de dados!", erro);
        process.exit(1);
      });
    this.roteador = express.Router();
  }

  private setGerenciaRoutes(): void {
    if (!this.gerenciaRoutes) {
      return;
    }
    this.roteador.use("/funcionarios", this.gerenciaRoutes.funcionarioRoutes());
    this.roteador.use("/itens", this.gerenciaRoutes.itemRoutes());
  }

  private setDirecaoRoutes(): void {
    if (!this.direcaoRoutes) {
      return;
    }
    this.roteador.use("/noticias", this.direcaoRoutes.noticiaRoutes());
  }

  private setAtendimentoRoutes(): void {
    if (!this.atendimentoRoutes) {
      return;
    }
    this.roteador.use("/visitantes", this.atendimentoRoutes.visitanteRoutes());
  }

  public rotas(): express.Router {
    this.setGerenciaRoutes();
    this.setDirecaoRoutes();
    this.setAtendimentoRoutes();

    return this.roteador;
  }
}
