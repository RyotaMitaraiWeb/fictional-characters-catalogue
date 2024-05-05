# Fictional Characters Catalogue
A web application which catalogues fictional characters from all sorts of movies, books, games, and others.

## How to run
The easiest way to run the application is via the ``docker-compose.dev.yml`` file. Everything, including environments, has been configured so that the app can be run right out of the box.

The backend currently does not support hot reload in Docker due to slowness in compilation and a few other issues caused by bind mounts (such as the Prisma generation looking into the wrong ``node_modules`` folder). In case you want to work on something on the backend, you will need to run it locally and run the other services.

## License
MIT