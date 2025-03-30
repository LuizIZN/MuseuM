class Visita {
  private data: string;
  private horario: string;
  private visitanteId: number;

  constructor() {
    this.data = "";
    this.horario = "";
    this.visitanteId = 0;
  }

  public getData(): string {
    return this.data;
  }

  public setData(data: string) {
    this.data = data;
  }

  public getHorario(): string {
    return this.horario;
  }

  public setHorario(horario: string) {
    this.horario = horario;
  }

  public getVisitanteId(): number {
    return this.visitanteId;
  }

  public setVisitanteId(visitanteId: number) {
    this.visitanteId = visitanteId;
  }

  public getVisita(): object {
    return {
      data: this.data,
      horario: this.horario,
      visitanteId: this.visitanteId,
    };
  }
}

export default Visita;