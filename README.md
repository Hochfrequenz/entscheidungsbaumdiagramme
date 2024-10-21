# EBD.HOCHFREQUENZ.DE

![Eslint status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Linting/badge.svg)
![Type-Checking status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Type-Checking/badge.svg)
![Prettier status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/Formatting/badge.svg)
![PlayWright status badge](https://github.com/Hochfrequenz/ebd.hochfrequenz.de/workflows/E2E-Testing/badge.svg)

### setting up development environment

make sure you have the latest version of [node](https://nodejs.org/en) installed (recommended via node version manager [nvm](https://github.com/nvm-sh/nvm)).

```sh
$ npm install
```

```sh
$ npm run start # starts local dev server (including hot reload)
$ npm run lint # lints the whole project (eslint)
$ npm run format # formats the whole project (prettier)
$ npm run test # runs E2E tests (playwright) assuming the dev server is up and running
```
