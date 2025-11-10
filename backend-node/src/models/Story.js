class StoryRequest {
    constructor({
        child_name,
        age = 5,
        theme = 'adventure',
        main_character,
        setting = 'magical forest',
        moral_lesson = null,
        include_images = false,
        include_audio = false
    }) {
        this.child_name = child_name;
        this.age = Math.max(3, Math.min(12, age));
        this.theme = theme;
        this.main_character = main_character;
        this.setting = setting;
        this.moral_lesson = moral_lesson;
        this.include_images = include_images;
        this.include_audio = include_audio;
    }

    validate() {
        const errors = [];
        
        if (!this.child_name || this.child_name.trim().length === 0) {
            errors.push('Child name is required');
        }
        
        if (!this.main_character || this.main_character.trim().length === 0) {
            errors.push('Main character is required');
        }
        
        if (this.age < 3 || this.age > 12) {
            errors.push('Age must be between 3 and 12');
        }

        const validThemes = ['courage', 'friendship', 'teamwork', 'honesty', 'kindness', 'adventure'];
        if (!validThemes.includes(this.theme)) {
            errors.push(`Theme must be one of: ${validThemes.join(', ')}`);
        }

        return errors;
    }
}

class StoryResponse {
    constructor({
        story_id,
        title,
        content,
        moral,
        images = [],
        audio_path = null,
        duration_minutes = 3.0
    }) {
        this.story_id = story_id;
        this.title = title;
        this.content = content;
        this.moral = moral;
        this.images = images;
        this.audio_path = audio_path;
        this.duration_minutes = duration_minutes;
    }

    toJSON() {
        return {
            story_id: this.story_id,
            title: this.title,
            content: this.content,
            moral: this.moral,
            images: this.images,
            audio_path: this.audio_path,
            duration_minutes: this.duration_minutes
        };
    }
}

export { StoryRequest, StoryResponse };