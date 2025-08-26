# Multiple Personalities Chatbot Implementation

## Overview

This implementation adds multiple personalities to the chatbot, allowing users to interact with different AI companions, each with unique characteristics, conversation styles, and areas of expertise.

## Features

### 🤖 Available Personalities

1. **Dr. Wellness** (Therapist)
   - Focus: Mental health and emotional wellness
   - Style: Gentle, professional, and encouraging
   - Color: Emerald

2. **Alex Coach** (Mentor) 
   - Focus: Personal growth and goal achievement
   - Style: Energetic, positive, and empowering
   - Color: Blue

3. **Sam Buddy** (Friend)
   - Focus: Casual conversations and everyday support
   - Style: Warm, approachable, and conversational
   - Color: Orange

4. **Prof. Insight** (Scholar)
   - Focus: Learning, analysis, and deep discussions
   - Style: Scholarly yet approachable
   - Color: Purple

5. **Luna Arts** (Creative)
   - Focus: Artistic inspiration and imaginative exploration
   - Style: Inspiring, imaginative, and expressive
   - Color: Pink


## Usage

### For Users
1. Navigate to the chat interface
2. Click on the personality selector in the header
3. Choose your preferred AI companion
4. Start chatting with your selected personality
5. Reset chat to clear conversation history if needed

### For Developers

#### Adding New Personalities
1. Add personality definition to `personalities.ts`:
```typescript
newPersonality: {
  id: 'new_personality',
  name: 'Personality Name',
  description: 'Brief description',
  prompt: 'Detailed AI prompt...',
  avatar: '/bot-avatar.jpg',
  color: 'tailwind-color'
}
```

2. Update frontend personalities to match
3. Add corresponding icon in PersonalitySelector component

#### Customizing Prompts
Edit the `prompt` field in the personality configuration to modify AI behavior.

## File Structure

```
elixir-backend/
├── lib/ai/
│   ├── personalities.ts    # Personality definitions
│   └── gemini.ts          # AI service with personality support
└── socket.ts              # Socket handler with personality routing

app/
└── (routes)/(talk)/chat/
    └── page.tsx           # Chat page

components/
├── PersonalitySelector.tsx # Personality selection UI
└── Chat.tsx               # Main chat component
```

## Environment Setup

Ensure the following environment variables are set:

```env
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application

1. **Start the backend server:**
```bash
cd elixir-backend
npm run dev
```

2. **Start the frontend:**
```bash
npm run dev
```

3. Navigate to `http://localhost:3000/chat` to test the personalities feature.

## Future Enhancements

- **User Preferences**: Save user's preferred personality to database
- **Custom Personalities**: Allow users to create custom AI personalities
- **Personality Memory**: Maintain personality-specific conversation context
- **Analytics**: Track personality usage and popularity
- **Voice Integration**: Add personality-specific voice characteristics
- **Mood Detection**: Automatically suggest personalities based on user mood

## Troubleshooting

### Common Issues

1. **Personality not changing**: Check browser console for errors, ensure socket connection is active
2. **Message not showing personality**: Check that `personality_id` is included in socket payload
3. **Avatar not loading**: Ensure `/bot-avatar.jpg` exists in the public directory

### Debug Mode
Enable debug logging by adding to socket handler:
```typescript
console.log('Selected personality:', personality.id, personality.name);
```

