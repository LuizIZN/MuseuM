class Funcionario {
    protected nome: string;
    protected email: string; 
    protected senha: string;
    protected usuario: { id: number, nome: string, email: string, token: Promise<string>} | {};

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

    public getUsuario(): object {
        return this.usuario;
    }

    public setUsuario(usuario: object) {
        this.usuario = usuario;
    }
};

export default Funcionario;