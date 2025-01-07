import CommentModel from "../models/commentModel.js";
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';


export const getAllComments = async () => {
    try {
        return await CommentModel.find({});
    } catch (error) {
        throw new BadRequestError('Error fetching all comments: ', error);
    }
};

export const getCommentByID = async (id) => {
    try {
        const comment = await CommentModel.findById(id);
        if(!comment) throw new NotFoundError('Comment not found');
        return comment;
    } catch (error) {
        throw new NotFoundError('Error fetching comment by ID', error);
    }
};


export const getAllCommentsByUser = async (user_id) => {
    try {
        const comments = await CommentModel.find({usuario_id: user_id});
        if(!comments) throw new NotFoundError('User without comments');
        return comments;
    } catch (error) {
        throw new NotFoundError('Error fetching comments by User', error);
    }
};


export const getAllCommentsByPublication = async (publication_id) => {
    //console.log ('Entra en getAllCommentsByPublication '+  publication_id)
    try {
        const comments = await CommentModel.find({publicacion_id: publication_id});
        if(!comments) throw new NotFoundError('Publication without comments');
        return comments;
    } catch (error) {
        throw new NotFoundError('Error fetching comments by Publication', error);
    }
};


export const createComment = async (data) => {
    try {
        const newComment = new CommentModel(data);
        return await newComment.save();
    } catch (error) {
        throw new BadRequestError('Error creating a comment: ', error);
    }
};

export const updateComment = async (id, data) => {
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
        if (!updatedComment) throw new NotFoundError('Comment not found');
        return updatedComment;
    } catch (error) {
        throw new BadRequestError('Error updating a comment: ', error);
    }
};

export const deleteComment = async (id) => {
    try {
        const deletedComment = await CommentModel.findByIdAndDelete(id);
        if (!deletedComment) throw new NotFoundError('Comment not found');
        return deletedComment;
    } catch (error) {
        throw new NotFoundError('Error deleting comment', error);
    }
}


export default { 
    getAllComments,
    createComment, 
    getCommentByID, 
    getAllCommentsByUser,
    getAllCommentsByPublication,
    updateComment, 
    deleteComment 
};