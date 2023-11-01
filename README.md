WE ARE HACKING ON CREATE-RUBRIC-APP TODAY ON GATHER:

https://island.rubriclabs.com

# Create Rubric App CLI

CLI for initializing projects

## Usage

`npx create-rubric-app@latest`

## Advanced Usage

`npx create-rubric-app@latest --n my-cool-app --t fullstack`

`npx create-rubric-app@latest -y`

## Defining GPT model

In `src/agents/basic.ts`, you can update `gptModel` to "gpt-4" for more advanced usage. Currently, it's set to "gpt-3.5-turbo", to get a fast response.
