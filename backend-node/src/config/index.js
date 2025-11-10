import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    port: process.env.PORT || 8000,
    openaiApiKey: process.env.OPENAI_API_KEY,
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Story settings
    maxStoryLength: parseInt(process.env.MAX_STORY_LENGTH) || 1000,
    defaultAge: parseInt(process.env.DEFAULT_AGE) || 5,
    
    // File paths
    storagePath: process.env.STORAGE_PATH || join(__dirname, '../../storage/stories'),
    imagePath: process.env.IMAGE_PATH || join(__dirname, '../../storage/images'),
    
    // Create directories if they don't exist
    initializeStorage: async () => {
        await fs.ensureDir(config.storagePath);
        await fs.ensureDir(config.imagePath);
        console.log('Storage directories initialized');
    }
};

export default config;