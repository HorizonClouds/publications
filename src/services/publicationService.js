import PublicationModel from "../models/publicationModel.js";
import { NotFoundError, BadRequestError } from '../utils/customErrors.js';

export const getAllPublications = async () => {
    try {
        return await PublicationModel.find({});
    } catch (error) {
        throw new BadRequestError('Error fetching all publications: ', error);
    }
};

export const getAllPublicationsByUser = async (user_id) => {
    try {
        const publications = await PublicationModel.find({usuario: user_id});
        // si el usuario aún no tiene publicaciones, queremos devolver la lista vacía
        return publications;
    } catch (error) {
        throw new BadRequestError('Error fetching publications by User', error);
    }
};

export const getPublicationByID = async (id) => {
    try {
        const publication = await PublicationModel.findById(id);
        if(!publication) throw new NotFoundError('Publication not found');
        return publication;
    } catch (error) {
        throw new BadRequestError('Error fetching publications by ID', error);
    }
};

export const createPublication = async (data) => {
    try {
        const newPublication = new PublicationModel(data);
        return await newPublication.save();
    } catch (error) {
        throw new BadRequestError('Error creating a publication: ', error);
    }
};

export const updatePublication = async (id, data) => {
    try {
        const updatedPublication = await PublicationModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
        if (!updatedPublication) throw new NotFoundError('Publication not found');
        return updatedPublication;
    } catch (error) {
        throw new BadRequestError('Error updating a publication: ', error);
    }
};

export const deletePublication = async (id) => {
    try {
        const deletedPublication = await PublicationModel.findByIdAndDelete(id);
        if (!deletedPublication) throw new NotFoundError('Publication not found');
        return deletedPublication;
    } catch (error) {
        throw new BadRequestError('Error deleting publication', error);
    }
}


export default { 
    getAllPublications, 
    getAllPublicationsByUser,
    getPublicationByID,
    createPublication,
    updatePublication,
    deletePublication
};