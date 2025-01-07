import publicationService from '../services/publicationService.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const getAllTestPublications = async (req, res, next) => {
    try {
        const allPublications = await publicationService.getAllPublications();
        res.sendSuccess(allPublications);
    } catch (error) {
        res.sendError(error);
    }
};

export const getAllPublicationsByUser = async (req, res, next) => {
    try {
        const userPublications = 
            await publicationService.getAllPublicationsByUser(req.params.user);
        res.sendSuccess(userPublications);
    } catch (error) {
        res.sendError(error);
    }
};

export const getPublicationByID = async (req, res, next) => {
    try {
        const publication = 
            await publicationService.getPublicationByID(req.params.id);
        if (!publication) throw new NotFoundError('Publication not found');
        res.sendSuccess(publication);
    } catch (error) {
        res.sendError(error);
    }
};

export const createPublication = async (req, res, next) => {
    try {
        const newPublication = await publicationService.createPublication(req.body);
        res.sendSuccess( newPublication, 'Publication created successfully', 201 );
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.sendError(new ValidationError('Validation failed', error.errors));
        } else {
            res.sendError(
                new ValidationError('An error occurred while creating the publication', 
                    [
                        { msg: error.message },
                    ]
                )
            );
        }
    }
};

export const updatePublication = async (req, res, next) => {
    try {
        const updatedPublication = 
            await publicationService.updatePublication(req.params.id, req.body);
        if (!updatedPublication) throw new NotFoundError('Publication not found');
        res.sendSuccess( updatedPublication, 'Publication updated successfully');
    } catch (error) {
        res.sendError(error);
    }
};

export const deletePublication = async (req, res, next) => {
    try {
        const deletedPublication = 
            await publicationService.deletePublication(req.params.id);
        if (!deletedPublication) throw new NotFoundError('Publication not found');
        res.sendSuccess(null, 'Publication deleted successfully', 204);
    } catch (error) {
        res.sendError(error);
    }
};