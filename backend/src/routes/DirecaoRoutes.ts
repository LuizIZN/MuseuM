import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";

//Controllers
import ExposicaoController from "../controllers/direcao/ExposicaoController";   

//Middlewares
import ExposicaoValidation from "../middlewares/direcao/ExposicaoValidation";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";


export default class DirecaoRoutes {
    //Controllers
    private exposicaoController: ExposicaoController;


    //Middlewares
    private exposicaoValidation: ExposicaoValidation;
    private autenticacao: Autenticacao;
    private validacao: Validacao;
    
    constructor(conexao: Pool | undefined) {
        this.exposicaoController = new ExposicaoController(conexao);
        this.exposicaoValidation = new ExposicaoValidation();
        this.autenticacao = new Autenticacao(conexao);
        this.validacao = new Validacao();
    }

    public exposicaoRoutes(): Router {
        const roteador = express.Router();
    
        roteador.get(
          "/",
          this.autenticacao.autenticacao,
          this.exposicaoValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.exposicaoController.listarExposicao
        );
    
        roteador.post(
          "/",
          this.autenticacao.autenticacao,
          this.exposicaoValidation.criarExposicaoValidacao(),
          this.validacao.validar,
          this.exposicaoController.criarExposicao
        );
    
        roteador.get(
          "/:id",
          this.autenticacao.autenticacao,
          this.exposicaoValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.exposicaoController.buscarExposicaoPorId
        );
    
        roteador.put(
          "/:id",
          this.autenticacao.autenticacao,
          this.exposicaoValidation.editarExposicaoValidacao(),
          this.validacao.validar,
          this.exposicaoController.editarExposicao
        );
    
        roteador.delete(
          "/:id",
          this.autenticacao.autenticacao,
          this.exposicaoValidation.excluirExposicaoValidacao(),
          this.validacao.validar,
          this.exposicaoController.excluirExposicao
        );
    
        return roteador;
    }

}