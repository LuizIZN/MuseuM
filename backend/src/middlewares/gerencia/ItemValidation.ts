const { body, cookie } = require("express-validator");

export default class ItemValidation {
  private verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar itens")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public verificarPermissoesConsulta = () => {
    return [
      cookie("usuario")
        .custom((usuario: any) => {
          if (!usuario.permissoes.includes("Consultar itens")) {
            return false;
          }

          return true;
        })
        .withMessage("Usuário não possui permissão!"),
    ];
  };

  public criarItemValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("nome")
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage("O nome precisa ter entre 4 e 50 caracteres!"),

      body("codigo")
        .isString()
        .withMessage("O código é obrigatório!")
        .isLength({ max: 7 })
        .withMessage("O código precisa ter até 7 caracteres!"),

      body("classificacao")
        .isString()
        .withMessage("A classificação é obrigatória!")
        .isIn(["Acervo", "Comercio", "Patrimonio"])
        .withMessage("O item precisa ser de acervo, comércio ou patrimônio!"),

      body("estado_conservacao")
        .isString()
        .withMessage("O estado de conservação é obrigatório!")
        .isIn(["Otimo", "Bom", "Regular", "Ruim", "Pessimo"])
        .withMessage(
          "O estado de conservação precisa ser ótimo, bom, regular, ruim ou péssimo!"
        ),
    ];
  };

  public editarItemValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("nome")
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage("O nome precisa ter entre 4 e 50 caracteres!"),

      body("codigo")
        .isString()
        .withMessage("O código é obrigatório!")
        .isLength({ max: 7 })
        .withMessage("O código precisa ter até 7 caracteres!"),

      body("classificacao")
        .isString()
        .withMessage("A classificação é obrigatória!")
        .isIn(["Acervo", "Comercio", "Patrimonio"])
        .withMessage("O item precisa ser de acervo, comércio ou patrimônio!"),

      body("estado_conservacao")
        .isString()
        .withMessage("O estado de conservação é obrigatório!")
        .isIn(["Otimo", "Bom", "Regular", "Ruim", "Pessimo"])
        .withMessage(
          "O estado de conservação precisa ser ótimo, bom, regular, ruim ou péssimo!"
        ),
    ];
  };

  public excluirItemValidacao = () => {
    return [
      this.verificarPermissoes(),
    ];
  };
}
