import { body, cookie } from "express-validator";

export default class DoacaoValidation {
  public verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar doacoes")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public criarDoacaoValidacao = () => {
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

      body("cod_item")
        .isString()
        .withMessage("O código é obrigatório!")
        .isLength({ max: 7 })
        .withMessage("O código precisa ter até 7 caracteres!"),

      body("nome")
        .isString()
        .withMessage("O nome do item é obrigatório!")
        .isLength({ min: 3, max: 100 })
        .withMessage("O nome do item deve ter entre 3 e 100 caracteres!"),

      body("estadoconservacao")
        .isString()
        .withMessage("O estado de conservação é obrigatório!")
        .isLength({ min: 3, max: 100 })
        .withMessage(
          "O estado de conservação deve ter entre 3 e 100 caracteres!"
        ),

      body("classificacao")
        .isString()
        .withMessage("A classificação é obrigatória!")
        .isLength({ min: 3, max: 100 })
        .withMessage("A classificação deve ter entre 3 e 100 caracteres!"),
    ];
  };

  public editarDoacaoValidacao = () => {
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
  };
}
