# Fictional Characters Catalogue (backend)

## How to run locally
You need an ``.env`` file in the root of the project that looks like this:
```bash
DATABASE_URL=postgresql://postgres:admin@localhost/characters?schema=public&connect_timeout=30&pool_timeout=30&socket_timeout=30
```

The ``DATABASE_URL`` variable assumes that the database is running through the provided ``docker-compose`` file in the parent directory.

When running in Docker, an ``.env`` file will be automatically created from ``sample.env``, in which case you don't have to do anything.

Once you have a database running and the ``.env`` file was created, you need to generate your Prisma client, as well as apply the migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

When running in Docker, all of this is done for you automatically.

If all is good, then you can start the development server:

```bash
npm run start:dev

# or

npm run start:debug
```

## How to run tests
```bash
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## License
MIT