const { body } = require("express-validator");
import { Request } from "express";

export default class ItemValidation {
  public criarItemValidacao = () => {
    return [
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
        .isLength({ min: 4, max: 50 })
        .withMessage("A classificação precisa ter entre 4 e 50 caracteres!"),

      body("estado_conservacao")
        .isString()
        .withMessage("O estado de conservação é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage(
          "O estado de conservação precisa ter entre 4 e 50 caracteres!"
        ),
    ];
  };

  public editarItemValidacao = () => {
    return [
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
        .isLength({ min: 4, max: 50 })
        .withMessage("A classificação precisa ter entre 4 e 50 caracteres!"),

      body("estado_conservacao")
        .isString()
        .withMessage("O estado de conservação é obrigatório!")
        .isLength({ min: 4, max: 50 })
        .withMessage(
          "O estado de conservação precisa ter entre 4 e 50 caracteres!"
        ),
    ];
  };
}
