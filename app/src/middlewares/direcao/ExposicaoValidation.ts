const { body, cookie } = require("express-validator");

export default class ExposicaoValidation {
  private verificarPermissoes = () => {
    return cookie("usuario")
      .custom((usuario: any) => {
        if (usuario.permissoes.includes("Gerenciar exposicoes")) {
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
          if (!usuario.permissoes.includes("Consultar exposicoes")) {
            return false;
          }

          return true;
        })
        .withMessage("Usuário não possui permissão!"),
    ];
  };

  public criarExposicaoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("titulo")
        .isString()
        .withMessage("O titulo é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage("O titulo precisa ter entre 4 e 50 caracteres!"),

      body("dias")
        .isArray()
        .withMessage("Os dias devem ser um array de datas!")
        .custom((value: string[]) => {
            return value.every(dia => /^\d{4}-\d{2}-\d{2}$/.test(dia));
        }).withMessage("As datas devem estar no formato YYYY-MM-DD!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 200 })
        .withMessage("A descrição precisa ter entre 4 e 200 caracteres!"),
    ];
  };

  public editarExposicaoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("titulo")
        .isString()
        .withMessage("O titulo é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage("O titulo precisa ter entre 4 e 50 caracteres!"),

      body("dias")
        .isArray()
        .withMessage("Os dias devem ser um array de datas!")
        .custom((value: string[]) => {
            return value.every(dia => /^\d{4}-\d{2}-\d{2}$/.test(dia));
        }).withMessage("As datas devem estar no formato YYYY-MM-DD!"),

      body("descricao")
        .isString()
        .withMessage("A descrição é obrigatória!")
        .isLength({ min: 4, max: 200 })
        .withMessage("A descrição precisa ter entre 4 e 200 caracteres!"),
    ];
  };

  public excluirExposicaoValidacao = () => {
    return [
      this.verificarPermissoes(),
    ];
  };
}
