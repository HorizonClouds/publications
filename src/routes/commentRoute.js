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
router.get('/v1/testcomments', getAllTestComments);
router.get('/v1/comments/:id', getCommentByID);
router.get('/v1/comments/user/:user', getAllCommentsByUser);
router.get('/v1/comments/publication/:publication', getAllCommentsByPublication);
router.post('/v1/comments', createComment);
router.put('/v1/comments/:id', updateComment);
router.delete('/v1/comments/:id', deleteComment);

export default router;  