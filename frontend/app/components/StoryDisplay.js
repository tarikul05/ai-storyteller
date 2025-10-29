'use client';
import { Share2, Download, BookOpen } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import ImageGallery from './ImageGallery';

export default function StoryDisplay({ story, onNewStory }) {
  const { story_id, title, content, moral, audio_path, images, duration_minutes } = story;

  const shareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this magical story: ${content.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Story link copied to clipboard!');
    }
  };

  const downloadStory = () => {
    const storyText = `${title}\n\n${content}\n\nMoral: ${moral}`;
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-story">
          {title} ✨
        </h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={shareStory}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={downloadStory}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={onNewStory}
            className="flex items-center space-x-2 px-4 py-2 bg-story-purple text-white rounded-lg hover:bg-story-purple/80 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>New Story</span>
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100">
        <div className="story-text text-lg text-gray-700 leading-relaxed whitespace-pre-line">
          {content}
        </div>

        {/* Moral Section */}
        {moral && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-story flex items-center">
              💫 The Magic Lesson
            </h3>
            <p className="text-lg text-gray-700 italic">{moral}</p>
          </div>
        )}
      </div>

      {/* Audio Player */}
      {audio_path && (
        <AudioPlayer audioUrl={`http://localhost:8000/story-audio/${story_id}`} />
      )}

      {/* Image Gallery */}
      {images && images.length > 0 && (
        <ImageGallery images={images} storyId={story_id} />
      )}
    </div>
  );
}