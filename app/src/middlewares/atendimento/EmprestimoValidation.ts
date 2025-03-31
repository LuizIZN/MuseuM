import { body, cookie } from "express-validator";

export default class EmprestimoValidation {
  public verificarPermissoes() {
    return [
      cookie("usuario").custom((usuario: any) => {
        if (!usuario.permissoes.includes("Gerenciar emprestimos")) {
          throw new Error("Usuário não possui permissão!");
        }
        return true;
      }),
    ];
  }

  public criarEmprestimoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("dataEmprestimo")
        .isString()
        .withMessage("A data de empréstimo é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

      body("dataDevolucao")
        .isString()
        .withMessage("A data de devolução é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

      body("codigo")
        .isString()
        .withMessage("O código é obrigatório!")
        .isLength({ max: 7 })
        .withMessage("O código precisa ter até 7 caracteres!"),
      
      body("visitanteId")
        .isInt()
        .withMessage("O id do visitante é obrigatório!"),

      body("itemId")
        .isInt()
        .withMessage("O id do item é obrigatório!"),
    ];
  };

  public editarEmprestimoValidacao = () => {
    return [
      this.verificarPermissoes(),

      body("dataEmprestimo")
        .isString()
        .withMessage("A data de empréstimo é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

      body("dataDevolucao")
        .isString()
        .withMessage("A data de devolução é obrigatória!")
        .custom((data: string) => {
          return /^\d{4}-\d{2}-\d{2}$/.test(data);
        })
        .withMessage("Insira uma data válida!"),

      body("codigo")
        .isString()
        .withMessage("O código é obrigatório!")
        .isLength({ max: 7 })
        .withMessage("O código precisa ter até 7 caracteres!"),
    ];
  }
}
