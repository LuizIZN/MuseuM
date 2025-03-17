import { type Pool } from "pg";
import { type Router } from "express";
import express from "express";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

//Controllers
import NoticiaController from "../controllers/direcao/NoticiaController";

//Middlewares
import NoticiaValidation from "../middlewares/direcao/noticiaValidation";

export default class DirecaoRoutes {
    //Controllers
    private noticiaController: NoticiaController;

    //Middlewares
    private autenticacao: Autenticacao;
    private validacao: Validacao;
    private noticiaValidation: NoticiaValidation;
    
    constructor(conexao: Pool | undefined) {
        this.autenticacao = new Autenticacao(conexao);
        this.validacao = new Validacao();
        this.noticiaController = new NoticiaController(conexao);
        this.noticiaValidation = new NoticiaValidation();
    }

    public noticiaRoutes(): Router {
        const roteador = express.Router();
    
        roteador.get(
          "/",
          this.autenticacao.autenticacao,
          this.noticiaValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.noticiaController.listarNoticias
        );
    
        roteador.post(
          "/",
          this.autenticacao.autenticacao,
          this.noticiaValidation.criarNoticiaValidacao(),
          this.validacao.validar,
          this.noticiaController.criarNoticia
        );
    
        roteador.get(
          "/:id",
          this.autenticacao.autenticacao,
          this.noticiaValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.noticiaController.buscarNoticiaPorId
        );
    
        roteador.put(
          "/:id",
          this.autenticacao.autenticacao,
          this.noticiaValidation.editarNoticiaValidacao(),
          this.validacao.validar,
          this.noticiaController.editarNoticia
        );
    
        roteador.delete(
          "/:id",
          this.autenticacao.autenticacao,
          this.noticiaValidation.excluirNoticiaValidacao(),
          this.validacao.validar,
          this.noticiaController.excluirNoticia
        );
    
        return roteador;
    }

}