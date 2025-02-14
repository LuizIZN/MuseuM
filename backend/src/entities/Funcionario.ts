class Funcionario {
    protected nome: string;
    protected email: string; 
    protected senha: string;
    protected usuario: Object;

    constructor() {
        this.nome = "";
        this.email = "";
        this.senha = "";
        this.usuario = {};
    }

    public getNome(): string{
        return this.nome;
    }

    public setNome(nome: string) {
        this.nome = nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public setSenha(senha: string) {
        this.senha = senha;
    }

    public getUsuario(): Object {
        return this.usuario;
    }

    public setUsuario() {
        this.usuario = {
            nome: this.getNome(),
            email: this.getEmail(),
            senha: this.getSenha()
        }
    }
};

export default Funcionario;