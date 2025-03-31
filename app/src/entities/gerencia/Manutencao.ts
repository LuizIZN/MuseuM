class Manutencao {
  private nome_tecnico: string;
  private numIdTecnico: number;
  private dataManutencao: string;
  private descricao: string;
  private valor: number;

  constructor() {
    this.nome_tecnico = "";
    this.numIdTecnico = 0;
    this.dataManutencao = "";
    this.descricao = "";
    this.valor = 0;
  }

  public getNomeTecnico(): string {
    return this.nome_tecnico;
  }

  public setNomeTecnico(nome_tecnico: string): void {
    this.nome_tecnico = nome_tecnico;
  }

  public getNumIdTecnico(): number {
    return this.numIdTecnico;
  }

  public setNumIdTecnico(numIdTecnico: number): void {
    this.numIdTecnico = numIdTecnico;
  }

  public getDataManutencao(): string {
    return this.dataManutencao;
  }

  public setDataManutencao(dataManutencao: string): void {
    this.dataManutencao = dataManutencao;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao;
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  
}