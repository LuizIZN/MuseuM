const { body, cookie } = require("express-validator");

export default class NoticiaValidation {
    private verificarPermissoes = () => {
        return cookie("usuario")
            .custom((usuario: any) => {
                if (usuario.permissoes.includes("Gerenciar noticias")) {
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
              if (!usuario.permissoes.includes("Consultar noticias")) {
                return false;
              }
    
              return true;
            })
            .withMessage("Usuário não possui permissão!"),
        ];
    };

    public criarNoticiaValidacao = () => {
        return [
          this.verificarPermissoes(),
    
          body("titulo")
            .isString()
            .withMessage("O titulo é obrigatório!")
            .isLength({ min: 4, max: 50 })
            .withMessage("O titulo precisa ter entre 6 e 50 caracteres!"),
    
          body("texto")
            .isString()
            .withMessage("O texto é obrigatório!")
            .isLength({ max: 500 })
                .withMessage("O texto precisa ter até 500 caracteres!"),
          
          body("palavrasChave")
            .isArray()
            .withMessage()
            .custom((palavras: any) => {
                if (!palavras.every((p: string) => typeof p === "string" && p.length <= 50)) {
                    throw new Error("Cada palavra-chave deve ser um texto com no máximo 50 caracteres!");
                }
                return true;
            }),
        
        ];
    };
    
    public editarNoticiaValidacao = () => {
      return [
        this.verificarPermissoes(),
  
        body("titulo")
          .isString()
          .withMessage("O titulo é obrigatório!")
          .isLength({ min: 4, max: 50 })
          .withMessage("O titulo precisa ter entre 6 e 50 caracteres!"),
  
        body("texto")
          .isString()
          .withMessage("O texto é obrigatório!")
          .isLength({ max: 500 })
              .withMessage("O texto precisa ter até 500 caracteres!"),
        
        body("palavrasChave")
          .isArray()
          .withMessage()
          .custom((palavras: any) => {
              if (!palavras.every((p: string) => typeof p === "string" && p.length <= 50)) {
                  throw new Error("Cada palavra-chave deve ser um texto com no máximo 50 caracteres!");
              }
              return true;}),
      
      ];
    };
    


    public excluirNoticiaValidacao = () => {
        return [
          this.verificarPermissoes(),
        ];
    };

}