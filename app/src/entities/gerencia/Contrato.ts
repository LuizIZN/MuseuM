class Contrato {
  private valor: number;
  private descricao: string;

  constructor() {
    this.valor = 0;
    this.descricao = "";
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao;
  }
}