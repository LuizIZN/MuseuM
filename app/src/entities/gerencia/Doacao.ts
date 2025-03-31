class Doacao {
  private valor: number;
  private data: string;

  constructor() {
    this.valor = 0;
    this.data = "";
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  public getData(): string {
    return this.data;
  }

  public setData(data: string): void {
    this.data = data;
  }
}