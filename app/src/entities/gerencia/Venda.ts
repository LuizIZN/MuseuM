class Venda {
  private valor: number;
  private data: Date;

  constructor(valor: number, data: Date) {
    this.valor = valor;
    this.data = data;
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  public getData(): Date {
    return this.data;
  }

  public setData(data: Date): void {
    this.data = data;
  }
}