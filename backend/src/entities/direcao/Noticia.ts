class Noticia {
    private id: number;
    private titulo: string;
    private texto: string;
    private palavrasChave: string[];
    
    constructor(){
        this.id = 0;    
        this.titulo = "";
        this.texto = "";
        this.palavrasChave = [];

    }

    public getTitulo():string {
        return this.titulo;
    }

    public setTitulo(titulo:string) {
        this.titulo = titulo;
    }

    public getTexto():string {
        return this.texto;
    }

    public setTexto(texto:string) {
        this.texto = texto;
    }

    public getPalavrasChave():string[] {
        return this.palavrasChave;
    }

    public setPalavrasChave(pChave:string[]) {
        this.palavrasChave = pChave;
    }

    public getNoticia = (): object => {
        return {
            id: this.id,
            titulo: this.titulo,
            texto: this.texto,
            palavrasChave: this.palavrasChave
        };
    }
    
}
export default Noticia;