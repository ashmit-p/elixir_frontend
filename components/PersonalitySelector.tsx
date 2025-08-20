'use client';

import { useState } from 'react';
import { ChevronDown, User, Brain, Heart, BookOpen, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Personality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
}

const personalities: Personality[] = [
  {
    id: 'therapist',
    name: 'Dr. Wellness',
    description: 'A supportive AI therapist focused on mental health and emotional wellness',
    avatar: '/bot-avatar.jpg',
    color: 'emerald'
  },
  {
    id: 'mentor',
    name: 'Alex Coach',
    description: 'A motivational mentor focused on personal growth and goal achievement',
    avatar: '/bot-avatar.jpg',
    color: 'blue'
  },
  {
    id: 'friend',
    name: 'Sam Buddy',
    description: 'A casual, friendly companion for everyday conversations and support',
    avatar: '/bot-avatar.jpg',
    color: 'orange'
  },
  {
    id: 'scholar',
    name: 'Prof. Insight',
    description: 'An intellectual companion for learning, analysis, and deep discussions',
    avatar: '/bot-avatar.jpg',
    color: 'purple'
  },
  {
    id: 'creative',
    name: 'Luna Arts',
    description: 'A creative spirit for artistic inspiration and imaginative exploration',
    avatar: '/bot-avatar.jpg',
    color: 'pink'
  }
];

const personalityIcons = {
  therapist: Heart,
  mentor: User,
  friend: User,
  scholar: BookOpen,
  creative: Palette
};

const colorClasses = {
  emerald: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-300',
  blue: 'bg-blue-500 hover:bg-blue-600 border-blue-300',
  orange: 'bg-orange-500 hover:bg-orange-600 border-orange-300',
  purple: 'bg-purple-500 hover:bg-purple-600 border-purple-300',
  pink: 'bg-pink-500 hover:bg-pink-600 border-pink-300'
};

interface PersonalitySelectorProps {
  selectedPersonality: Personality;
  onPersonalityChange: (personality: Personality) => void;
}

export default function PersonalitySelector({ selectedPersonality, onPersonalityChange }: PersonalitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const IconComponent = personalityIcons[selectedPersonality.id as keyof typeof personalityIcons] || Brain;

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-4 py-2 rounded-xl text-white shadow-lg transition-all duration-200 ${
          colorClasses[selectedPersonality.color as keyof typeof colorClasses]
        }`}
      >
        <div className="flex items-center space-x-2">
          <IconComponent className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold text-sm">{selectedPersonality.name}</div>
            <div className="text-xs opacity-90 max-w-40 truncate">
              {selectedPersonality.description}
            </div>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Choose Your AI Companion
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Each personality offers a unique conversation experience
              </p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {personalities.map((personality) => {
                const PersonalityIcon = personalityIcons[personality.id as keyof typeof personalityIcons] || Brain;
                const isSelected = personality.id === selectedPersonality.id;
                
                return (
                  <motion.button
                    key={personality.id}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => {
                      onPersonalityChange(personality);
                      setIsOpen(false);
                    }}
                    className={`cursor-pointer w-full p-4 text-left flex items-start space-x-3 border-l-4 transition-colors ${
                      isSelected
                        ? `${colorClasses[personality.color as keyof typeof colorClasses].split(' ')[0]} border-l-current`
                        : 'border-l-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : `${colorClasses[personality.color as keyof typeof colorClasses].split(' ')[0]} text-white`
                    }`}>
                      <PersonalityIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {personality.name}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        isSelected 
                          ? 'text-white/90' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {personality.description}
                      </p>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-white/80 mt-2 font-medium"
                        >
                          ✓ Currently Active
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
