# Package

A tool for scaffolding and publishing NPM packages quickly.

## Installation

### Global Installation

Run `bun add -g @rubriclab/package`.

### Per-project Installation

Ensure you have a `package.json`. If not, run `bun init`.

## Getting started

### Init a package

Run `bun add -d @rubriclab/package`. The postinstall script should run automatically. If not, run `bunx rubriclab-setuppackage`.

This will add a few resources to your package:

- a publish workflow
  - on push to main, the NPM package will be bumped and auto-published
- scripts
  - `lint`: checks for code issues
  - `format`: tries to fix code issues
  - `bleed`: updates all dependencies to `latest`
  - `clean`: clears node modules and cache
