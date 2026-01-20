# Certin — Plataforma Acadêmica de Certificados

O **Certin** é uma plataforma web desenvolvida como projeto acadêmico com o objetivo de permitir que estudantes e professores gerenciem perfis acadêmicos, certificados, projetos e oportunidades de forma centralizada e segura.

O sistema foi desenvolvido seguindo a arquitetura **frontend + backend separados**, com autenticação via token JWT e integração completa entre as camadas.

---

## 🔗 Acesso ao sistema

- **Frontend (Vercel):**  
  https://front-end-certin-app.vercel.app

- **Backend / API (Render):**  
  https://certin-backend-unmy.onrender.com

- **Documentação da API (Swagger):**  
  https://certin-backend-unmy.onrender.com/docs

---

## Como acessar o site

1. Acesse o link do frontend.
2. Caso ainda não tenha uma conta, clique em **“Sou novo e quero criar conta”**.
3. Preencha os dados solicitados e finalize o cadastro.
4. Após o cadastro, faça login com e-mail e senha. (Evite nesse primeiro teste, colocar email real pois ainda está em desenvolvimento)
5. Ao entrar, o usuário passa a ter acesso às áreas protegidas do sistema, como:
   - Perfil acadêmico
   - Certificados
   - Visualização de outros usuários
   - Projetos e bolsas (quando aplicável)

## Autenticação e segurança

O sistema utiliza **autenticação baseada em JWT (JSON Web Token)**.

- As senhas são **criptografadas com bcrypt** antes de serem armazenadas no banco de dados.
- No login, o backend valida as credenciais e gera um token JWT.
- Esse token é armazenado no navegador (localStorage).
- Todas as rotas protegidas exigem o envio do token no cabeçalho da requisição.
- O backend valida o token antes de permitir o acesso às informações.

---

##  Como o sistema foi desenvolvido

### Backend
- **FastAPI**
- **SQLAlchemy**
- **Pydantic**
- **JWT (python-jose)**
- **Passlib + bcrypt**
- **SQLite (ambiente de desenvolvimento)**
- Deploy realizado no **Render**

O backend é responsável por:
- Cadastro e autenticação de usuários
- Gerenciamento de certificados
- Controle de acesso por autenticação
- Disponibilização de dados via API REST

---

### Frontend
- **React**
- **Vite**
- **JavaScript**
- **CSS**
- Deploy realizado no **Vercel**
