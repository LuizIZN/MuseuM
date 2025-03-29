class Visitante {
    protected telefone: string;
    protected email: string; 
    protected endereco: string;

    constructor() {
        this.telefone = "";
        this.email = "";
        this.endereco = "";
    }

    public getTelefone(): string{
        return this.telefone;
    }

    public setTelefone(telefone: string) {
        this.telefone = telefone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getEndereco(): string {
        return this.endereco;
    }

    public setEndereco(endereco: string) {
        this.endereco = endereco;
    }
};

export default Visitante;