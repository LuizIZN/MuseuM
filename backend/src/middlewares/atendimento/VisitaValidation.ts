const { body, cookie } = require("express-validator");

export default class VisitaValidation {
  public verificarPermissoes() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Gerenciar visitas")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public criarEditarVisitaValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("data")
        .isString()
        .withMessage("A data é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("A data deve estar no formato YYYY-MM-DD!"),
      body("horario")
        .isString()
        .withMessage("O horário é obrigatório!")
        .custom((horario: string) => {
          return /^\d{2}:\d{2}:\d{2}$/.test(horario);
        })
        .withMessage("O horário deve estar no formato HH:MM:SS!"),
    ];
  };
}
