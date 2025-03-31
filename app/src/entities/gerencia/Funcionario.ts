class Funcionario {
    protected nome: string;
    protected email: string; 
    protected senha: string;
    protected usuario: { id: number, nome: string, email: string, token: Promise<string>} | {};
    protected cargo: string | undefined;
    protected permissoes: string[] | undefined;

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


    public setCargo(cargo: string) {
        this.cargo = cargo;
    }

    public getCargo(): string | undefined {
        return this.cargo;
    }

    public setPermissoes(permissoes: string[]) {
        this.permissoes = permissoes;
    }

    public getPermissoes(): string[] | undefined {
        return this.permissoes;
    }

    public setUsuario(usuario: object) {
        this.usuario = {
            ...usuario,
            cargo: this.getCargo(),
            permissoes: this.getPermissoes()
        }
    }
    
    public getUsuario(): object {
        return this.usuario;
    }
};

export default Funcionario;