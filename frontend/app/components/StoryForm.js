'use client';
import { useState } from 'react';
import { Sparkles, User, Cake, Heart, Image, Volume2 } from 'lucide-react';

const themes = [
  { value: 'courage', label: 'Courage 🦁', emoji: '🦁' },
  { value: 'friendship', label: 'Friendship 👫', emoji: '👫' },
  { value: 'teamwork', label: 'Teamwork 🤝', emoji: '🤝' },
  { value: 'honesty', label: 'Honesty 💎', emoji: '💎' },
  { value: 'kindness', label: 'Kindness 🌸', emoji: '🌸' },
  { value: 'adventure', label: 'Adventure 🗺️', emoji: '🗺️' },
];

const characters = [
  'Brave Dragon',
  'Curious Fox',
  'Magic Unicorn',
  'Wise Owl',
  'Playful Dolphin',
  'Gentle Giant',
  'Sparkle Fairy',
  'Adventure Bear'
];

const settings = [
  'Enchanted Forest',
  'Magic Castle',
  'Underwater Kingdom',
  'Cloud City',
  'Space Station',
  'Rainbow Valley',
  'Candy Land',
  'Dinosaur World'
];

export default function StoryForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    child_name: '',
    age: 5,
    theme: 'adventure',
    main_character: 'Brave Dragon',
    setting: 'Enchanted Forest',
    moral_lesson: '',
    include_images: true,
    include_audio: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-story-purple/10 rounded-full">
            <Sparkles className="w-8 h-8 text-story-purple animate-sparkle" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-story">
          Magic Storyteller 🧚‍♀️
        </h1>
        <p className="text-lg text-gray-600">
          Create personalized bedtime stories for your little ones
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100">
        {/* Child's Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2" />
            Child's Name
          </label>
          <input
            type="text"
            required
            value={formData.child_name}
            onChange={(e) => handleChange('child_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-story-purple focus:border-transparent transition-all font-story text-lg"
            placeholder="Enter the child's name..."
          />
        </div>

        {/* Age Slider */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Cake className="w-4 h-4 mr-2" />
            Age: {formData.age} years
          </label>
          <input
            type="range"
            min="3"
            max="12"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3</span>
            <span>12</span>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4 mr-2" />
            Story Theme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map(theme => (
              <button
                key={theme.value}
                type="button"
                onClick={() => handleChange('theme', theme.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  formData.theme === theme.value
                    ? 'border-story-purple bg-story-purple/10 shadow-md'
                    : 'border-gray-200 hover:border-story-purple/50'
                }`}
              >
                <div className="text-lg mb-1">{theme.emoji}</div>
                <div className="text-sm font-medium text-gray-700">
                  {theme.label.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Character */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            🦄 Main Character
          </label>
          <select
            value={formData.main_character}
            onChange={(e) => handleChange('main_character', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-story-purple focus:border-transparent font-story"
          >
            {characters.map(char => (
              <option key={char} value={char}>{char}</option>
            ))}
          </select>
        </div>

        {/* Setting */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            🏰 Story Setting
          </label>
          <select
            value={formData.setting}
            onChange={(e) => handleChange('setting', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-story-purple focus:border-transparent font-story"
          >
            {settings.map(setting => (
              <option key={setting} value={setting}>{setting}</option>
            ))}
          </select>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.include_images}
              onChange={(e) => handleChange('include_images', e.target.checked)}
              className="w-4 h-4 text-story-purple focus:ring-story-purple"
            />
            <Image className="w-5 h-5 text-story-purple" />
            <span className="text-sm font-medium text-gray-700">Magic Pictures</span>
          </label>

          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.include_audio}
              onChange={(e) => handleChange('include_audio', e.target.checked)}
              className="w-4 h-4 text-story-purple focus:ring-story-purple"
            />
            <Volume2 className="w-5 h-5 text-story-purple" />
            <span className="text-sm font-medium text-gray-700">Voice Narration</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.child_name}
          className="w-full py-4 px-6 bg-gradient-to-r from-story-purple to-story-pink text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Creating Magic...
            </div>
          ) : (
            '✨ Create Magical Story ✨'
          )}
        </button>
      </form>
    </div>
  );
}