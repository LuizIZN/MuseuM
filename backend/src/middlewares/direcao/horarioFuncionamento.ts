const { body, cookie } = require("express-validator");

export default class HorarioFuncionamentoValidation {
  private verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar horarios")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public criarHorarioValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("horaInicio")
        .isString()
        .withMessage("A hora de início é obrigatória!")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("A hora de início deve estar no formato HH:mm!"),

      body("horaFim")
        .isString()
        .withMessage("A hora de fim é obrigatória!")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("A hora de fim deve estar no formato HH:mm!"),

      body("diasComerciais")
        .isArray()
        .withMessage("Os dias comerciais devem ser um array!")
        .custom((dias: string[]) => dias.every((dia) => /^\d{4}-\d{2}-\d{2}$/.test(dia)))
        .withMessage("Os dias comerciais devem estar no formato YYYY-MM-DD!"),
    ];
  };

  public editarHorarioValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("horaInicio")
        .isString()
        .withMessage("A hora de início é obrigatória!")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("A hora de início deve estar no formato HH:mm!"),

      body("horaFim")
        .isString()
        .withMessage("A hora de fim é obrigatória!")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("A hora de fim deve estar no formato HH:mm!"),

      body("diasComerciais")
        .isArray()
        .withMessage("Os dias comerciais devem ser um array!")
        .custom((dias: string[]) => dias.every((dia) => /^\d{4}-\d{2}-\d{2}$/.test(dia)))
        .withMessage("Os dias comerciais devem estar no formato YYYY-MM-DD!"),
    ];
  };

  public excluirHorarioValidacao = () => {
    return [
      this.verificarPermissoes(),
    ];
  };
}
