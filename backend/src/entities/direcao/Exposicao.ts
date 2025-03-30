export default class Exposicao {
    private id: number;
    private titulo: string;
    private dias: Date[];
    private descricao: string;

    constructor() {
        this.id = 0;
        this.titulo = "";
        this.dias = [];
        this.descricao = "";
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public setTitulo(titulo: string) {
        this.titulo = titulo;
    }

    public getDias(): Date[] {
        return this.dias;
    }

    public setDias(dias: Date[]) {
        this.dias = dias;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public setDescricao(descricao: string) {
        this.descricao = descricao;
    }

    public getExposicao = (): object => {
        return {
            id: this.id,
            titulo: this.titulo,
            dias: this.dias,
            descricao: this.descricao,
        };
    }
}