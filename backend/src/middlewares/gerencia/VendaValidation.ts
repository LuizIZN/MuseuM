import { body, cookie } from "express-validator";

export default class VendaValidation {
  public verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar vendas")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public criarVendaValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("data")
        .isString()
        .withMessage("A data é obrigatória!")
        .custom((value: string) => /^\d{4}-\d{2}-\d{2}/.test(value))
        .withMessage("A data deve estar no formato YYYY-MM-DD!"),

      body("valor")
        .isNumeric()
        .withMessage("O valor é obrigatório!")
        .custom((value: number) => value > 0)
        .withMessage("O valor deve ser maior que zero!"),

      body("visitante_id")
        .isNumeric()
        .withMessage("O visitante é obrigatório!")
        .custom((value: number) => value > 0)
        .withMessage("O visitante deve ser maior que zero!"),
    ];
  };

  public editarVendaValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("data")
        .isString()
        .withMessage("A data é obrigatória!")
        .custom((value: string) => /^\d{4}-\d{2}-\d{2}/.test(value))
        .withMessage("A data deve estar no formato YYYY-MM-DD!"),

      body("valor")
        .isNumeric()
        .withMessage("O valor é obrigatório!")
        .custom((value: number) => value > 0)
        .withMessage("O valor deve ser maior que zero!"),
    ];
  }
}