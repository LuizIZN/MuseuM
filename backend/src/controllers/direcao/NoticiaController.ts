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

    public listarNoticias = async (req: Request, res: Response): Promise<void> => {
        try {
          const resultado = await this.conexao?.query(
            `SELECT n.*, f.nome as diretor_nome FROM museum.noticia n 
              JOIN museum.diretor d ON n.diretor_id = d.id 
              JOIN museum.funcionario f ON d.funcionario_id = f.id;`
          );
    
          if (resultado?.rowCount === 0) {
            res.status(404).json({ erros: ["Nenhuma noticia encontrada!"] });
            return;
          }
    
          res.status(200).json(resultado?.rows);
        } catch (erro: any) {
          console.error(erro);
          res.status(500).json({ erros: ["Não foi possível listar noticias!"] });
        }
    };

    public buscarNoticiaPorId = async (
        req: Request,
        res: Response
      ): Promise<void> => {
        const { id } = req.params;
    
        try {
          const resultado = await this.conexao?.query(
            "SELECT i.*, f.nome as diretor_nome FROM museum.noticia i JOIN museum.diretor d ON i.diretor_id = d.id JOIN museum.funcionario f ON d.funcionario_id = f.id WHERE i.id = $1;",
            [id]
          );
    
          if (resultado?.rowCount === 0) {
            res.status(404).json({ erros: ["Noticia não encontrada!"] });
            return;
          }
    
          res.status(200).json(resultado?.rows[0]);
        } catch (erro: any) {
          console.error(erro);
          res.status(500).json({ erros: ["Não foi possível buscar noticia!"] });
        }
    };

    public editarNoticia = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { titulo, texto, palavrasChave } = req.body;
    
        try {
          const resultado = await this.conexao?.query(
            "UPDATE museum.noticia SET titulo = $1, texto = $2, palavrasChave = $3 WHERE id = $4 RETURNING *",
            [titulo,texto,palavrasChave, id]
          );
    
          if (resultado?.rowCount === 0) {
            res.status(404).json({ erros: ["Noticia não encontrada!"] });
            return;
          }
    
          res.status(200).json({
            mensagem: "Noticia atualizada com sucesso!",
            item: resultado?.rows[0],
          });
        } catch (erro: any) {
          console.error(erro);
          res.status(500).json({ erros: ["Não foi possível editar noticia!"] });
        }
    };

    public excluirNoticia = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
    
        try {
          const resultado = await this.conexao?.query(
            "DELETE FROM museum.noticia WHERE id = $1",
            [id]
          );
    
          if (resultado?.rowCount === 0) {
            res.status(404).json({ erros: ["Noticia não encontrada!"] });
            return;
          }
    
          res.status(200).json({
            excluido: resultado?.rows[0],
            mensagem: "Noticia excluída com sucesso!",
          });
        } catch (erro: any) {
          console.error(erro);
          res.status(500).json({ erros: ["Não foi possível excluir noticia!"] });
        }
    };
    
}
export default NoticiaController;