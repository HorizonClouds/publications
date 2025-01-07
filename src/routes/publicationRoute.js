import express from 'express';
import { 
    createPublication, getAllTestPublications, 
    getPublicationByID, getAllPublicationsByUser,
    updatePublication, deletePublication 
} from '../controllers/publicationController.js';


const router = express.Router();
router.get('/testPublication', getAllTestPublications);
router.get('/publications/:id', getPublicationByID);
router.get('/publications/user/:user', getAllPublicationsByUser);
router.post('/publications', createPublication);
router.put('/publications/:id', updatePublication);
router.delete('/publications/:id', deletePublication);

export default router;  