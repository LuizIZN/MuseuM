const { body, cookie } = require("express-validator");
import { Request } from "express";

export default class FuncionarioValidation {
  public verificarPermissoes() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Gerenciar funcionarios")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public criarFuncionarioValidacao = () => {
    return [
      body("nome")
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 4, max: 100 })
        .withMessage("O nome precisa ter entre 4 e 100 caracteres!"),

      body("email")
        .isString()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("Insira um e-mail válido!")
        .isLength({ max: 45 })
        .withMessage("O e-mail precisa ter no máximo 45 caracteres!"),

      body("senha")
        .isString()
        .withMessage("A senha é obrigatória")
        .isLength({ min: 5 })
        .withMessage("A senha precisa ter no mínimo 5 caracteres!"),

      body("confirmar_senha")
        .isString()
        .withMessage("A confirmação de senha é obrigatória!")
        .custom((valor: string, { req }: { req: Request }) => {
          if (valor !== req.body.senha) {
            throw new Error("As senhas não conferem!");
          }
          return true;
        }),

      body("cargo")
        .isString()
        .withMessage("O cargo é obrigatório!")
        .isIn(["gerente", "diretor", "atendente"])
        .withMessage("Cargo inválido!"),
    ];
  };

  public editarFuncionarioValidacao = () => {
    return [
      body("nome")
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 4, max: 100 })
        .withMessage("O nome precisa ter entre 4 e 100 caracteres!"),

      body("email")
        .isString()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("Insira um e-mail válido!")
        .isLength({ max: 45 })
        .withMessage("O e-mail precisa ter no máximo 45 caracteres!"),
    ];
  };

  public logarValidacao = () => {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (usuario) {
          throw new Error("Usuário já está logado!");
        }
        return true;
      }),

      body("email")
        .isString()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("Insira um e-mail válido!"),
        
      body("senha")
        .isString()
        .withMessage("A senha é obrigatória")
        .isLength({ min: 5 })
        .withMessage("A senha precisa ter no mínimo 5 caracteres!"),
    ];
  };
}
