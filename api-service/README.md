# TypeScript API Service Example

This is a basic typescript api service with an example health controller included.





## Getting started

This service uses `mask` as a task runner, instead of npm scripts. Listed below are some of the common commands you'll run.

> All commands assume that you've already ran `mask bootstrap` in the root of this repo which prepares all packages for use. If you're running this service outside of docker, you need to run `mask start -cb` in the root as well.

**`mask dev`**: This starts the service in development mode with file watching enabled for auto rebuilds.

**`mask start`**: If you're not actively developing this service and just want it to run, this is the command to do so.

**`mask test`**: This runs the `jest` test suites. Run `mask test -w` to start `jest` in watch mode.

**`mask format`**: Formats all files with `prettier`.

**`mask lint`**: Lints all files with `eslint`.

**`mask create migration (name)`**: This makes it easy to create a new `knex` migration file inside `migrations/`.





## Directory overview

**/config**

These are environment variable config files for local development and testing. When starting the service or running tests, the appropriate config file is copied to a `.env` file which is then injected into the shell environment.

On first run, you'll also notice a gitignored file `config/env.overrides`. This file is where you would put custom values specific to your local environment.

**/docker**

This directory contains the `docker-compose` setup which boots up a postgres database container.

**/migrations**

These are `knex` migrations that run during the service's bootup phase before accepting http connections. If a migration fails to run, the service will exit with an error.

**/src**

This contains the main typescript source for the service. An example `health` controller is included along with an integration test.

`index.ts`: This is the service's bootup process. You probably will not need to touch anything in here.

`config.ts`: This is where you'll add new environment variables. The goal here is that all variables are validated during bootup time so we know immediately that all config is correct before starting the service.

`db.ts`: This is in charge of booting up the database connection and running all migrations. If the database fails to connect, the service will exit with an error.

`server.ts`: This is where you'll add new controllers and middleware to the server. An example `health` controller is included along with some helpful middleware. `packages/http-utils` contains most of the server setup logic.

`health/`: This is an example health status controller. I've decided to use the *feature folder* strategy rather than organizing by concern. If I were to add account handling for example, I would likely store it all under an `account/` directory.

**/test**

This contains test utils. For each test suite, a new test server is started on a random available port. A database transaction is created per test case and rolled back so that no queries affect other tests.

Take a look at the [health controller test](./src/health/test/controller.test.ts) to see an example of how easy it is to spin up a test server.

**/typings**

This contains useful global types and type overrides for third party packages.
