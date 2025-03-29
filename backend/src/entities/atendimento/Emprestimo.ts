class Emprestimo {
    private id: number;
    private dataEmprestimo: string;
    private dataDevolucao: string;
    private codigo: string;


    constructor(id: number, dataEmprestimo: string, dataDevolucao: string, codigo: string) {
        this.id = id;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.codigo = codigo;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getDataEmprestimo(): string {
        return this.dataEmprestimo;
    }

    public setDataEmprestimo(dataEmprestimo: string): void {
        this.dataEmprestimo = dataEmprestimo;
    }

    public getDataDevolucao(): string {
        return this.dataDevolucao;
    }

    public setDataDevolucao(dataDevolucao: string): void {
        this.dataDevolucao = dataDevolucao;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(codigo: string): void {
        this.codigo = codigo;
    }
}