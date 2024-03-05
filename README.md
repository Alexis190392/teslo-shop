<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# TESLO API

1. Clonar el proyecto.
2. Instalar dependencias.
```
yarn install
```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```.
4. Cambiar las variables de entorno a medida.
5. Levantar la base de datos
```
docker-compose up -d
```
6. Lanzar
```
yarn start:dev
```

7. Ejecutar seed para popular la bd
```
localhost:3000/api/seed
```
8. Correr ws-client: ```https://github.com/Alexis190392/ws-client```

## Stack usado
* Postgres
* Nest
