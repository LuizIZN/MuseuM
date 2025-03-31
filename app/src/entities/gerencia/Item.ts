export default class Item {
    private id: number;
    private nome: string;
    private codigo: string;
    private classificacao: string;
    private estado_conservacao: string;

    constructor() {
        this.id = 0;
        this.nome = "";
        this.codigo = "";
        this.classificacao = "";
        this.estado_conservacao = "";
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string) {
        this.nome = nome;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(codigo: string) {
        this.codigo = codigo;
    }

    public getClassificacao(): string {
        return this.classificacao;
    }

    public setClassificacao(classificacao: string) {
        this.classificacao = classificacao;
    }

    public getEstadoConservacao(): string {
        return this.estado_conservacao;
    }

    public setEstadoConservacao(estado_conservacao: string) {
        this.estado_conservacao = estado_conservacao;
    }

    public getItem = (): object => {
        return {
            id: this.id,
            nome: this.nome,
            codigo: this.codigo,
            classificacao: this.classificacao,
            estado_conservacao: this.estado_conservacao
        };
    }
}