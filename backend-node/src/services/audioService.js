import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import config from '../config/index.js';
import { Helpers } from '../utils/helpers.js';

export class AudioService {
    constructor() {
        this.elevenlabsApiKey = config.elevenlabsApiKey;
    }

    async generateAudio(text, storyId, voice = 'Bella') {
        try {
            if (this.elevenlabsApiKey) {
                return await this.generateElevenLabsAudio(text, storyId, voice);
            } else {
                return await this.generateOpenAIAudio(text, storyId);
            }
        } catch (error) {
            console.error('Audio generation failed:', error);
            return null;
        }
    }

    async generateOpenAIAudio(text, storyId) {
        try {
            const { default: OpenAI } = await import('openai');
            const openai = new OpenAI({ apiKey: config.openaiApiKey });

            const audioPath = path.join(config.storagePath, `${storyId}_narration.mp3`);
            await Helpers.ensureDirectoryExists(path.dirname(audioPath));

            // Limit text length for TTS
            const limitedText = text.substring(0, 4096);

            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy", // alloy, echo, fable, onyx, nova, shimmer
                input: limitedText,
            });

            const buffer = Buffer.from(await response.arrayBuffer());
            await fs.writeFile(audioPath, buffer);

            return audioPath;
        } catch (error) {
            console.error('OpenAI TTS error:', error);
            throw error;
        }
    }

    async generateElevenLabsAudio(text, storyId, voice) {
        try {
            if (!this.elevenlabsApiKey) {
                throw new Error('ElevenLabs API key not configured');
            }

            const audioPath = path.join(config.storagePath, `${storyId}_narration.mp3`);
            await Helpers.ensureDirectoryExists(path.dirname(audioPath));

            // Limit text length
            const limitedText = text.substring(0, 5000);

            const response = await axios.post(
                `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
                {
                    text: limitedText,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                },
                {
                    headers: {
                        'xi-api-key': this.elevenlabsApiKey,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            await fs.writeFile(audioPath, response.data);
            return audioPath;

        } catch (error) {
            console.error('ElevenLabs TTS error:', error);
            // Fallback to OpenAI TTS
            return await this.generateOpenAIAudio(text, storyId);
        }
    }

    async getAudioStream(audioPath) {
        try {
            if (await fs.pathExists(audioPath)) {
                return fs.createReadStream(audioPath);
            }
            return null;
        } catch (error) {
            console.error('Error getting audio stream:', error);
            return null;
        }
    }
}