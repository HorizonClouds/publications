import express from 'express';
import { 
    getAllTestReactions, readReaction, getUnseenReactionsByUser,
    getAllReactionsByComment, getAllReactionsByPublication,
    reactOnComment, reactOnPublication
} from '../controllers/reactionController.js';


const router = express.Router();
router.get('/testReaction', getAllTestReactions);
router.get('/comments/:id/reactions', getAllReactionsByComment);
router.get('/publications/:id/reactions', getAllReactionsByPublication);
router.get('/user/:id/unseen', getUnseenReactionsByUser);
router.post('/comments/:id/reaction', reactOnComment);
router.post('/publications/:id/reaction', reactOnPublication);
router.put('/read/reaction/:id', readReaction);

export default router;  