import ReactionModel from "../models/reactionModel.js";
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';

export const getAllReactions = async () => {
    try {
        return await ReactionModel.find({});
    } catch (error) {
        throw new BadRequestError('Error fetching all reactions: ', error);
    }
};

export const getAllReactionsByPublication = async (publication_id) => {
    try {
        const reactions = ReactionModel.find({publicacion: publication_id});
        return reactions;
    } catch (error) {
        throw new BadRequestError('Error fetching reactions by publication', error);
    }
};

export const getAllReactionsByComment = async (comment_id) => {
    try {
        const reactions = ReactionModel.find({comentario: comment_id});
        return reactions;        
    } catch (error) {
        throw new BadRequestError('Error fetching reactions by comment', error);
    }
};

export const getUnseenReactionsByUser = async (user_id) => {
    try {
        const reactions = ReactionModel.find({usuario: user_id, visto: false});
        return reactions;
    } catch (error) {
        throw new BadRequestError('Error fetching reactions by user', error);
    }
};

export const findCommentReactionByUser = async (comment_id, user_id) => {
    try {
        const reaction = ReactionModel.findOne({comentario: comment_id, usuario: user_id });
        return reaction;
    } catch (error) {
        throw new BadRequestError('Error fetching comment reaction by user', error);
    }
};

export const findPublicationReactionByUser = async (publication_id, user_id) => {
    try {
        const reaction = ReactionModel.findOne({publicacion: publication_id, usuario: user_id});
        return reaction;
    } catch (error) {
        throw new BadRequestError('Error fetching publication reaction by user', error);
    }
};

export const createReaction = async (data) => {
    try {
        const newReaction = new ReactionModel(data);
        return await newReaction.save();
    } catch (error) {
        throw new BadRequestError('Error creating a reaction: ', error);
    }
};

export const updateReaction = async (id, data) => {
    try {
        const updatedReaction = await ReactionModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
        if(!updatedReaction) throw new NotFoundError('Reaction not found');
        return updatedReaction;
    } catch (error) {
        throw new BadRequestError('Error updating a reaction: ', error);
    }
};

export const deleteReaction = async (id) => {
    try {
        const deletedReaction = await ReactionModel.findByIdAndDelete(id);
        if(!deletedReaction) throw new NotFoundError('Reaction not found');
        return deletedReaction;
    } catch (error) {
        throw new BadRequestError('Error deleting reaction', error);
    }
};

export default {
    getAllReactions, getAllReactionsByPublication,
    getAllReactionsByComment, getUnseenReactionsByUser,
    findCommentReactionByUser, findPublicationReactionByUser,
    createReaction, updateReaction, deleteReaction
}