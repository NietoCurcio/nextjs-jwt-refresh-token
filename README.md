# Next.js autenticação - JWT e Refresh token

> Projeto estudado durante o Ignite da Rocketseat no módulo de autenticação e autorização

## Authentication Context

No contexto de autenticação é armazenado o usuário e a informação se ele está autenticado, as informações do usuário são o e-mail, as permissões e funções desse usuário, uma vez que esteja autenticado, essas informações são utilizadas para verificar a autorização desse usuário (RBAC). Os dados do usuário são adquiridos a partir dos cookies no browser, é possível armazenar dados no navegador através de sessionStorage, localStorage e cookies.

- sessionStorage: os dados são armazenados até o usuário fechar o browser
- localStorage: os dados são armazenados mesmo se o usuário fechar o browser
- cookies: os dados são mantidos assim como no localStorage e os cookies podem ser acessados server-side

### JSON Web Token

JWT é "stateless", ou seja o token não é mantido pelo servidor, o back-end apenas assina o token ao enviar para o cliente, e usa a sua assinatura secreta para verificar se o token é válido.

### Refresh token

O refresh token é mantido pelo back-end. Ao expirar um JWT, é feito uma requisição enviando o refresh token para que o back-end use essa informação para verificar se o refresh token é válido e gerar um novo JWT e um novo refresh token para o cliente. Dessa forma o tempo de expiração de um JWT pode ser mais curto
pois é feita uma constante revalidação desse token conforme ele é expirado.

#### Interceptors

Com o uso de interceptors é possível anexar extra lógica antes ou depois de uma requisição. Como é feito o uso do refresh token para revalidar o token do cliente, quando o servidor envia como resposta um status de 401 (Unauthorized) junto da informação que o token está expirado, o client-side intercepta as requisições que gerou esse erro, atualiza o token que está sendo enviado nos headers de cada uma dessas requisições e realiza novamente a requisição com o novo token. É possível ver essa lógica no arquivo "api.ts" dentro da pasta "services".
