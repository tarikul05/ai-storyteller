import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

async function testStoryGeneration() {
    try {
        console.log('🧪 Testing Storyteller Agent...\n');

        // Test data
        const storyRequest = {
            child_name: 'Emma',
            age: 6,
            theme: 'friendship',
            main_character: 'Sparkle the Unicorn',
            setting: 'Enchanted Rainbow Valley',
            moral_lesson: 'True friends accept you for who you are',
            include_images: true,
            include_audio: true,
        };

        console.log('📖 Generating story...');
        const response = await axios.post(`${API_BASE}/generate-story`, storyRequest);
        
        if (response.status === 200) {
            const story = response.data;
            console.log('✅ Story Generated Successfully!');
            console.log(`📖 Title: ${story.title}`);
            console.log(`👶 For: ${storyRequest.child_name} (age ${storyRequest.age})`);
            console.log(`💫 Moral: ${story.moral}`);
            console.log(`🎵 Audio: ${story.audio_path ? 'Generated' : 'Not generated'}`);
            console.log(`🖼️ Images: ${story.images.length} scenes`);
            console.log(`⏱️ Duration: ${story.duration_minutes} minutes`);
            console.log(`\n📝 Story Preview: ${story.content.substring(0, 200)}...`);
        } else {
            console.log('❌ Failed to generate story');
        }

    } catch (error) {
        console.error('🚨 Test failed:', error.response?.data || error.message);
    }
}

async function testHealthCheck() {
    try {
        const response = await axios.get(`${API_BASE}/health`);
        console.log('\n🏥 Health Check:', response.data);
    } catch (error) {
        console.error('Health check failed:', error.message);
    }
}

// Run tests
async function runTests() {
    await testHealthCheck();
    await testStoryGeneration();
}

runTests();