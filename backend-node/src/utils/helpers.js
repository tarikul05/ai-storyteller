import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';

export class Helpers {
    static generateId() {
        return uuidv4();
    }

    static getAgeAppropriateLanguage(age) {
        const ageLanguageMap = {
            3: "very simple words, short sentences, repetitive phrases",
            5: "simple vocabulary, clear concepts, some repetition", 
            8: "engaging vocabulary, more complex sentences, detailed descriptions",
            12: "rich vocabulary, complex sentences, deeper themes"
        };

        let languageStyle = "very simple words, short sentences";
        const ageLimits = Object.keys(ageLanguageMap).map(Number).sort((a, b) => a - b);
        
        for (const ageLimit of ageLimits) {
            if (age <= ageLimit) {
                languageStyle = ageLanguageMap[ageLimit];
                break;
            }
        }

        return languageStyle;
    }

    static getMoralLesson(theme) {
        const moralLessons = {
            courage: "Being brave means facing your fears, not having no fears.",
            friendship: "True friends are there for you through all adventures.",
            teamwork: "Together we can achieve amazing things!",
            honesty: "Honesty is the foundation of trust and friendship.",
            kindness: "Small acts of kindness can make a big difference.",
            adventure: "Every adventure teaches us something new about ourselves."
        };

        return moralLessons[theme] || "Always be kind and brave!";
    }

    static async ensureDirectoryExists(dirPath) {
        await fs.ensureDir(dirPath);
    }

    static sanitizeFilename(filename) {
        return filename.replace(/[^a-zA-Z0-9-_]/g, '_');
    }
}