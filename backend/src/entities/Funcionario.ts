export default class Funcionario {
    protected nome: string;
    protected email: string;
    protected senha: string;

    constructor(nome: string, email: string, senha: string) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public getNome(): string {
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

    public getUser(): Object {
        return {
            username: this.getNome(),
            email: this.getEmail()
        };
    }
};