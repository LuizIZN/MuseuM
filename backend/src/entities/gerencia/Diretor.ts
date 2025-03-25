import Funcionario from "./Funcionario";

export default class Diretor extends Funcionario {
  private id: number;
  private funcionario_id: number;
  private _permissoes: string[];

  constructor() {
    super();
    this.id = 0;
    this.funcionario_id = 0;
    this._permissoes = [
      "Gerenciar eventos",
      "Gerenciar exposicoes",
      "Gerenciar noticias",
      "Consultar itens",
      "Consultar noticias"
    ];
    this.setCargo("diretor");
  }

  public setId(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public setFuncionarioId(funcionario_id: number) {
    this.funcionario_id = funcionario_id;
  }

  public getFuncionarioId(): number {
    return this.funcionario_id;
  }

  public getPermissoes(): string[] {
    return this._permissoes;
  }
}