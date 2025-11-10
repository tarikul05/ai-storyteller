import OpenAI from 'openai';
import config from '../config/index.js';
import { StoryResponse } from '../models/Story.js';
import { Helpers } from '../utils/helpers.js';

export class StoryService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.openaiApiKey
        });
    }

    generateStoryPrompt(request) {
        const languageStyle = Helpers.getAgeAppropriateLanguage(request.age);
        
        const prompt = `
You are a magical storyteller for children aged ${request.age}. 
Create a heartwarming, engaging story with these specifications:

CHILD'S NAME: ${request.child_name}
MAIN CHARACTER: ${request.main_character}
THEME: ${request.theme}
SETTING: ${request.setting}
MORAL LESSON: ${request.moral_lesson || request.theme}
LANGUAGE STYLE: ${languageStyle}
STORY LENGTH: 3-5 minutes reading time

Story Structure:
1. Introduction - Introduce characters and setting
2. Adventure/Challenge - Create an engaging problem  
3. Resolution - Show how characters overcome challenges
4. Moral - End with a clear, positive moral lesson

Make the story personalized for ${request.child_name} and include ${request.main_character} as a brave, kind character.
Use age-appropriate language that a ${request.age}-year-old would enjoy.

Please format the story with a clear title and separate paragraphs.
`;

        return prompt;
    }

    async generateStory(request) {
        try {
            const prompt = this.generateStoryPrompt(request);
            
            const completion = await this.client.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a creative, warm, and engaging children's storyteller. You create magical, age-appropriate stories that teach positive values. Always include a title at the beginning and structure the story with clear paragraphs."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.8
            });

            const storyContent = completion.choices[0].message.content.trim();
            
            // Extract title and content
            const lines = storyContent.split('\n').filter(line => line.trim());
            let title = "The Magical Adventure";
            let content = storyContent;

            // Simple title extraction - you can enhance this
            if (lines.length > 0 && lines[0].toLowerCase().includes('title:')) {
                title = lines[0].replace(/title:\s*/i, '').trim();
                content = lines.slice(1).join('\n');
            } else if (lines.length > 0 && lines[0].length < 100) {
                // First line might be the title
                title = lines[0];
                content = lines.slice(1).join('\n');
            }

            const moral = Helpers.getMoralLesson(request.theme);
            const storyId = Helpers.generateId();

            return new StoryResponse({
                story_id: storyId,
                title: title,
                content: content,
                moral: moral,
                duration_minutes: 3.0
            });

        } catch (error) {
            console.error('Story generation error:', error);
            throw new Error(`Story generation failed: ${error.message}`);
        }
    }

    async generateInteractiveStory(request, choices = []) {
        // Enhanced version for interactive storytelling
        // You can extend this for branching narratives
        return await this.generateStory(request);
    }
}