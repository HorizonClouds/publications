# publications (micro-servicio ; backend)

---

## Project Structure
Layout del proyecto, las partes en azul son los ficheros añadidos/modificados de la plantilla.

```diff
.
├── src                          # Source code
│   ├── api
│   │   └── oas.yaml             # API documentation in OpenAPI format
│   ├── controllers 
│   │   └──@@ commentController.js @@
│   │   └── exampleController.js
│   │   └──@@ publicationController.js @@
│   │   └──@@ reactionController.js @@
│   ├── middlewares
│   ├── models
│   │   └──@@ commentModel.js @@     # Mongoose model (comentarios en publicación)
│   │   └── exampleModel.js      # Mongoose model (example provided)
│   │   └──@@ publicationModel.js @@ # Mongoose model (publicación)
│   │   └──@@ reactionModel.js @@    # Mongoose model (reacciones en general)
│   ├── requests
│   │   └──@@ comments.rest @@       # Peticiones REST (comentarios)
│   │   └──@@ publication.rest @@    # Peticiones REST (publicaciones)
│   │   └──@@ reactions.rest @@      # Peticiones REST (reacciones)
│   ├── routes
│   │   └──@@ commentRoute.js @@     # API route definitions
│   │   └── exampleRoute.js      # API route definitions
│   │   └──@@ publicationRoute.js @@ # API route definitions
│   │   └──@@ reactionRoute.js @@    # API route definitions
│   ├── services
│   │   └──@@ commentService.js @@
│   │   └── exampleModel.js
│   │   └──@@ publicationService.js @@
│   │   └──@@ reactionService.js @@
│   ├── test                     # Unit and integration tests
│   │   ├── example.test.js
│   │   └── setup.test.js
│   ├── utils
│   ├──@@ server.js @@               # Main server file
│   └── swagger.js               # Swagger setup for API documentation
├── Dockerfile                   # Docker configuration for containerization
├── LICENSE                      # License file
├── README.md                    # Documentation
├── nodemon.json                 # Nodemon configuration for auto-restarts
├── package.json                 # Project dependencies and scripts
└── projectstructurefoldersandfiles.md  # File detailing the folder structure
```

---

## API ENDPOINTS

### Publicaciones:

**`GET`**
- `/testPublication` :          Listar todas las publicaciones (pruebas)
- `/publications/:id` :         Recupera una publicación por su ID
- `/publications/user/:user` :  Lista las publicaciones de un usuario
**`POST`**
- `/publications` :             Crea una publicación
**`PUT`**
- `/publications/:id` :         Modifica una publicación
**`DELETE`**
- `/publications/:id` :         Borra una publiación

### Comentarios (sobre publicaciones):
**`GET`**
- `/testcomments` :             Listar todos los comentarios (pruebas)
- `/comments/:id` :             Recupera un comentario por su ID
- `/comments/user/:user` :      Lista todos comentarios de un usuario, buscados por la id de usuario (user)
- `/comments/publication/:publication` Lista todos los comentarios de una publicación, buscados por la id de publicación (publication)
**`POST`**
- `/comments` :                 Crea un comentario
**`PUT`**
- `/comments/:id` :             Modifica un comentario
**`DELETE`**
- `/comments/:id` :             Borra un comentario

### Reacciones (sobre publicaciones XOR comentario):
**`GET`**
- `/testReaction` :             Listar todas las reacciones (pruebas)
- `/comments/:id/reactions` :   Lista todas las reacciones sobre un comentario, buscados por el id de comentario (id)
- `/publications/:id/reactions`:Lista todas las reacciones sobre una publicación, buscados por el id de publicación (id)
- `/user/:id/unseen` :          Lista todas las reacciones de un usuario, por id de usuario (id) **que no han sido visualizadas aún** para así ser consumido por la API de notification
**`POST`**
- `/comments/:id/reaction` :    Crea una reacción sobre un comentario, o la borra en el caso que ya exista, a modo de trigger
- `/publications/:id/reaction`: Crea una reacción sobre una publicación, o la borra en el caso que ya exista, a modo de trigger
**`PUT`**
- `/read/reaction/:id` :        Marca una reacción como **vista**, cambiando su **fecha de modificación** para tener constancia de cuándo se vio


---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

By following these steps, you should have a functional Product Management microservice up and running. This example covers the setup for managing products, but you can use the same structure and process to build any other microservice for the HorizonClouds project or other MERN-based applications.