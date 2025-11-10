import express from 'express';
import { StoryController } from '../controllers/storyController.js';

const router = express.Router();
const storyController = new StoryController();

// Health check
router.get('/health', (req, res) => storyController.healthCheck(req, res));

// Story generation
router.post('/generate-story', (req, res) => storyController.generateStory(req, res));

// File retrieval
router.get('/story-audio/:storyId', (req, res) => storyController.getStoryAudio(req, res));
router.get('/story-image/:storyId/:sceneNum', (req, res) => storyController.getStoryImage(req, res));

export default router;