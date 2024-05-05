# Fictional Characters Catalogue (backend)

## How to run locally
```bash
npm run start:dev

# or

npm run start:debug
```

You need an ``.env`` file in the root of the project that looks like this:
```bash
DATABASE_URL=postgresql://postgres:admin@localhost/characters?schema=public&connect_timeout=30&pool_timeout=30&socket_timeout=30
```

The ``DATABASE_URL`` variable assumes that the database is running through the provided ``docker-compose`` file in the parent directory.

When running in Docker, an ``.env`` file will be automatically created from ``sample.env``, in which case you don't have to do anything.

## How to run tests
```bash
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## License
MIT