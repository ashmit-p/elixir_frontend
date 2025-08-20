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

## Technical Implementation

### Backend Changes

#### 1. Personalities Configuration (`ws-server/lib/ai/personalities.ts`)
- Centralized personality definitions with prompts, avatars, and metadata
- Type-safe personality management
- Default personality fallback system

#### 2. Enhanced Gemini AI Service (`ws-server/lib/ai/gemini.ts`)
- Updated to accept `personalityId` parameter
- Dynamic prompt selection based on personality
- Maintains backward compatibility

#### 3. Socket Handler Updates (`ws-server/socket.ts`)
- Added `personality_id` to ChatMessage interface
- Enhanced message handling to include personality context
- Updated bot responses to use personality-specific names and avatars

### Frontend Changes

#### 1. Personality Selector Component (`components/PersonalitySelector.tsx`)
- Dropdown interface for personality selection
- Visual indicators with colors and icons
- Animated transitions and hover effects
- Responsive design

#### 2. Enhanced Chat Component (`components/Chat.tsx`)
- Integrated personality selector in header
- Updated message handling for multiple personalities
- Dynamic bot name display using shared avatar
- Personality-aware welcome messages

#### 3. Avatar System
- All personalities use the same `/bot-avatar.jpg` image
- Simplified avatar management without dynamic generation
- Consistent visual representation across personalities

## Database Schema Considerations

The implementation assumes the following database schema updates (optional but recommended):

```sql
-- Add personality_id column to ai_messages table
ALTER TABLE ai_messages ADD COLUMN personality_id VARCHAR(50);

-- Create index for better query performance
CREATE INDEX idx_ai_messages_personality ON ai_messages(personality_id);

-- Add user preferences table (optional)
CREATE TABLE user_personality_preferences (
  user_id UUID REFERENCES auth.users(id),
  personality_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id)
);
```

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
ws-server/
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
cd ws-server
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
