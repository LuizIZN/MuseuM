import express from "express";
import cors from "cors";
const path = require("path");
require("dotenv").config();
import cookieParser from "cookie-parser";

// rotas
import Roteador from "./routes/routes";

class App {
  public app: express.Application;
  private roteador: Roteador | undefined;

  constructor() {
    this.app = express();
    this.roteador = undefined;
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors({ origin: "*" }));
    this.app.use(cookieParser());
    this.app.use(
      express.static(path.join(__dirname, "./views/telas"))
    );
  }

  private routes(): void {
    this.roteador = new Roteador();
    this.app.use(this.roteador.rotas());
  }

  public executar(porta: number): void {
    this.app.listen(porta, () => {
      console.log(`Servidor rodando em ${process.env.APP_HOST}:${porta}`);
    });
  }
}

const app = new App();
app.executar(parseInt(process.env.APP_PORT as string) || 4000);
