import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../server.js';
import Comment from '../models/commentModel.js'; // IMPORTANTE: ESQUEMA DE COMMENT

// Envuelve la app (Express) en la función supertest generando un "superagente"
const api = supertest(app);

// Tenemos una LISTA (elemento entre [] ) de 
//              elementos de tipo objeto JSON (elemento entre {} )

// Te dejo uno de muestra:
const initialComments = [
    {
        "publicacion_id" : "6740858db0f666cc0d25f89e",
        "usuario_id" : "65b2aec262e19efa29bc3b1a",
        "contenido_comentario" : "Este comentario es una prueba"
    },

    // Si quieres añadir más ejemplos, utiliza el modelo a continuación:
/*
    {
        "publicacion_id" : "",
        "usuario_id" : "",
        "contenido_comentario" : ""
    },

*/
];

// TODO: Recuperar la clave del usuario de initComments para usarla más adelante
// Usuario de la primera publicación inicial para pruebas
 const usuario = initialComments [0].usuario_id;

// TODO: 1) Quitar SOLO los comentarios multilínea de /* y */
//       2) Rellenar la ruta test para obtener todos los comentarios en nuestra DB
// Función auxiliar para devolver todas las publicaciones
const commentsInDB = async () => {
    const response = await api.get('/api/testcomments');
    return response.body.data;
    //NOTA: Cuando hacemos un api.get, obtenemos un objeto (también JSON)
    //      Esta "respuesta" tiene un campo "body" : cuerpo del mensaje
    //      De ahí necesitamos los "datos"
    //      Lo detallo aquí porque muchos de los errores que puedes encontrarte
    //      pueda deberse a se nos olvide hacer esto más adelante
    //      TIP: console.log(response) cuando algo no cuadre.

};

describe('Nombre del paquete de tests', () => {
    // A partir de aquí, todos los métodos son "ASÍNCRONOS"
    // Esto es que javascript esperará a que se ejecuten los comandos línea a línea
    // cuando veamos 'async ()' tendremos una función asíncrona
    // cuando veamos 'await' recibiremos respuesta de una función asíncrona
    // Hay que tener especial cuidado pues suele ser el origen de todos los errores
    beforeEach(async () => {
        // Borra todos los comentarios de la base de datos
        await Comment.deleteMany({});
        // Inserta todos los comentarios de initialComments en la base de datos
        await Comment.insertMany(initialComments);
    });

    test('comments are returned as JSON', async () => {
        // Este es muy sencillo, fíjate cómo está hecho en los otros
        // TODO: Obtener los comentarios de la ruta de test
        await api
            .get('/api/testcomments')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    // Creamos un "sub-paquete" de pruebas. Es meramente organizativo.
    describe('Creating comments...', () => {
        test('a valid comment can be added', async () => {
            const newComment = 
                {
                    "publicacion_id" : "65b2aec262e19efa29bc3b1c",
                    "usuario_id" : "65b2aec262e19efa29bc3b1a",
                    "contenido_comentario" : "Esto es un comentario creado"
                };
            
                // TODO: crear un nuevo objeto de tipo comentario
            

            //TODO: 1) Quitar los comentarios multilínea /* y */
            //      2) Hacer petición POST de comentario, para ello:
            //      2.1 ) rellenar la ruta pertinente
            //      2.2 ) rellenar objeto que será enviado
            //      2.3 ) rellenar código esperado

            await api
                .post('/api/comments')
                .send(newComment)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            
            // Esta parte del código NO va a funcionar. Averigua por qué.
            // TODO: Añadir algo que falta en la línea a continuación
            const comments = await commentsInDB();


            // Esta función devuelve un mapeo, esto es, una función
            // que transforma los elementos de una lista (todos los comentarios)
            // y les cambia el valor (en este caso, cambia una lista de objetos
            //  de tipo comentario, a una lista de string con el "contenido_comentario"
            //  de cada uno de los objetos comentario)
            const contents = comments.map(c => c.contenido_comentario);

            // Las funciones "asssert" son las funciones de test que comprueban
            // en este caso que dos valores sean estrictamente iguales.
            // Para este ejercicio, vamos a mirar que efectivmente se ha añadido
            // un comentario nuevo, de forma que comments (la lista de comentarios
            // recuperada de la base de datos) tenga el mismo número de elementos que
            // la lista de comentarios inciales + 1 (el nuevo añadido)
            assert.strictEqual(comments.length, initialComments.length + 1);


            // La siguiente función assert comprueba que el texto de contenido_comentario
            // en newComment, se encuentra entre todos los contenido_comentario que se
            // han leído de la base de datos
            // TODO: Cambiar la cadena de texto abajo por la que coincida en newComment
            assert(contents.includes("Esto es un comentario creado"));
        });
    });

    // TODO: Hacer un sub-paquete describe y una función test de DELETE

    describe('Deleting commentes...', () => {
            test('a comment can be deleted', async () => {
                // Toma todo lo que hay en la base de datos y lo copia
                // en la variable commentsAtStart  
                const commentsAtStart = await commentsInDB();
            
                const commentToDelete = commentsAtStart[0];
            
                await api
                    .delete(`/api/comments/${commentToDelete.id}`)
                    .expect(204)
                
                const commentsAtEnd = await commentsInDB();
            
                const contents = commentsAtEnd.map(c => c.contenido_comentario);
                assert(!contents.includes(commentToDelete.contenido_comentario));
            
                assert.strictEqual(commentsAtEnd.length, initialComments.length - 1);
                
            });
        });

});

// Cierra la conexión DESPUÉS de ejecutar todos los test
after(async () => {
    await mongoose.connection.close();
});


