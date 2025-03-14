import { type Pool } from "pg";
import Autenticacao from "../middlewares/autenticacao";
import Validacao from "../middlewares/validacao";

//Controllers

//Middlewares

export default class DirecaoRoutes {
    //Controllers

    //Middlewares
    private autenticacao: Autenticacao;
    private validacao: Validacao;
    
    constructor(conexao: Pool | undefined) {
        this.autenticacao = new Autenticacao(conexao);
        this.validacao = new Validacao();
    }

}