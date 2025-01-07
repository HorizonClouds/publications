import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../server.js';
import Reaction from '../models/reactionModel.js';

// Envuelve la app (Express) en la función supertest generando un "superagente"
const api = supertest(app);

const initialReactions = [
    {   "usuario": "65b2aec262e19efa29bc3b1a",
        "publicacion": "6740858db0f666cc0d25f89e",
        "reaccion": "LIKE"
    },
    {   "usuario": "65b2aec262e19efa29bc3b1a",
        "publicacion": "6740858db0f666cc0d25f89e",
        "reaccion": "LOVE"
    },
    {   "usuario": "65b2aec262e19efa29bc3b1a",
        "comentario": "6740858db0f666cc0d25f89c",
        "reaccion": "LIKE"
    },
];

const user = initialReactions[0].usuario;
const publication = initialReactions[0].publicacion;
const comment = initialReactions[2].comentario;

// Función auxiliar para devolver todas las reacciones
const reactionsInDB = async () => {
    const response = await api.get('/api/testReaction');
    return response.body.data;
};


describe('Reaction tests - with refreshed data for each test', () => {
    beforeEach(async () => {
        await Reaction.deleteMany({});
        await Reaction.insertMany(initialReactions);
    });

    test('reactions are returned as JSON', async () => {
        await api
            .get('/api/testReaction')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test(`there are ${initialReactions.length} initial reactions (all returned)`, async () => {
        const reactions = await reactionsInDB();

        assert.strictEqual(reactions.length, initialReactions.length);
    });

    describe('Recovering reactions...', () => {
        test(`there are ${initialReactions.filter(r => r.reaccion === 'LIKE').length} LIKES in total`, async () => {
            const reactions = await reactionsInDB();
            const isLike = r => r.reaccion === 'LIKE'; // predicado

            assert.strictEqual(initialReactions.filter(isLike).length, reactions.filter(isLike).length);
        });

        test(`publication with id ${publication} has ${initialReactions.filter(r => r.publicacion === publication).length} reactions`, async () => {
            const response = await api.get(`/api/publications/${publication}/reactions`);
            const publications = response.body.data;

            assert.strictEqual(publications.length, initialReactions.filter(r => r.publicacion === publication).length);
        });

        test(`comment with id ${comment} has ${initialReactions.filter(r => r.comentario === comment).length} reactions`, async () => {
            const response = await api.get(`/api/comments/${comment}/reactions`);
            const comments = response.body.data;
            
            assert.strictEqual(comments.length, initialReactions.filter(r => r.comentario === comment).length);
        });

        test(`there are ${initialReactions.filter(r => !(r.visto) && r.usuario === user).length} unseen reactions for user ${user}`, async() => {
            const response = await api.get(`/api/user/${user}/unseen`);
            const unseenReactions = response.body.data;

            assert.strictEqual(unseenReactions.length, initialReactions.filter(r => !(r.visto) && r.usuario === user).length);
        });
    });

    describe('Toggling reactions...', async () => {
        test('valid reaction can be made on comment', async () => {
            const newUser = "65b2aec262e19efa29bc3b1e"; 
            const comment = "6740858db0f666cc0d25f89c";
            const newReaction = {
                "usuario" : newUser,
                "comentario" : comment,
                "reaccion" : "DISLIKE"
            };

            await api
                .post(`/api/comments/${comment}/reaction`)
                .send(newReaction)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const reactions = await reactionsInDB();

            assert.strictEqual(reactions.length, initialReactions.length + 1);

            const response = await api.get(`/api/user/${newUser}/unseen`);
            const reactionsByNewUser = response.body.data;

            assert.strictEqual(reactionsByNewUser.length, 1);
            assert.deepEqual(reactions.filter(r => r.usuario === newUser)[0], reactionsByNewUser[0]);

        });


        test('valid reaction can be made on publication', async () => {
            const newUser = "65b2aec262e19efa29bc3b1c"; 
            const publication = "6740858db0f666cc0d25f89e";
            const newReaction = {
                "usuario" : newUser,
                "publicacion" : publication,
                "reaccion" : "DISLIKE"
            };

            await api
                .post(`/api/publications/${comment}/reaction`)
                .send(newReaction)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const reactions = await reactionsInDB();

            assert.strictEqual(reactions.length, initialReactions.length + 1);

            const response = await api.get(`/api/user/${newUser}/unseen`);
            const reactionsByNewUser = response.body.data;

            assert.strictEqual(reactionsByNewUser.length, 1);
            assert.deepEqual(reactions.filter(r => r.usuario === newUser)[0], reactionsByNewUser[0]);

        });

        test(`reactions can't be assigned to a publication and a comment at the same time`, async () => {
            const comment = "6740858db0f666cc0d25f89c";            
            const publication = "6740858db0f666cc0d25f89e";
            const newReaction = {
                "usuario" : "65b2aec262e19efa29bc3b1a",
                "publicacion" : publication,
                "comentario" : comment,
                "reaccion" : "LOVE"
            };

            await api
                .post(`/api/publications/${comment}/reaction`)
                .send(newReaction)
                .expect(400);
            
            const reactions = await reactionsInDB();

            assert.strictEqual(reactions.length, initialReactions.length);

        });

        test('an user reacting with the same reaction on the same publication/comment, deletes the reaction', async () => {
            const sameReaction = {...initialReactions[0]};

            const route = sameReaction.publicacion
                ? `/api/publications/${sameReaction.publicacion}/reaction`
                : `/api/comment/${sameReaction.comentario}/reaction`;

            await api
                .post(route)
                .send(sameReaction)
                .expect(204);

            const reactions = await reactionsInDB();

            assert.strictEqual(reactions.length, initialReactions.length - 1);
        });
    });


    describe('Checking notifications on reactions...', () => {
        test(`user ${initialReactions[0].usuario} can set unread reactions as read`, async () => {
            const user = initialReactions[0].usuario;

            const response = await api.get(`/api/user/${user}/unseen`);
            const unreadReactions = response.body.data;

            unreadReactions.forEach( async (r) => {
                await api
                    .put(`/api/read/reaction/${r.id}`)
                    .send({"visto" : true})
                    .then(r => assert.strictEqual(r.body.data.visto, true));
            });

            const newResponse = await api.get(`/api/user/${user}/unseen`);
            const unreadReactionsAtEnd = newResponse.body.data;

            assert.strictEqual(unreadReactionsAtEnd.length, 0);
        });

    });

});

after(async () => {
    await mongoose.connection.close();
});