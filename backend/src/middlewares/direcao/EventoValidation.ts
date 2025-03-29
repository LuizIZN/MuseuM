import { body, cookie } from "express-validator";

export default class EventoValidation {
  public verificarPermissoes() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Gerenciar eventos")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public verificarPermissoesConsulta() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Consultar eventos")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public criarEditarEventoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("titulo").isString().withMessage("O título é obrigatório!"),
      body("descricao").isString().withMessage("A descrição é obrigatória!"),
      body("horario")
        .isString()
        .withMessage("O horário é obrigatório!")
        .custom((horario: string) => {
          return /^\d{2}:\d{2}:\d{2}$/.test(horario);
        })
        .withMessage("O horário deve estar no formato HH:MM:SS!"),
      body("duracao")
        .isArray()
        .withMessage("A duração devem ser um array de datas!")
        .custom((value: string[]) => {
          return value.every((dia) => /^\d{4}-\d{2}-\d{2}$/.test(dia));
        })
        .withMessage("As datas devem estar no formato YYYY-MM-DD!"),
    ];
  };
}
