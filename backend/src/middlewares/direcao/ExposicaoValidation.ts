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
          if (!usuario.permissoes.includes("Consultar exposições")) {
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
            return value.every(dia => /^\d{2}-\d{2}-\d{4}$/.test(dia));
        }).withMessage("As datas devem estar no formato DD-MM-YYYY!"),

      body("descricao")
        .isString(),
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
            return value.every(dia => /^\d{2}-\d{2}-\d{4}$/.test(dia));
        }).withMessage("As datas devem estar no formato DD-MM-YYYY!"),

      body("descricao")
        .isString(),
    ];
  };

  public excluirExposicaoValidacao = () => {
    return [
      this.verificarPermissoes(),
    ];
  };
}
