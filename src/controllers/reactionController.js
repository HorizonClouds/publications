import reactionService from '../services/reactionService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const getAllTestReactions = async (req, res, next) => {
    try {
        const allReactions = await reactionService.getAllReactions();
        res.sendSuccess(allReactions);
    } catch (error) {
        res.sendError(error);
    }
};

export const getAllReactionsByPublication = async (req, res, next) => {
    try {
        const publicationReactions = 
            await reactionService.getAllReactionsByPublication(req.params.id);
        res.sendSuccess(publicationReactions);
    } catch (error) {
        res.sendError(error);
    }
};

export const getAllReactionsByComment = async (req, res, next) => {
    try {
        const commentReactions = 
            await reactionService.getAllReactionsByComment(req.params.id);
        res.sendSuccess(commentReactions);
    } catch (error) {
        res.sendError(error);
    }
};

export const getUnseenReactionsByUser = async (req, res, next) => {
    try {
        const userReactions = 
            await reactionService.getUnseenReactionsByUser(req.params.id);
        res.sendSuccess(userReactions);
    } catch (error) {
        res.sendError(error);
    }
};

/* Casuistica de reacción:
    1) Buscamos si el usuario ya ha reaccionado sobre la publicación/comentario
    2) Si ya ha reaccionado:
        2.1) TRUE -> Miramos si es el mismo tipo de reacción (LIKE, LOVE, DISLIKE):
            2.1.1) TRUE -> Borramos la reacción
            2.1.2) FALSE -> Creamos nueva reacción con el tipo nuevo
        2.2) FALSE -> Creamos nueva reacción
*/

export const reactOnPublication = async (req, res, next) => {
    try {
        const reaction = await reactionService.findPublicationReactionByUser(
            req.params.id, 
            req.body.usuario
        );

        if (reaction && reaction.reaccion === req.body.reaccion){ // CASO 2.1.1
            await reactionService.deleteReaction(reaction.id);
            res.sendSuccess(null, 'Reaction discarded successfully', 204);
        } else {                                             // CASO 2.1.2 y 2.2
            const newReaction = await reactionService.createReaction({
                publicacion: req.params.id,
                ...req.body
            });
            res.sendSuccess( newReaction, 'Reaction created successfully', 201 );
        }
        
    } catch (error) {
        if (error === 'ValidationError') {
            res.sendError(new ValidationError('Validation failed', error.errors));
        } else {
            res.sendError(
                new ValidationError(
                    'An error occurred while creating the publication', 
                    [ { msg: error.message } ]
                )
            );
        }
    }
};


export const reactOnComment = async (req, res, next) => {
    try {
        const reaction = await reactionService.findCommentReactionByUser(
            req.params.id, 
            req.body.usuario
        );

        if (reaction && reaction.reaccion === req.body.reaccion){ // CASO 2.1.1
            await reactionService.deleteReaction(reaction.id);
        } else {
            const newReaction = await reactionService.createReaction({
                comentario: req.params.id,
                ...req.body
            });
            res.sendSuccess( newReaction, 'Reaction created successfully', 201 );
        }
    } catch (error) {
        if (error === 'ValidationError') {
            res.sendError(new ValidationError('Validation failed', error.errors));
        } else {
            res.sendError(
                new ValidationError(
                    'An error occurred while creating the publication', 
                    [ { msg: error.message } ]
                )
            );
        }
    }
};

export const readReaction = async (req, res, next) => {
    try {
        const updatedReaction = await reactionService.updateReaction(
            req.params.id,
            req.body // {visto: true}
        );
        if (!updatedReaction) throw new NotFoundError('Reaction not found');
        res.sendSuccess( updatedReaction, 'Reaction read successfully');
    } catch (error) {
        res.sendError(error);
    }
};