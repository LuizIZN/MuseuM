import { type Router } from "express";
import express from "express";
import { type Pool } from "pg";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

//Controllers
import NoticiaController from "../controllers/direcao/NoticiaController";
import ExposicaoController from "../controllers/direcao/ExposicaoController";   
import EventoController from "../controllers/direcao/EventoController";


//Middlewares
import NoticiaValidation from "../middlewares/direcao/NoticiaValidation";
import ExposicaoValidation from "../middlewares/direcao/ExposicaoValidation";
import EventoValidation from "../middlewares/direcao/EventoValidation";


export default class DirecaoRoutes {
    //Controllers
    private noticiaController: NoticiaController;
    private exposicaoController: ExposicaoController;
    private eventoController: EventoController;

    //Middlewares
    private exposicaoValidation: ExposicaoValidation;
    private autenticacao: Autenticacao;
    private validacao: Validacao;
    private noticiaValidation: NoticiaValidation;
    private eventoValidation: EventoValidation;
    
    constructor(conexao: Pool | undefined) {
        this.exposicaoController = new ExposicaoController(conexao);
        this.exposicaoValidation = new ExposicaoValidation();
        this.autenticacao = new Autenticacao(conexao);
        this.validacao = new Validacao();
        this.noticiaController = new NoticiaController(conexao);
        this.noticiaValidation = new NoticiaValidation();
        this.eventoController = new EventoController(conexao);
        this.eventoValidation = new EventoValidation();
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

    public eventoRoutes(): Router {
        const roteador = express.Router();
    
        roteador.get(
          "/",
          this.autenticacao.autenticacao,
          this.eventoValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.eventoController.listarEventos
        );
    
        roteador.post(
          "/",
          this.autenticacao.autenticacao,
          ...this.eventoValidation.criarEditarEventoValidacao(),
          this.validacao.validar,
          this.eventoController.criarEvento
        );
    
        roteador.get(
          "/:id",
          this.autenticacao.autenticacao,
          this.eventoValidation.verificarPermissoesConsulta(),
          this.validacao.validar,
          this.eventoController.buscarEventoPorId
        );
    
        roteador.put(
          "/:id",
          this.autenticacao.autenticacao,
          ...this.eventoValidation.criarEditarEventoValidacao(),
          this.validacao.validar,
          this.eventoController.editarEvento
        );
    
        roteador.delete(
          "/:id",
          this.autenticacao.autenticacao,
          this.eventoValidation.verificarPermissoes(),
          this.validacao.validar,
          this.eventoController.excluirEvento
        );
    
        return roteador;
    }
}