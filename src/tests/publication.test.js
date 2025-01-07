import { test, after, beforeEach, describe, before } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../server.js';
import Publication from '../models/publicationModel.js';
import { mongod } from '../server.js';

// Envuelve la app (Express) en la función supertest generando un "superagente"
const api = supertest(app);

const initialPublications = [
    {
        "usuario": "65b2aec262e19efa29bc3b1c",
        "titulo": "Viaje de validación",
        "contenido": "Información para ser validada.",
        "ubicacion": "EUROPE",
        "categoria": "RELAX",
        "imagenes": [
            "https://ssl.gstatic.com/onebox/weather/64/cloudy.png",
            "https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png"
        ]
    },
    {
        "usuario": "65b2aec262e19efa29bc3b1c",
        "titulo": "Publicación número dos",
        "contenido": "También se tiene que validar.",
        "ubicacion": "ASIA",
        "categoria": "CITY",
        "imagenes": [
            "https://ssl.gstatic.com/onebox/weather/64/sunny_t_cloudy.png",
            "https://ssl.gstatic.com/onebox/weather/64/sunny_s_cloudy.png",
            "https://ssl.gstatic.com/onebox/weather/64/sunny.png"
        ]

    }
];

// Usuario de la primera publicación inicial para pruebas
const usuario = initialPublications[0].usuario;

// Función auxiliar para devolver todas las publicaciones
const publicationsInDB = async () => {
    const response = await api.get('/api/v1/testPublication');
    return response.body.data;
};



describe('Publication tests - with refreshed data for each test', () => {

    beforeEach(async () => {
        await Publication.deleteMany({});
        await Publication.insertMany(initialPublications);
    });

    test('publications are returned as JSON', async ()=> {
        await api
            .get('/api/v1/testPublication')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test(`there are ${initialPublications.length} initial publications (all returned)`, async () => {
        const publications = await publicationsInDB();
        
        assert.strictEqual(publications.length, initialPublications.length);
    });

    describe('Recovering publications...', () => {
        test(`the first publication's category is ${initialPublications[0].categoria}`, async () => {
            const publications = await publicationsInDB();
        
            const categories = publications.map(p => p.categoria);
            assert(categories.includes(initialPublications[0].categoria));
        });
        
        test(`the user ${usuario} has ${initialPublications.filter((p) => p.usuario === usuario).length} publications`, async () => {
            
            const response = await api.get('/api/v1/publications/user/' + usuario);
            const userPublications = response.body.data;
        
            const contents = userPublications.map( p => p.contenido);
        
            assert.strictEqual(initialPublications.filter(p => p.usuario === usuario).length, userPublications.length);
        
            assert(contents.includes(initialPublications[0].contenido));
        
        });
    });

    describe('Creating publications...', () => {
        test('a valid publication can be added', async () => {
            const newPublication = {
                "usuario": "65b2aec262e19efa29bc3b1a",
                "titulo": "Nueva Publicación",
                "contenido": "Cambiamos de contienente. Nos vamos a Australia.",
                "ubicacion": "OCEANIA",
                "categoria": "RELAX",
                "imagenes": [
                    "https://ssl.gstatic.com/onebox/weather/64/cloudy_s_sunny.png"
                ]
            }
        
            await api
                .post('/api/v1/publications')
                .send(newPublication)
                .expect(201)
                .expect('Content-Type', /application\/json/);
        
            const publications = await publicationsInDB();
            
            const contents = publications.map(p => p.contenido);
        
            assert.strictEqual(publications.length, initialPublications.length + 1);
        
            assert(contents.includes("Cambiamos de contienente. Nos vamos a Australia."));
        });
        
        
        test('an added publication can be accessed by its generated id', async () => {
            const newPublication = {
                "usuario": "65b2aec262e19efa29bc3b1a",
                "titulo": "Nueva Publicación",
                "contenido": "Cambiamos de contienente. Nos vamos a Australia.",
                "ubicacion": "OCEANIA",
                "categoria": "RELAX",
                "imagenes": [
                    "https://ssl.gstatic.com/onebox/weather/64/cloudy_s_sunny.png"
                ]
            }
        
            await api
                .post('/api/v1/publications')
                .send(newPublication)
                .expect(201)
                .expect('Content-Type', /application\/json/);
        
            const publications = await publicationsInDB();
            
            const thisPublication = publications.filter(p => 
                p.usuario === newPublication.usuario 
                && p.titulo === newPublication.titulo
                && p.contenido === newPublication.contenido
                && p.ubicacion === newPublication.ubicacion
                && p.categoria === newPublication.categoria
                && p.imagenes.length === newPublication.imagenes.length
            );
        
            assert.strictEqual(thisPublication.length, 1);
        
            const generatedId = thisPublication[0].id;
        
            await api
                .get('/api/v1/publications/'+ generatedId)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        });
        
        
        test('empty publication is not added', async () => {
            const newPublication = {}
        
            await api
                .post('/api/v1/publications')
                .send(newPublication)
                .expect(400)
        
            const publications = await publicationsInDB();
        
            assert.strictEqual(publications.length, initialPublications.length);
        });
    });

    describe('Deleting publications...', () => {
        test('a publication can be deleted', async () => {
            const publicationsAtStart = await publicationsInDB();
        
            const publicationToDelete = publicationsAtStart[0];
        
            await api
                .delete(`/api/v1/publications/${publicationToDelete.id}`)
                .expect(204)
            
            const publicationsAtEnd = await publicationsInDB();
        
            const contents = publicationsAtEnd.map(p => p.contenido);
            assert(!contents.includes(publicationToDelete.contenido));
        
            assert.strictEqual(publicationsAtEnd.length, initialPublications.length - 1);
            
        });
    });

});



// Cierra la conexión DESPUÉS de ejecutar todos los test
after(async () => {
    if(mongoose.connection.readyState !== 0){ 
        await mongoose.connection.close();
    }
    if(mongod) await mongod.stop();
});