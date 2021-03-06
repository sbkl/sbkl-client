# sbkl-client

Nuxt starter package

## Installation

### 1- Create a Nuxt project

```bash
npx create-nuxt-app [project-name]

//Package manager: Yarn
//UI Framework: None
//custom server framework: None
//Nuxt.js Modules: Axios, DotEnv
//linting tools: None at the moment
//test framework: None at the moment
//rendering mode: Universal
//development tools: jsconfig.json (Recommended for VS Code)
```

### 2- cd into your project folder

```bash
cd [project-name]
```

### 3- Install the package via yarn or npm:

```bash
yarn add -D node-sass sass-loader tailwindcss @tailwindcss/ui nuxt-purgecss
yarn add sbkl-client portal-vue @popperjs/core @nuxtjs/auth
```

`@nuxtjs/dotenv @nuxtjs/axios` are already installed via `create-nuxt-app`.

### 4- Setup files:

```bash
cp ./node_modules/sbkl-client/templates/config/nuxt.config.js .
cp ./node_modules/sbkl-client/templates/config/admin.config.js .
cp ./node_modules/sbkl-client/templates/config/tailwind.config.js .
cp ./node_modules/sbkl-client/templates/plugins/global.js ./plugins/global.js
cp ./node_modules/sbkl-client/templates/plugins/sbkl-client.js ./plugins/
mkdir ./plugins/mixins && cp ./node_modules/sbkl-client/templates/plugins/mixins/responsive.js ./plugins/mixins/
cp ./node_modules/sbkl-client/templates/store/admin.js ./store/
cp ./node_modules/sbkl-client/templates/store/validation.js ./store/
cp ./node_modules/sbkl-client/templates/store/index.js ./store/index.js
mkdir ./assets/sass && cp ./node_modules/sbkl-client/templates/assets/sass/tailwind.sass ./assets/sass/
mkdir ./assets/img && cp ./node_modules/sbkl-client/templates/assets/img/rstore_icon_gray_bg.png ./assets/img/
cp ./node_modules/sbkl-client/templates/layouts/admin.vue ./layouts/
cp ./node_modules/sbkl-client/templates/layouts/default.vue ./layouts/
cp ./node_modules/sbkl-client/templates/layouts/none.vue ./layouts/
cp ./node_modules/sbkl-client/templates/layouts/empty.vue ./layouts/
cp ./node_modules/sbkl-client/templates/middleware/authenticated.js ./middleware/
cp ./node_modules/sbkl-client/templates/middleware/authNotConfirmed.js ./middleware/
cp ./node_modules/sbkl-client/templates/middleware/guest.js ./middleware/
cp ./node_modules/sbkl-client/templates/pages/privacy.vue ./pages/
cp ./node_modules/sbkl-client/templates/pages/support.vue ./pages/
cp ./node_modules/sbkl-client/templates/pages/index.vue ./pages/
cp ./node_modules/sbkl-client/templates/.env.example ./.env
cp ./node_modules/sbkl-client/templates/static/favicon.ico ./static/
rm ./assets/README.md
rm ./components/README.md
rm ./layouts/README.md
rm ./middleware/README.md
rm ./pages/README.md
rm ./plugins/README.md
rm ./static/README.md
rm ./store/README.md
```

### 5- Setup .env

in .env: change APP_NAME, URL, and PASSPORT_SECRET. PASSPORT_CLIENT_ID is 2 by default.

### 6- Launch App

As soon as the api is ready, you can start launching the app:

```
yarn dev
```
