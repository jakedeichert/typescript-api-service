# TypeScript Services Monorepo

This is a monorepo structure I've developed for working with typescript services. An example api service is included, along with some helper packages and middleware.


![console screenshot](https://user-images.githubusercontent.com/1631044/69171010-18dc0c80-0ac9-11ea-8071-9ede1e69c2cf.png)




## Requirements

There's a few system dependencies used that you'll need to install in order to work with this monorepo effectively.

**mask** · [repo](https://github.com/jakedeichert/mask)

This is a cli task runner tool I created, similar to `make`. It looks for a [`maskfile.md`](./maskfile.md) file in the current directory and parses it for commands. For example, if you run `mask bootstrap` in this directory, all packages and services will be installed, built and ready to use. To install `mask`, follow the [instructions here](https://github.com/jakedeichert/mask#installation).

**docker**

This is used to spin up a database and other background services.





## Getting started

Read the root [`maskfile.md`](./maskfile.md) to get familiar with some of the monorepo's top level commands. The api service also has its own [`maskfile.md`](./api-service/maskfile.md) which contains commands specific to itself.

### Preparation

Run `mask bootstrap`. This will install and build all packages and services so that they are ready for use. If you're working on a package, you should run `mask build -w` so it auto rebuilds on file change.

### Running the services

You can either run the entire stack with docker or just the database container with individual services locally.

To start the entire stack, simply run `mask start`.

If you want to run the api service locally instead, start the database with `mask start -cb` first and then `cd ./api-service && mask dev`. See the [`README.md`](./api-service/README.md) for more details.





## Directory overview

**/api-service**

This is a basic typescript api service example. Check out its [`README.md`](./api-service/README.md) for an overview of the structure and how it works.

**/docker**

This directory contains the `docker-compose` setup which boots up a postgres database and api service containers. The container names are currently prefixed with `project_` but you should do a global replacement to change that prefix to whatever your project's name is.

**/packages**

This directory contains common modules shared between services. When running `mask install` in the repo root, these directories are hoisted into `node_modules/@/<package-name>` where they become available to all services due to node's module resolution algorithm. These modules never need to be published since projects in this monorepo can just reference them via the `@` namespace.

**/tools**

This directory contains global tools shared between all projects. Tools include `eslint`, `prettier`, `typescript`, `jest` and more. When you run `mask install`, these tools are hoisted to the root `node_modules` directory so they become available to all projects.





## FAQ

### Why use the `@` namespace for packages?

The namespace `@` was purposefully chosen because npm disallows it. This guarantees we don't overwrite other installed modules by accident when we symlink the `packages` directory to `node_modules/@`. It's also nice and short to type when importing one of these packages.

### Why not use `lerna` to manage the monorepo instead?

In the past, I've found `lerna` to be bloated, slow, error-prone and overly complicated. Since we don't need to publish packages, scripting the installation and build processes for all packages in the [`maskfile.md`](./maskfile.md) was very simple. Also, due to node's module resolution algorithm, we don't need to link all packages together as they're all readily available in the top level `node_modules/@` namespace.

### Why `mask` instead of `make`?

You can read a bit about my inspiration for creating `mask` [here](https://github.com/jakedeichert/mask#where-did-the-inspiration-come-from). I've started using `mask` as a task runner in all my projects as well as a global utility cli for various commands and scripts I run.
