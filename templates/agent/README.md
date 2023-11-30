# Create Rubric App

This project is bootstrapped with [`create-rubric-app`](https://github.com/RubricLab/create-rubric-app).

## Getting Started

### 1. Install dependencies

```sh
npm i
```

```sh
bun i
```

### 2. Set up the DB

```sh
npm run db:dev:push
```

```sh
bun db:dev:push
```

### 3. Run the development server

```sh
npm run dev
```

```sh
bun dev
```

Open [localhost:3000](http://localhost:3000) in your browser to see the result.

You can start modifying the UI by editing [src/app/page.tsx](./src/app/page.tsx). The page auto-updates as you edit the file.

### Deployment

To serve your app to users, simply deploy the Next.js app eg. on [Railway](https://railway.app/new) or [Vercel](https://deploy.new/).

In the project config, append the prod Prisma script to your build script.

```sh
npm run build && npm run db:push
```

```sh
bun run build && bun db:push
```

To persist data, you'll need a database. Both [Railway](https://docs.railway.app/databases/postgresql) and [Vercel](https://vercel.com/docs/storage/vercel-postgres) provide Postgres DBs. You'll simply need the `DATABASE_URL` and `DATABASE_URL_NON_POOLING` for running migrations.

## Learn More

To learn more about this project, take a look at this [blog post](https://rubriclabs.com/blog/cra).
