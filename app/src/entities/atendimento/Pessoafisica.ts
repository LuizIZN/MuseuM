import Visitante from "./Visitante";

export default class Pessoafisica extends Visitante {
  private id: number;
  private visitante_id: number;
  private cpf: string;
  private nome: string;

  constructor() {
    super();
    this.id = 0;
    this.visitante_id = 0;
    this.cpf= "";
    this.nome= "";
  }

  public setId(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public setVisitanteId(visitante_id: number) {
    this.visitante_id = visitante_id;
  }

  public getVisitanteId(): number {
    return this.visitante_id;
  }

  public setCpf(cpf: string) {
    this.cpf = cpf;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public setNome(nome: string) {
    this.nome = nome;
  }

  public getNome(): string {
    return this.nome;
  }
}
