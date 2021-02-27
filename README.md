# The React + Express Template &middot; [![Version Badge](https://img.shields.io/badge/version-1.0.0-brightgreen)](#)

A React starter project with Express backend that works with [Docker](https://www.docker.com), [Docker Compose](https://docs.docker.com/compose),
and [Shipyard](https://shipyard.build) out of the box.

## Includes

- [React](https://github.com/facebook/react) - JavaScript library for building user interfaces
- [Material-UI](https://github.com/mui-org/material-ui) - React components for faster and simpler web development
- [Express](https://github.com/expressjs/express) - lightweight node.js web framework
- [nodemon](https://github.com/remy/nodemon) - auto-reload server on code changes
- [Sequelize](https://github.com/sequelize/sequelize) - cross-database ORM and migrations
- [PostgreSQL](https://www.postgresql.org) - database
- [LocalStack](https://github.com/localstack/localstack) - fully functional local AWS cloud stack

## Dependencies

- [Docker](https://www.docker.com) & [Docker Compose](https://docs.docker.com/compose) - to build and run the app
- [Make](https://www.gnu.org/software/make/manual/make.html) - to easily run commands needed for development

## Getting Started

- Run `make develop` at the root of this project.
- Visit the app at http://localhost:3000.
- Visit http://localhost:8080/api/v1/files to list objects in LocalStack s3 bucket.
- Make your code changes! The app will reload whenever you save.