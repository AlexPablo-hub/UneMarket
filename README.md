# 📱 UneMarket

**UneMarket** é um aplicativo mobile desenvolvido com **React Native** e **Expo** que facilita a compra e venda de produtos entre universitários e a comunidade local. Utiliza **Supabase** como backend para autenticação e gerenciamento de dados.

---

## 🔍 Visão Geral

- Cadastro e login de usuários com autenticação segura
- Publicação e edição de produtos com imagem, nome, preço e descrição
- Busca de produtos e visualização de detalhes
- Contato direto com o vendedor via **WhatsApp**

---

## 🗂️ Estrutura do Projeto

```
├── App.js                             # Componente principal
├── index.js                           # Ponto de entrada
├── src/
│   ├── components/                    # Componentes reutilizáveis
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── ProductCard.js
│   ├── navigation/                    # Navegação principal
│   │   └── AppNavigator.js
│   ├── screens/                       # Telas do aplicativo
│   │   ├── AddProductScreen.js
│   │   ├── EditProductScreen.js
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── RegisterScreen.js
│   │   └── UserProductsScreen.js
│   ├── services/                      # Serviços e APIs
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── storage.js
│   │   └── supabase.js
│   └── utils/
│       └── validators.js
```

---

## 🚀 Funcionalidades

### 🔐 Autenticação
- Registro com nome, e-mail, senha, CPF e telefone
- Login e logout
- Proteção de rotas

### 🛒 Gerenciamento de Produtos
- Listagem, busca, criação, edição e exclusão de produtos
- Upload de imagem, definição de preço e descrição

### 💬 Comunicação
- Contato via WhatsApp com o vendedor
- Visualização de informações de contato

---

## 🧰 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Supabase](https://supabase.com/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

---

## ⚙️ Como Executar

### Pré-requisitos

- Node.js
- NPM ou Yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go (app mobile) ou emulador Android/iOS

### Instruções

```bash
# 1. Clone o repositório
git clone https://github.com/AlexPablo-hub/UneMarket.git

# 2. Acesse a pasta do projeto
cd UneMarket

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Inicie o servidor de desenvolvimento
npm start
# ou
yarn start
```

Escaneie o QR code com o app **Expo Go** (Android) ou a câmera (iOS).

---

## 🧭 Como Usar o Aplicativo

### ▶️ Registro e Login
- Tela inicial com login
- Registro com campos obrigatórios
- Redirecionamento automático após login

### 🏠 Tela Principal
- Lista de produtos com busca por nome
- Botão flutuante para adicionar produto
- Acesso aos seus produtos anunciados

### 📦 Detalhes do Produto
- Exibe imagem, nome, preço e descrição
- Botão de contato via WhatsApp

### ➕ Adicionar Produto
- Imagem obrigatória
- Preenchimento de nome, preço e descrição

### 🛠️ Meus Produtos
- Edição e exclusão de produtos do usuário

---

## 🔒 Segurança

- Autenticação segura via Supabase
- Senhas criptografadas
- Apenas o dono pode editar/excluir seus produtos

---


## 👨‍💻 Desenvolvedor

Este projeto foi desenvolvido por **Alex Pablo de Oliveira Moraes**, estudante de **Sistemas de Informação** na **UNEMAT**.

- 🔗 GitHub: [github.com/AlexPablo-hub](https://github.com/AlexPablo-hub)
- 📧 Entre em contato se tiver dúvidas ou sugestões!
