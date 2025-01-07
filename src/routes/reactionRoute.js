import express from 'express';
import { 
    getAllTestReactions, readReaction, getUnseenReactionsByUser,
    getAllReactionsByComment, getAllReactionsByPublication,
    reactOnComment, reactOnPublication
} from '../controllers/reactionController.js';


const router = express.Router();
router.get('/v1/testReaction', getAllTestReactions);
router.get('/v1/comments/:id/reactions', getAllReactionsByComment);
router.get('/v1/publications/:id/reactions', getAllReactionsByPublication);
router.get('/v1/user/:id/unseen', getUnseenReactionsByUser);
router.post('/v1/comments/:id/reaction', reactOnComment);
router.post('/v1/publications/:id/reaction', reactOnPublication);
router.put('/v1/read/reaction/:id', readReaction);

export default router;  