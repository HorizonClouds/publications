import express from 'express';
import { 
    createPublication, getAllTestPublications, 
    getPublicationByID, getAllPublicationsByUser,
    updatePublication, deletePublication 
} from '../controllers/publicationController.js';


const router = express.Router();
router.get('/v1/testPublication', getAllTestPublications);
router.get('/v1/publications/:id', getPublicationByID);
router.get('/v1/publications/user/:user', getAllPublicationsByUser);
router.post('/v1/publications', createPublication);
router.put('/v1/publications/:id', updatePublication);
router.delete('/v1/publications/:id', deletePublication);

export default router;  