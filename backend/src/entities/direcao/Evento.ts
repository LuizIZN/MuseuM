class Evento {
  private titulo: string;
  private tipo: string;
  private descricao: string;
  private horario: string;
  private duracao: string[];
  private coordenador: string;

  constructor() {
    this.titulo = "";
    this.tipo = "";
    this.descricao = "";
    this.horario = "";
    this.duracao = [];
    this.coordenador = "";
  }

  public setTitulo(titulo: string): void {
    this.titulo = titulo;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public setTipo(tipo: string): void {
    this.tipo = tipo;
  }

  public getTipo(): string {
    return this.tipo;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setHorario(horario: string): void {
    this.horario = horario;
  }

  public getHorario(): string {
    return this.horario;
  }

  public setDuracao(duracao: string[]): void {
    this.duracao = duracao;
  }

  public getDuracao(): string[] {
    return this.duracao;
  }

  public setCoordenador(coordenador: string): void {
    this.coordenador = coordenador;
  }

  public getCoordenador(): string {
    return this.coordenador;
  }

  public getEvento(): object {
    return {
      titulo: this.titulo,
      tipo: this.tipo,
      descricao: this.descricao,
      horario: this.horario,
      duracao: this.duracao,
      coordenador: this.coordenador,
    };
  }
}

export default Evento;