export default class HorarioFuncionamento {
    private id: number;
    private horaInicio: string;
    private horaFim: string;
    private diasComerciais: Date[]; 

    constructor() {
        this.id = 0;
        this.horaInicio = "";
        this.horaFim = "";
        this.diasComerciais = [];
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }

    public gethoraInicio(): string {
        return this.horaInicio;
    }

    public sethoraInicio(horaInicio: string) {
        this.horaInicio = horaInicio;
    }

    public gethoraFim(): string {
        return this.horaFim;
    }

    public sethoraFim(horaFim: string) {
        this.horaFim = horaFim;
    }

    public getdiasComerciais(): Date[] {
        return this.diasComerciais;
    }

    public setdiasComerciais(diasComerciais: Date[]) {
        this.diasComerciais = diasComerciais;
    }
}

