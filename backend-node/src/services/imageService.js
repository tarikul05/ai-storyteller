import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import config from '../config/index.js';
import { Helpers } from '../utils/helpers.js';

export class ImageService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openaiApiKey
        });
    }

    async generateStoryScenes(storyContent, storyId, numScenes = 3) {
        try {
            const scenes = this.extractScenes(storyContent, numScenes);
            const imagePaths = [];

            for (let i = 0; i < scenes.length; i++) {
                const sceneDescription = scenes[i];
                const imagePath = await this.generateImage(sceneDescription, storyId, i);
                if (imagePath) {
                    imagePaths.push(imagePath);
                }
            }

            return imagePaths;
        } catch (error) {
            console.error('Image generation error:', error);
            return [];
        }
    }

    extractScenes(storyContent, numScenes) {
        // Simple scene extraction - you can enhance this with more sophisticated logic
        const paragraphs = storyContent.split('\n')
            .filter(p => p.trim().length > 50)
            .map(p => p.trim());

        if (paragraphs.length >= numScenes) {
            return paragraphs.slice(0, numScenes);
        } else {
            // Split the content into chunks for scenes
            const chunkSize = Math.ceil(Math.min(storyContent.length, 600) / numScenes);
            const scenes = [];
            for (let i = 0; i < numScenes; i++) {
                const start = i * chunkSize;
                const end = start + chunkSize;
                scenes.push(storyContent.substring(start, end));
            }
            return scenes.filter(scene => scene.length > 0);
        }
    }

    async generateImage(sceneDescription, storyId, sceneNum) {
        try {
            const prompt = `
Children's book illustration style, colorful, friendly, warm, magical.
Scene: ${sceneDescription.substring(0, 800)}
Style: Bright colors, soft edges, friendly characters, magical atmosphere, child-friendly, Disney/Pixar style.
No text in the image.
`;

            const response = await this.client.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                size: "1024x1024",
                quality: "standard",
                n: 1,
            });

            const imageUrl = response.data[0].url;
            const imagePath = path.join(config.imagePath, `${storyId}_scene_${sceneNum}.png`);
            
            await Helpers.ensureDirectoryExists(path.dirname(imagePath));

            // Download and save image
            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer'
            });

            await fs.writeFile(imagePath, imageResponse.data);
            return imagePath;

        } catch (error) {
            console.error(`Image generation failed for scene ${sceneNum}:`, error);
            return null;
        }
    }

    async getImageStream(imagePath) {
        try {
            if (await fs.pathExists(imagePath)) {
                return fs.createReadStream(imagePath);
            }
            return null;
        } catch (error) {
            console.error('Error getting image stream:', error);
            return null;
        }
    }
}