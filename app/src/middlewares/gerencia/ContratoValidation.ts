import { body, cookie } from "express-validator";

export default class ContratoValidation {
  public verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar contratos")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public criarContratoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("valor").isFloat().withMessage("O valor é obrigatório!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 50 })
        .withMessage("A descrição precisa ter entre 4 e 50 caracteres!"),

      body("pjId").isInt().withMessage("O id da PJ é obrigatório!"),
    ];
  };

  public editarContratoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("valor").isFloat().withMessage("O valor é obrigatório!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 50 })
        .withMessage("A descrição precisa ter entre 4 e 50 caracteres!"),
    ];
  };
}
