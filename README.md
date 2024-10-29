# EBD.HOCHFREQUENZ.DE

![Eslint status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Linting/badge.svg)
![Type-Checking status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Type-Checking/badge.svg)
![Prettier status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Formatting/badge.svg)
![PlayWright status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/E2E-Testing/badge.svg)

### Setting up development environment

Make sure you have the latest version of [node](https://nodejs.org/en) installed (recommended via node version manager [nvm](https://github.com/nvm-sh/nvm)).

```sh
$ npm install
```

```sh
$ npm run start # starts local dev server (including hot reload)
$ npm run lint # lints the whole project (eslint)
$ npm run format # formats the whole project (prettier)
$ npm run test # runs E2E tests (playwright) assuming the dev server is up and running
```

To serve the built site locally, run

```sh
$ npm run build && npx http-server ./build
```

This starts an HTTP server at http://127.0.0.1:8080, providing a local view roughly similar to how Azure will render the project.

### Auth0 authentication

> [!NOTE]
> During local development, authentication is currently not required. Instead, a dummy account `local@development.com` will be already logged in at both local dev server startup as well as build preview.

To get past the landing page when navigating through the staging environment `https://ebd.stage.hochfrequenz.de` and production environment `https://ebd.hochfrequenz.de`, users need to authenticate using their Hochfrequenz login credentials.
