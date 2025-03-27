import Visitante from "./Visitante";

export default class Pessoajuridica extends Visitante {
  private id: number;
  private visitante_id: number;
  private cnpj: string;
  private razao_social: string;

  constructor() {
    super();
    this.id = 0;
    this.visitante_id = 0;
    this.cnpj= "";
    this.razao_social= "";
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

  public setCnpj(cnpj: string) {
    this.cnpj = cnpj;
  }

  public getCnpj(): string {
    return this.cnpj;
  }

  public setRazao_social(razao_social: string) {
    this.razao_social = razao_social;
  }

  public getRazao_social(): string {
    return this.razao_social;
  }
}
