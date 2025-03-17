import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

//Controllers
import VisitanteController from "../controllers/atendimento/VisitanteController";

//Middlewares
import VisitanteValidation from "../middlewares/atendimento/VisitanteValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";


export default class AtendenteRoutes {
    //Controllers
    private visitanteController: VisitanteController;


    //Middlewares
    private visitanteValidation: VisitanteValidation;
    private autenticacao: Autenticacao;
    private validacao: Validacao;
    
    constructor(conexao: Pool | undefined) {
        this.visitanteController = new VisitanteController(conexao);
        this.visitanteValidation = new VisitanteValidation();
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

}