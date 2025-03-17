import { type Request, type Response } from "express";
import { type Pool } from "pg";

import Noticia from "../../entities/direcao/Noticia";

class NoticiaController{
    private conexao: Pool | undefined;
    private noticia: Noticia;

    constructor(conexao: Pool | undefined) {
        this.conexao = conexao;
        this.noticia = new Noticia();
    }

    public criarNoticia = async (req: Request, res: Response): Promise<void> => {
        const { titulo, texto, palavrasChave } = req.body;

        try {

            const diretor_id = req.cookies.usuario.diretor_id;

            this.noticia.setTitulo(titulo);
            this.noticia.setTexto(texto);
            this.noticia.setPalavrasChave(palavrasChave);

            const resultado = await this.conexao?.query(
                "INSERT INTO museum.noticia (titulo,texto,palavrasChave,diretor_id) values ($1,$2,$3,$4) RETURNING *",
                [titulo, texto, palavrasChave, diretor_id]
            );

            res.status(201).json({
                mensagem: "Noticia criada com sucesso!",
                noticia: resultado?.rows[0],

            });

        } catch (erro: any) {
            console.error(erro);
            res.status(500).json({ erros: ["Não foi possivel criar noticia!"] });
        }
    };

    


}