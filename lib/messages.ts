/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase/client';

// Define personalities locally to avoid server import issues
const personalities = {
  therapist: { name: 'Dr. Wellness' },
  mentor: { name: 'Alex Coach' },
  friend: { name: 'Sam Buddy' },
  scholar: { name: 'Prof. Insight' },
  creative: { name: 'Luna Arts' }
};

function getPersonalityName(personalityId: string | null): string {
  if (!personalityId) return 'TherapistBot';
  const personality = personalities[personalityId as keyof typeof personalities];
  return personality ? personality.name : 'TherapistBot';
}

export async function fetchChatHistory(roomId: string, page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const isAIChat = roomId.startsWith('ai-');

  const table = isAIChat ? 'ai_messages' : 'chat_messages';

  const { data, error } = await supabase
    .from(table)
    .select(isAIChat ? 'id, user_id, role, content, inserted_at, avatar_url, personality_id' : 'id, user_id, username, content, inserted_at, avatar_url')
    .eq('room_id', roomId)
    .order('inserted_at', { ascending: false }) 
    .range(from, to);

  //  const { data, error } = await supabase
  //   .from(table)
  //   .select(
  //     isAIChat
  //       ? 'id, user_id, role, content, inserted_at, users(username, avatar_url)'
  //       : 'id, user_id, content, inserted_at, users(username, avatar_url)'
  //   )
  //   .eq('room_id', roomId)
  //   .order('inserted_at', { ascending: false })
  //   .range(from, to);


  if (error) {
    console.error(`Error fetching ${table} history:`, error.message, error.details);
    return [];
  }

  const normalized = data.map((msg: any) => ({
    id: msg.id,
    user_id: msg.user_id,
    username: isAIChat ? (msg.role === 'assistant' ? getPersonalityName(msg.personality_id) : 'You') : msg.username,
    content: msg.content,
    // avatar_url: isAIChat
    //   ? msg.role === 'assistant'
    //     ? '/bot-avatar.jpg' 
    //     : msg.users?.avatar_url || ''
    //   : msg.users?.avatar_url || '',
    avatar_url: msg.avatar_url ?? undefined,
    personality_id: isAIChat ? msg.personality_id : undefined,
    role: isAIChat ? msg.role : undefined,
    inserted_at: msg.inserted_at,
  }));

  return normalized.reverse();
}
