'use client';
import { useState } from 'react';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { storyAPI } from '../lib/api';

export default function Home() {
  const [currentStory, setCurrentStory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateStory = async (storyData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const story = await storyAPI.generateStory(storyData);
      setCurrentStory(story);
    } catch (err) {
      setError(err.message);
      console.error('Failed to generate story:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewStory = () => {
    setCurrentStory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen magic-gradient">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-pink-300 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-purple-300 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-300 rounded-full opacity-40 animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && !currentStory && (
          <StoryForm onSubmit={handleGenerateStory} isLoading={isLoading} />
        )}

        {!isLoading && currentStory && (
          <StoryDisplay story={currentStory} onNewStory={handleNewStory} />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-white/80 py-6">
        <p className="font-story">Made with ✨ magic and 💝 for little dreamers</p>
      </footer>
    </div>
  );
}