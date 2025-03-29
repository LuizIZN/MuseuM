const { body, cookie } = require("express-validator");

export default class ManutencaoValidation {
  public verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar manutencoes")) {
          return true;
        }

        return false;
      })
      .withMessage("Usuário não possui permissão!");
  };

  public criarManutencaoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("data")
        .isString()
        .withMessage("A data de início é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

      body("nomeTecnico")
        .isString()
        .withMessage("O nome do técnico é obrigatório!")
        .isLength({ max: 45 })
        .withMessage("O nome do técnico precisa ter até 45 caracteres!"),

      body("numIdTecnico")
        .isInt()
        .withMessage("A identificação do técnico é obrigatório!"),

      body("valor").isFloat().withMessage("O valor é obrigatório!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 50 })
        .withMessage("A descrição precisa ter entre 4 e 50 caracteres!"),

      body("itemId").isInt().withMessage("O id do item é obrigatório!"),
    ];
  };

  public editarManutencaoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("data")
        .isString()
        .withMessage("A data de início é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

        body("nomeTecnico")
        .isString()
        .withMessage("O nome do técnico é obrigatório!")
        .isLength({ max: 45 })
        .withMessage("O nome do técnico precisa ter até 45 caracteres!"),

      body("numIdTecnico")
        .isInt()
        .withMessage("A identificação do técnico é obrigatório!"),

      body("valor").isFloat().withMessage("O valor é obrigatório!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 50 })
        .withMessage("A descrição precisa ter entre 4 e 50 caracteres!"),
    ];
  };
}
