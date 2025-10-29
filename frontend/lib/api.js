import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class StoryAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 330000,
    });
  }

  async generateStory(storyData) {
    try {
      const response = await this.client.post('/generate-story', storyData);
      return response.data;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error(error.response?.data?.detail || 'Failed to generate story');
    }
  }

  getAudioUrl(storyId) {
    return `${API_BASE_URL}/story-audio/${storyId}`;
  }

  getImageUrl(storyId, sceneNum) {
    return `${API_BASE_URL}/story-image/${storyId}/${sceneNum}`;
  }
}

export const storyAPI = new StoryAPI();