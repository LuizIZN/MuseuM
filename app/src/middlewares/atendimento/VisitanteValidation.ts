const { body, cookie } = require("express-validator");

export default class VisitanteValidation {
  public verificarPermissoes() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Gerenciar visitantes")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public criarVisitanteValidacao = () => {
    return [
      body("telefone")
        .isString()
        .withMessage("O telefone é obrigatório!")
        .isLength({ min: 11, max: 20 })
        .withMessage("O telefone precisa ter no minimo 11 caracteres"),

      body("email")
        .isString()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("Insira um e-mail válido!")
        .isLength({ max: 45 })
        .withMessage("O e-mail precisa ter no máximo 45 caracteres!"),

      body("endereco")
        .isString()
        .withMessage("O endereco é obrigatória")
        .isLength({ min: 20 })
        .withMessage("O endereco precisa ter no mínimo 20 caracteres!"),

      body("tipodepessoa")
        .isString()
        .withMessage("O tipo de pessoa é obrigatório!")
        .isIn(["pessoafisica", "pessoajuridica"])
        .withMessage("O tipo de pessoa é inválido!")
        .custom((tipodepessoa: string) => {
          if (tipodepessoa === "pessoafisica") {
            body("cpf")
              .isString()
              .withMessage("O CPF é obrigatório!")
              .custom((cpf: string) => {
                if (cpf.length !== 11) {
                  throw new Error("O CPF precisa ter 11 caracteres!");
                }
                return true;
              });
            body("nome").isString().withMessage("O nome é obrigatório!");
          } else {
            body("cnpj")
              .isString()
              .withMessage("O CNPJ é obrigatório!")
              .custom((cnpj: string) => {
                if (cnpj.length !== 14) {
                  throw new Error("O CNPJ precisa ter 14 caracteres!");
                }
                return true;
              });
            body("razao_social")
              .isString()
              .withMessage("A razão social é obrigatória!");
          }
          return true;
        }),
    ];
  };

  public editarVisitanteValidacao = () => {
    return [
      body("telefone")
        .isString()
        .withMessage("O telefone é obrigatório!")
        .isLength({ min: 11, max: 20 })
        .withMessage("O telefone precisa ter no minimo 11 caracteres"),

      body("email")
        .isString()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("Insira um e-mail válido!")
        .isLength({ max: 45 })
        .withMessage("O e-mail precisa ter no máximo 45 caracteres!"),

      body("endereco")
        .isString()
        .withMessage("O endereco é obrigatória")
        .isLength({ min: 20 })
        .withMessage("O endereco precisa ter no mínimo 20 caracteres!"),
    ];
  };
}
