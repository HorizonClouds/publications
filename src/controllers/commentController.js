import commentService from '../services/commentService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const getAllTestComments = async (req, res, next) => {
    try {
        const allcomments = await commentService.getAllComments();
        res.sendSuccess(allcomments);
    } catch (error) {
        res.sendError(error);
    }
};



export const getCommentByID = async (req, res, next) => {
    try {
        const comment = 
            await commentService.getCommentByID(req.params.id);
        if (!comment) throw new NotFoundError('Comment not found');
        res.sendSuccess(comment);
    } catch (error) {
        res.sendError(error);
    }
};

export const getAllCommentsByUser = async (req, res, next) => {
    try {
        const usercomments = 
            await commentService.getAllCommentsByUser(req.params.user);
        if (!usercomments) throw new NotFoundError('User without comments');
        res.sendSuccess(usercomments);
    } catch (error) {
        res.sendError(error);
    }
};

export const getAllCommentsByPublication = async (req, res, next) => {
    try {
        const publicationcomments = 
            await commentService.getAllCommentsByPublication(req.params.publication);
        if (!publicationcomments) throw new NotFoundError('Publication without comments');
        res.sendSuccess(publicationcomments);
    } catch (error) {
        res.sendError(error);
    }
};



export const createComment = async (req, res, next) => {

    try {
        const newcomment = await commentService.createComment(req.body);
        res.sendSuccess( newcomment, 'Comment created successfully', 201 );
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.sendError(new ValidationError('Validation failed', error.errors));
        } else {
            res.sendError(
                new ValidationError('An error occurred while creating the comment', 
                    [
                        { msg: error.message },
                    ]
                )
            );
        }
    }
    
};

export const updateComment = async (req, res, next) => {
    try {
        const updatedcomment = 
            await commentService.updateComment(req.params.id, req.body);
        if (!updatedcomment) throw new NotFoundError('comment not found');
        res.sendSuccess( updatedcomment, 'Comment updated successfully');
    } catch (error) {
        res.sendError(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const deletedcomment = 
            await commentService.deleteComment(req.params.id);
        if (!deletedcomment) throw new NotFoundError('comment not found');
        res.sendSuccess(null, 'Comment deleted successfully', 204);
    } catch (error) {
        res.sendError(error);
    }
};