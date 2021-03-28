# SlideCards
Um site feito em React para o desafio da SlideWorks.
O site consiste em um formulário para adiconar novos Cards em uma lista do Trello.

Disponível em https://slidecards.vercel.app
Lista em que o formulário adiciona novos cards: https://trello.com/b/XWaXCkAj/slidecards

### Informações

Como na descrição do desafio só havia um protótipo, tomei a liberdade de simular um funcionamento real para ele:

O formulário simula o cadastro de um novo projeto informando nome/e-mail de quem criou, as TAGS relacionadas com esse projeto, o progresso atual do projeto *( dividido em Iniciado, Produzido e Revizado )*, a descrição e o status *( divido em Planejamento, Produção e Finalizado )*

Também simulando um formulário real e preenchendo o pedido *Máscara e validação dos campos*, os campos obrigatórios são:
> Nome

> E-mail ( Com validação de formato usando Regex )

> Status
### Capturas de Tela
**DESKTOP** |  **Mobile**
--- | ---
![Computador](https://i.imgur.com/VyZXCUB.png) | ![Computador](https://i.imgur.com/LNkVPpj.png) 

### Modo de uso

Caso queira clonar o repositório, há algumas variáveis de ambiente que precisam ser configuradas.
> A **KEY** e **TOKEN** da API do Trello, que podem ser adquiridas nesse [site](https://trello.com/app-key).

> O **ID** da lista em que deseja adicionar novos cards. Para isso é só acessar a sua lista pelo Trello normal e colocar um `.json` no final da URL. O primeiro campo será o **ID**.

Dentro do arquivo `.env` deve estar desta forma:
```
REACT_APP_KEY=
REACT_APP_TOKEN= 
REACT_APP_ID = 
```



