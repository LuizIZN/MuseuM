import { Pool } from "pg";

export default class Banco {
    private conexao: Pool | undefined;

    private setConexao(): void {
        this.conexao = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT as string),
        });
    }

    private getConexao(): Pool | undefined {
        return this.conexao;
    }

    public async criarConexao(): Promise<Pool | undefined> {
        try {
            this.setConexao();

            await this.conexao!.connect();

            return this.conexao;
        } catch (erro: any) {
            console.error('Erro ao conectar ao banco de dados!', erro);
            process.exit(1);
        }
    }
}