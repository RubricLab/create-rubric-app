# Create Rubric App

This project is bootstrapped with [`create-rubric-app`](https://github.com/RubricLab/create-rubric-app).

## Getting Started

### Option 1: Docker (recommended)

The easiest way to run the full stack (app + Postgres + Redis):

```sh
# Create a .env file with your API keys
cp .env.example .env

# Start all services
docker compose up
```

Open [localhost:3000](http://localhost:3000) in your browser.

### Option 2: Local development

#### 1. Install dependencies

```sh
bun i
```

#### 2. Set up environment

Create a `.env` file with:

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
PUBLIC_AUTH_URL=http://localhost:3000
```

#### 3. Start Postgres & Redis

```sh
docker compose up postgres redis
```

#### 4. Run the development server

```sh
bun dev
```

Open [localhost:3000](http://localhost:3000) in your browser.

## Deployment

To serve your app to users, deploy to any container platform using the provided Docker setup.

## Learn More

To learn more about this project, take a look at this [blog post](https://rubriclabs.com/blog/create-rubric-app).
