import express from 'express';
import { 
    createComment, 
    getAllTestComments, 
    getCommentByID, 
    getAllCommentsByUser,
    getAllCommentsByPublication,
    updateComment, 
    deleteComment 
} from '../controllers/commentController.js';


const router = express.Router();
router.get('/testcomments', getAllTestComments);
router.get('/comments/:id', getCommentByID);
router.get('/comments/user/:user', getAllCommentsByUser);
router.get('/comments/publication/:publication', getAllCommentsByPublication);
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;  