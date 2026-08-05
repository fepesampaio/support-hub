# Support Hub

Crie uma aplicação web moderna e limpa de um sistema de "HelpDesk / Chamados de Suporte" com suporte a autenticação de usuários.

A aplicação deve conter:

1. Tela de Login / Cadastro:

   - Campos de E-mail e Senha, com alternância entre Login e "Criar Conta".

2. Dashboard Principal (protegido por login):

   - Cabeçalho exibindo o e-mail do usuário logado e um botão de "Sair" (Logout).

   - Um botão destacado "Novo Chamado".

3. Form/Modal de Criação de Chamado:

   - Campos: Título, Descrição, Categoria (Técnico, Financeiro, Geral) e Prioridade (Baixa, Média, Alta).

4. Lista de Chamados do Usuário:

   - Exibir os chamados cadastrados em formato de tabela ou cards.

   - Colunas: Título, Categoria, Prioridade, Status (Aberto, Em Atendimento, Resolvido) e Data de Criação.

   - Ações: Botão para alterar o status para "Resolvido" e botão para excluir o chamado.

5. Visual:

   - Design moderno, responsivo, utilizando Tailwind CSS com visual limpo de dashboard corporativo.

   - Apenas monte a estrutura da interface visual com estados de autenticação e lista vazia pronta para integrar com Supabase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/40042ad8-1e9a-4281-9f00-71cd819addb6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
