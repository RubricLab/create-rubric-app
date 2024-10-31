# Create Rubric App

Welcome to **Create Rubric App**, a CLI tool designed to streamline the creation and deployment of Rubric applications. This tool helps you scaffold new projects, configure API keys, select features, and automate deployment tasks with ease.

## Table of Contents

- Features
- Prerequisites
- Installation
- Usage
  - Help Command
  - Configuration
  - Initializing a New App
  - Available Features
- Commands Overview
- Configuration File (`cra.config.ts`)
- Code Generation
- Examples
- Contributing
- License

## Features

- Interactive CLI to set up API keys and default settings.
- Scaffold new Rubric projects with selected features.
- Modular code generation using `@rubriclab/codegen`.
- Automate database provisioning and deployment.
- Supports additional features like agents and authentication.

## Prerequisites

- Node.js (v14 or higher)
- Bun JavaScript runtime (if you prefer Bun over npm)
- Git (for initializing repositories)
- Accounts and API keys for:
  - Upstash
  - Vercel
  - Neon
  - Resend

## Installation

You can install **Create Rubric App** globally using npm:

```bash
npm install -g create-rubric-app
```

Alternatively, if using Bun:

```bash
bun install -g create-rubric-app
```

## Usage

Once installed, you can access the CLI using the `create-rubric-app` command.

### Help Command

To view all available commands and options:

```bash
create-rubric-app --help
```

This will display detailed information about each command.

### Configuration

Before initializing a new app, it's recommended to set up your configuration using the `config` command.

```bash
create-rubric-app config
```

This command will guide you through entering your API keys and default settings, such as enabling automatic deployment and database provisioning.

**Example:**

```bash
$ create-rubric-app config
Enter your Upstash API key: *****
Enter your Vercel API key: *****
Enter your Neon API key: *****
Enter your Resend API key: *****
Enable automatic deployment? (Y/n): Y
Enable automatic database provisioning? (Y/n): Y
Configuration saved to cra.config.ts
Added cra.config.ts to .gitignore
```

### Initializing a New App

To create a new Rubric application:

```bash
create-rubric-app init
```

You'll be prompted to provide a project name and select features to include in your app.

**Example:**

```bash
$ create-rubric-app init
Project name: my-rubric-app
Select features to include:
 [ ] Agent
 [ ] Auth
 > (Press <space> to select, <enter> to confirm)
```

### Available Features

- **Agent**: Adds agent capabilities to your app, including memory management and UI generation.
- **Auth**: Integrates authentication mechanisms into your app.

## Commands Overview

- `create-rubric-app config`: Configure your API keys and default settings.

- `create-rubric-app init`: Initialize a new Rubric project.

  - Options:
    - `-n, --name <name>`: Specify the project name.
    - `-y, --yes`: Use default options without prompts.

- `create-rubric-app --help`: Display help information.

## Configuration File (`cra.config.ts`)

After running the `config` command, a `cra.config.ts` file will be created in your project root. This file contains your API keys and default settings.

**Example `cra.config.ts`:**

```typescript
// cra.config.ts
const config = {
  upstashApiKey: 'your-upstash-api-key',
  vercelApiKey: 'your-vercel-api-key',
  neonApiKey: 'your-neon-api-key',
  resendApiKey: 'your-resend-api-key',
  deploy: true,
  provisionDB: true,
};

export default config;
```

**Security Note:** `cra.config.ts` is automatically added to `.gitignore` to prevent sensitive information from being committed to version control.

## Code Generation

The CLI uses `@rubriclab/codegen` to generate code based on the features you select. This ensures that only the necessary code is included in your project, keeping it clean and modular.

### How Code Generation Works

- **Agent Feature**: Generates agent-related code, including memory management and UI components.
- **Auth Feature**: Generates authentication code and integrates it into your app.

The code generation process watches specific directories for files and generates corresponding modules.

## Examples

### Creating a New App with Default Settings

```bash
create-rubric-app init -n my-app -y
```

This command initializes a new app named `my-app` using default options.

### Creating a New App with Selected Features

```bash
create-rubric-app init
```

Follow the prompts to select features:

- Project name: `awesome-agent`
- Select features:
  - [✔] Agent
  - [ ] Auth

### Configuring Your API Keys

```bash
create-rubric-app config
```

Enter your API keys when prompted. These will be saved to `cra.config.ts`.

## Contributing

We welcome contributions! If you'd like to contribute to **Create Rubric App**, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Open a pull request detailing your changes.

Please ensure that your code adheres to the project's coding standards and passes all tests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Happy Hacking!**

If you have any questions or need assistance, feel free to open an issue on the repository or reach out to the maintainers.
