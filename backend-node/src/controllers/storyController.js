import { StoryService } from '../services/storyService.js';
import { AudioService } from '../services/audioService.js';
import { ImageService } from '../services/imageService.js';
import { StoryRequest, StoryResponse } from '../models/Story.js';
import path from 'path';
import fs from 'fs-extra';

export class StoryController {
    constructor() {
        this.storyService = new StoryService();
        this.audioService = new AudioService();
        this.imageService = new ImageService();
    }

    async generateStory(req, res) {
        try {
            const requestData = req.body;
            
            // Validate request
            const storyRequest = new StoryRequest(requestData);
            const validationErrors = storyRequest.validate();
            
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationErrors
                });
            }

            console.log('Generating story for:', storyRequest.child_name);
            
            // Generate story content
            let storyResponse = await this.storyService.generateStory(storyRequest);
            
            // Generate audio if requested
            if (storyRequest.include_audio) {
                try {
                    const audioPath = await this.audioService.generateAudio(
                        storyResponse.content,
                        storyResponse.story_id
                    );
                    storyResponse.audio_path = audioPath;
                } catch (audioError) {
                    console.error('Audio generation failed:', audioError);
                    // Continue without audio
                }
            }
            
            // Generate images if requested
            if (storyRequest.include_images) {
                try {
                    const imagePaths = await this.imageService.generateStoryScenes(
                        storyResponse.content,
                        storyResponse.story_id,
                        3
                    );
                    storyResponse.images = imagePaths;
                } catch (imageError) {
                    console.error('Image generation failed:', imageError);
                    // Continue without images
                }
            }

            res.json(storyResponse.toJSON());

        } catch (error) {
            console.error('Story generation error:', error);
            res.status(500).json({
                error: 'Failed to generate story',
                message: error.message
            });
        }
    }

    async getStoryAudio(req, res) {
        try {
            const { storyId } = req.params;
            const audioPath = path.join(process.env.STORAGE_PATH, `${storyId}_narration.mp3`);
            
            if (await fs.pathExists(audioPath)) {
                res.setHeader('Content-Type', 'audio/mpeg');
                const audioStream = await this.audioService.getAudioStream(audioPath);
                if (audioStream) {
                    audioStream.pipe(res);
                } else {
                    res.status(404).json({ error: 'Audio not found' });
                }
            } else {
                res.status(404).json({ error: 'Audio not found' });
            }
        } catch (error) {
            console.error('Audio retrieval error:', error);
            res.status(500).json({ error: 'Failed to retrieve audio' });
        }
    }

    async getStoryImage(req, res) {
        try {
            const { storyId, sceneNum } = req.params;
            const imagePath = path.join(process.env.IMAGE_PATH, `${storyId}_scene_${sceneNum}.png`);
            
            if (await fs.pathExists(imagePath)) {
                res.setHeader('Content-Type', 'image/png');
                const imageStream = await this.imageService.getImageStream(imagePath);
                if (imageStream) {
                    imageStream.pipe(res);
                } else {
                    res.status(404).json({ error: 'Image not found' });
                }
            } else {
                res.status(404).json({ error: 'Image not found' });
            }
        } catch (error) {
            console.error('Image retrieval error:', error);
            res.status(500).json({ error: 'Failed to retrieve image' });
        }
    }

    async healthCheck(req, res) {
        res.json({
            status: 'healthy',
            service: 'Storyteller Agent',
            timestamp: new Date().toISOString()
        });
    }
}