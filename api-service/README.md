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






## Concepts

### Database Migrations

This service comes with a database migration setup powered by `knex`. When deploying a new version of this service, migrations run automatically before the service starts. If a migration happens to fail, the service will not start. This works really well with rolling deployment solutions like kubernetes where you would still have a healthy pod running and accepting traffic.

### Integration Test Setup

I’ve put a lot of thought into the test setup to make it as simple, fast and reliable as possible. For each test suite, a new test server is started on a random available port. A database transaction is created per test case and rolled back so that no queries affect other tests. Using `jest` as the test runner, test suites run extremely fast and in parallel. Jest’s watch mode makes writing new test suites or debugging broken test cases an absolute joy!

### Config Validation

Config loading is supported via .env files. Local, local docker and test config files all exist and load depending on which way you’re running the service. One of the most valuable things about this setup is that config is loaded and validated during service bootup and exits if any variable is missing or failed to pass validations such as type checking (e.g. a port number must be an actual number). This is especially helpful when adding new variables. If you forget to add the new variable to the production config, the service will fail fast and you'll find out immediately instead of finding out during runtime. This again pairs very nicely with kubernetes’ rolling deployments which won’t redirect traffic to a new service until it’s healthy.

### Request Body & Query Param Validation

All incoming request json bodies and query params are validated automatically to ensure they conform to your expected type definitions. If any property is the wrong type, the middleware automatically responds with a 400 Bad Request error. This allows controller logic to be much more terse because we can assume all fields are the type that we expect them to be.

### Request-based Transactions

Inside of every request you can reference a lazily-initialized database transaction anywhere in your chain of code. Right before the response is returned, the transaction is automatically either committed or rolled back depending on whether an error was thrown. You also have the ability to manually override this or create sub-transactions if need be.
