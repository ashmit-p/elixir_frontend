/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { Send, Loader2, User } from 'lucide-react';
// import Image from 'next/image';
// import { useSocket } from '@/lib/useSocket';
// import useUser from '@/lib/hooks/useUser';
// import { useParams, usePathname } from 'next/navigation';
// import { fetchChatHistory } from '@/lib/messages';
// import { Virtuoso } from 'react-virtuoso';
// import ProtectedRoute from './ProtectedRoute';
// import { motion, AnimatePresence} from 'framer-motion'
// import PersonalitySelector, { Personality } from './PersonalitySelector';

// const defaultPersonality: Personality = {
//   id: 'therapist',
//   name: 'Dr. Wellness',
//   description: 'A supportive AI therapist focused on mental health and emotional wellness',
//   avatar: '/bot-avatar.jpg',
//   color: 'emerald'
// };


// type Message = {
//   id: number | string;
//   user_id: string;
//   username: string;
//   content: string | { summary?: string; bullets?: string[]; steps?: string[]; note?: string };
//   inserted_at: string;
//   pending?: boolean; 
//   avatar_url?: string;
//   personality_id?: string;
//   role?: 'user' | 'assistant';
// };


// export default function ChatPage() {
//   const path = usePathname();
//   const isAIChat = path?.includes('/chat');
//   const isCommunityChat = path?.includes('/community');

//   const { user } = useUser();
  
//   const para = useParams().roomId;
//   const roomId = isAIChat && user ? `ai-${user.id}` : para;

//   const pathname = usePathname();

//   const socketRef = useSocket(user?.accessToken);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [hasMore, setHasMore] = useState(true); 
//   const [page, setPage] = useState(1); 
//   const [firstItemIndex, setFirstItemIndex] = useState(0);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [selectedPersonality, setSelectedPersonality] = useState<Personality>(defaultPersonality);

//   const headerText = isCommunityChat ? 'Community Chat' : '';

//   const fadeIn = {
//     initial: { opacity : 0, y : 20},
//     animate: { opacity : 1, y : 20},
//     exit: { opacity : 0, y : -20}
//   };

//   const handleReceive = useCallback((msg: Message) => {
//     const parsedMsg = { ...msg };

//     if ((isAIChat ? msg.role === 'assistant' : (parsedMsg.personality_id || parsedMsg.username === 'TherapistBot')) && typeof parsedMsg.content === 'string') {
//       try {
//         const json = JSON.parse(parsedMsg.content);
//         parsedMsg.content = json;
//       } catch {
//       }
//     }
//     setInput('');
//     setMessages((prev) => {
//       const newMessages = [...prev, parsedMsg];

//       const isFromUser = isAIChat 
//         ? msg.role === 'user' 
//         : msg.user_id === user?.id && !msg.personality_id;
//       if (isAIChat && isFromUser) {
//         const thinkingMessage: Message = {
//           id: 'pending-bot',
//           user_id: 'bot',
//           username: selectedPersonality.name,
//           content: '...',
//           inserted_at: new Date().toISOString(),
//           pending: true,
//           personality_id: selectedPersonality.id,
//         };
//         return [...newMessages, thinkingMessage];
//       }

//       if (isAIChat ? msg.role === 'assistant' : (msg.personality_id || msg.username === 'TherapistBot')) {
//         const withoutPending = prev.filter((m) => !m.pending);
//         return [...withoutPending, msg];
//       }

//       return newMessages;
//     });
//   }, [selectedPersonality.name, selectedPersonality.id, user?.id, isAIChat]);

//   useEffect(() => {
//     const socket = socketRef.current;
//     if (!socket || !roomId) return;

//     socket.emit('join_room', roomId);
//     socket.on('receive_message', handleReceive);

//     return () => {
//       socket.emit('leave_room', roomId); 
//       socket.off('receive_message', handleReceive);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [roomId, handleReceive]);

//   useEffect(() => {
//     const loadInitialMessages = async () => {
//       if (!roomId) return;
//       setLoading(true);
//       const initial = await fetchChatHistory(roomId as string, 1);
//       setMessages(initial);
//       setLoading(false);
//       setFirstItemIndex(0);
//     };

//     loadInitialMessages();
//   }, [roomId]);


//   const sendMessage = (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (!input.trim() || !user || !socketRef.current || !roomId) return;

//     const payload = {
//       room_id: roomId,
//       user_id: user.id,
//       username: user.username || 'Anonymous',
//       avatar_url: user.avatar_url || '',
//       message: input,
//       personality_id: selectedPersonality.id,
//     };

//     socketRef.current.emit('send_message', payload);

//   };

//   const resetChat = async () => {
//     if (!roomId || !user || !socketRef.current) return;

//     const confirm = window.confirm('Are you sure you want to reset the AI chat?');
//     if (!confirm) return;

//     socketRef.current.emit('reset_chat', roomId);

//     socketRef.current.once('chat_reset_success', () => {
//       setMessages([]);
//       setPage(1);
//       setHasMore(true);
//     });

//     socketRef.current.once('error', (err: string) => {
//       alert(err || 'Failed to reset chat');
//     });
//   };

//   return (
//     <ProtectedRoute>
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900"
//       >
//         <div className="flex-1 flex flex-col max-w-6xl mx-auto mt-8">
//           {/* Chat Container with Border */}
//           <div className="flex-1 flex flex-col border-2 border-purple-200/50 dark:border-purple-700/50 rounded-2xl overflow-hidden shadow-lg">

//           {/* Header */}
//           <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 flex w-full justify-between items-center bg-white dark:bg-gray-900 rounded-t-xl shadow-sm">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 max-md:hidden">
//                 {headerText}
//               </h1>
//               {isAIChat && (
//                 <PersonalitySelector
//                   selectedPersonality={selectedPersonality}
//                   onPersonalityChange={setSelectedPersonality}
//                 />
//               )}
//             </div>
//             {isAIChat && (
//               <div className="flex justify-end">
//                 <button
//                   onClick={resetChat}
//                   className="text-sm text-rose-400 cursor-pointer px-4 py-2 rounded-md transition-colors z-50"
//                 >
//                   Reset Chat
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Message List */}
//           <div className="flex-1 overflow-hidden">
//             <Virtuoso
//               data={messages}
//               followOutput
//               initialTopMostItemIndex={messages.length - 1}
//               overscan={200}
//               startReached={async () => {
//                 if (!hasMore || loading || !roomId) return;

//                 const nextPage = page + 1;
//                 setLoading(true);
//                 const olderMessages = await fetchChatHistory(roomId as string, nextPage);

//                 if (olderMessages.length === 0) {
//                   setHasMore(false);
//                 } else {
//                   setMessages((prev) => [...olderMessages, ...prev]);
//                   setFirstItemIndex((prevIndex) => prevIndex - olderMessages.length);
//                   setPage(nextPage);
//                 }

//                 setLoading(false);
//               }}
//               itemContent={(index, msg) => {
//                 const isCurrentUser = isAIChat 
//                   ? msg.role === 'user' 
//                   : msg.user_id === user?.id && !msg.personality_id && msg.username !== 'TherapistBot';
//                 const isBot = isAIChat 
//                   ? msg.role === 'assistant' 
//                   : msg.personality_id || msg.username === 'TherapistBot' || msg.user_id === process.env.BOT_ID;

//                 return (
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={msg.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                       className={`flex items-start px-6 py-2 space-x-4 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
//                     >
//                     <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white`}>
//                      {msg.avatar_url ? (
//                         <Image
//                           src={msg.avatar_url.trim()}
//                           alt={msg.username}
//                           width={40}
//                           height={40}
//                           className="rounded-full self-center"
//                         />
//                       ) : (
//                         <div className="bg-blue-500 h-full w-full flex items-center justify-center rounded-full text-white font-bold">
//                           {(msg.username?.[0] || '?').toUpperCase()}
//                         </div>
//                       )}
//                     </div>

//                     <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
//                       <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
//                       <div className={`rounded-xl px-4 py-3 shadow-md text-sm ${
//                         isCurrentUser 
//                           ? 'bg-emerald-500 text-white' 
//                           : msg.pending
//                             ? 'bg-emerald-100 text-emerald-700 italic dark:bg-emerald-900 dark:text-emerald-300'
//                             : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
//                         }`}>
//                          {msg.pending ? (
//                             `${selectedPersonality.name} is thinking...`
//                           ) : typeof msg.content === 'string' ? (
//                             msg.content
//                           ) : (
//                             <div className="space-y-2">
//                               {msg.content.summary && <p className="font-semibold">{msg.content.summary}</p>}

//                               {typeof msg.content === 'object' && Array.isArray(msg.content.bullets) && msg.content.bullets.length > 0 && (
//                                 <ul className="list-disc list-inside ml-2">
//                                   {msg.content.bullets.map((point, i) => (
//                                     <li key={i}>{point}</li>
//                                   ))}
//                                 </ul>
//                               )}

//                               {typeof msg.content === 'object' && Array.isArray(msg.content.steps) && msg.content.steps.length > 0 && (
//                                 <ol className="list-decimal list-inside ml-2">
//                                   {msg.content.steps.map((step, i) => (
//                                     <li key={i}>{step}</li>
//                                   ))}
//                                 </ol>
//                               )}

//                               {msg.content.note && (
//                                 <p className="italic text-gray-600 dark:text-gray-300 mt-2">{msg.content.note}</p>
//                               )}
//                             </div>
//                           )}
//                       </div>
//                       <span className="text-xs text-gray-400 mt-1">
//                         {new Date(msg.inserted_at).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </motion.div>
//                   </AnimatePresence>
//                 );
//               }}
//               components={{
//                 Header: isAIChat
//                   ? () => (
//                       <div className="flex items-start space-x-4 px-6 pt-6 pb-2">
//                         <div className="h-10 w-10 rounded-full flex items-center justify-center text-white">
//                           <Image 
//                             src={selectedPersonality.avatar} 
//                             alt={selectedPersonality.name} 
//                             height={45} 
//                             width={45} 
//                             className='rounded-full self-center' 
//                           />
//                         </div>
//                         <div className="flex-1 max-w-[75%] bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow">
//                           <p className="text-gray-800 dark:text-gray-100">
//                             Hey! I&apos;m {selectedPersonality.name}. {selectedPersonality.description.charAt(0).toLowerCase() + selectedPersonality.description.slice(1)}. How can I help you today?
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   : undefined,
//               }}
//               style={{ height: '100%' }}
//             />
//           </div>

//           {/* Message Input */}
//           <motion.form
//             initial={{ opacity : 0 }}
//             animate={{ opacity : 1 }}
//             onSubmit={sendMessage}
//             className="p-4 mb-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg"
//           >
//             <div className="flex space-x-4">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 placeholder={user ? 'Type your message...' : 'Log in to send messages'}
//                 className="flex-1 p-2 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/20 text-white"
//                 disabled={!user}
//               />
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="submit"
//                 disabled={loading || !input.trim() || !user}
//                 className="cursor-pointer px-3 py-2 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//               </motion.button>
//             </div>
//           </motion.form>
//           </div>
//         </div>
//       </motion.div>
//     </ProtectedRoute>
//   );
// }
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Send, Loader2, User, MoreVertical, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useSocket } from '@/lib/useSocket';
import useUser from '@/lib/hooks/useUser';
import { useParams, usePathname } from 'next/navigation';
import { fetchChatHistory } from '@/lib/messages';
import { Virtuoso } from 'react-virtuoso';
import ProtectedRoute from './ProtectedRoute';
import { motion, AnimatePresence} from 'framer-motion'
import PersonalitySelector, { Personality } from './PersonalitySelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const defaultPersonality: Personality = {
  id: 'therapist',
  name: 'Dr. Wellness',
  description: 'A supportive AI therapist focused on mental health and emotional wellness',
  avatar: '/bot-avatar.jpg',
  color: 'emerald'
};


type Message = {
  id: number | string;
  user_id: string;
  username: string;
  content: string | { summary?: string; bullets?: string[]; steps?: string[]; note?: string };
  inserted_at: string;
  pending?: boolean; 
  avatar_url?: string;
  personality_id?: string;
  role?: 'user' | 'assistant';
};


export default function ChatPage() {
  const path = usePathname();
  const isAIChat = path?.includes('/chat');
  const isCommunityChat = path?.includes('/community');

  const { user } = useUser();
  
  const para = useParams().roomId;
  const roomId = isAIChat && user ? `ai-${user.id}` : para;

  const pathname = usePathname();

  const socketRef = useSocket(user?.accessToken);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true); 
  const [page, setPage] = useState(1); 
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(defaultPersonality);

  const headerText = isCommunityChat ? 'Community Chat' : '';

  const fadeIn = {
    initial: { opacity : 0, y : 20},
    animate: { opacity : 1, y : 20},
    exit: { opacity : 0, y : -20}
  };

  const handleReceive = useCallback((msg: Message) => {
    const parsedMsg = { ...msg };

    if ((isAIChat ? msg.role === 'assistant' : (parsedMsg.personality_id || parsedMsg.username === 'TherapistBot')) && typeof parsedMsg.content === 'string') {
      try {
        const json = JSON.parse(parsedMsg.content);
        parsedMsg.content = json;
      } catch {
      }
    }
    setInput('');
    setMessages((prev) => {
      const newMessages = [...prev, parsedMsg];

      const isFromUser = isAIChat 
        ? msg.role === 'user' 
        : msg.user_id === user?.id && !msg.personality_id;
      if (isAIChat && isFromUser) {
        const thinkingMessage: Message = {
          id: 'pending-bot',
          user_id: 'bot',
          username: selectedPersonality.name,
          content: '...',
          inserted_at: new Date().toISOString(),
          pending: true,
          personality_id: selectedPersonality.id,
        };
        return [...newMessages, thinkingMessage];
      }

      if (isAIChat ? msg.role === 'assistant' : (msg.personality_id || msg.username === 'TherapistBot')) {
        const withoutPending = prev.filter((m) => !m.pending);
        return [...withoutPending, msg];
      }

      return newMessages;
    });
  }, [selectedPersonality.name, selectedPersonality.id, user?.id, isAIChat]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    socket.emit('join_room', roomId);
    socket.on('receive_message', handleReceive);

    return () => {
      socket.emit('leave_room', roomId); 
      socket.off('receive_message', handleReceive);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, handleReceive]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!roomId) return;
      setLoading(true);
      const initial = await fetchChatHistory(roomId as string, 1);
      setMessages(initial);
      setLoading(false);
      setFirstItemIndex(0);
    };

    loadInitialMessages();
  }, [roomId]);


  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !user || !socketRef.current || !roomId) return;

    const payload = {
      room_id: roomId,
      user_id: user.id,
      username: user.username || 'Anonymous',
      avatar_url: user.avatar_url || '',
      message: input,
      personality_id: selectedPersonality.id,
    };

    socketRef.current.emit('send_message', payload);

  };

  const resetChat = async () => {
    if (!roomId || !user || !socketRef.current) return;

    const confirm = window.confirm('Are you sure you want to reset the AI chat?');
    if (!confirm) return;

    socketRef.current.emit('reset_chat', roomId);

    socketRef.current.once('chat_reset_success', () => {
      setMessages([]);
      setPage(1);
      setHasMore(true);
    });

    socketRef.current.once('error', (err: string) => {
      alert(err || 'Failed to reset chat');
    });
  };

  return (
    <ProtectedRoute>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900"
      >
        <div className="flex-1 flex flex-col max-w-6xl mx-auto mt-8">
          {/* Chat Container with Border */}
          <div className="flex-1 flex flex-col border-2 border-purple-200/50 dark:border-purple-700/50 rounded-2xl overflow-hidden shadow-lg">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 flex w-full justify-between items-center bg-white dark:bg-gray-900 rounded-t-xl shadow-sm">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 max-md:hidden">
                {headerText}
              </h1>
              {isAIChat && (
                <div className="hidden md:block">
                  <PersonalitySelector
                    selectedPersonality={selectedPersonality}
                    onPersonalityChange={setSelectedPersonality}
                  />
                </div>
              )}
            </div>
            
            {isAIChat && (
              <div className="flex items-center space-x-2">
                {/* Mobile Dropdown */}
                <div className="md:hidden z-[9999]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-xl">
                      <DropdownMenuLabel className="text-center font-semibold text-gray-900 dark:text-gray-100 py-3">
                        AI Personality: {selectedPersonality.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                      
                      {/* Personality Options */}
                      {[
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
                      ].map((personality) => (
                        <DropdownMenuItem
                          key={personality.id}
                          onClick={() => setSelectedPersonality(personality)}
                          className={`cursor-pointer py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedPersonality.id === personality.id 
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                          }`}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className={`w-4 h-4 rounded-full shadow-sm ${
                              personality.color === 'emerald' ? 'bg-emerald-500' :
                              personality.color === 'blue' ? 'bg-blue-500' :
                              personality.color === 'orange' ? 'bg-orange-500' :
                              personality.color === 'purple' ? 'bg-purple-500' :
                              'bg-pink-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {personality.name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                {personality.description}
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                      <DropdownMenuItem 
                        onClick={resetChat}
                        className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 px-4 font-medium"
                      >
                        <RotateCcw className="w-4 h-4 mr-3" />
                        Reset Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop Reset Button */}
                <div className="hidden md:flex">
                  <button
                    onClick={resetChat}
                    className="text-sm text-rose-400 cursor-pointer px-4 py-2 rounded-md transition-colors z-50"
                  >
                    Reset Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-hidden">
            <Virtuoso
              data={messages}
              followOutput
              initialTopMostItemIndex={messages.length - 1}
              overscan={200}
              startReached={async () => {
                if (!hasMore || loading || !roomId) return;

                const nextPage = page + 1;
                setLoading(true);
                const olderMessages = await fetchChatHistory(roomId as string, nextPage);

                if (olderMessages.length === 0) {
                  setHasMore(false);
                } else {
                  setMessages((prev) => [...olderMessages, ...prev]);
                  setFirstItemIndex((prevIndex) => prevIndex - olderMessages.length);
                  setPage(nextPage);
                }

                setLoading(false);
              }}
              itemContent={(index, msg) => {
                const isCurrentUser = isAIChat 
                  ? msg.role === 'user' 
                  : msg.user_id === user?.id && !msg.personality_id && msg.username !== 'TherapistBot';
                const isBot = isAIChat 
                  ? msg.role === 'assistant' 
                  : msg.personality_id || msg.username === 'TherapistBot' || msg.user_id === process.env.BOT_ID;

                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start px-6 py-2 space-x-4 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white`}>
                     {msg.avatar_url ? (
                        <Image
                          src={msg.avatar_url.trim()}
                          alt={msg.username}
                          width={40}
                          height={40}
                          className="rounded-full self-center"
                        />
                      ) : (
                        <div className="bg-blue-500 h-full w-full flex items-center justify-center rounded-full text-white font-bold">
                          {(msg.username?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
                      <div className={`rounded-xl px-4 py-3 shadow-md text-sm ${
                        isCurrentUser 
                          ? 'bg-emerald-500 text-white' 
                          : msg.pending
                            ? 'bg-emerald-100 text-emerald-700 italic dark:bg-emerald-900 dark:text-emerald-300'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}>
                         {msg.pending ? (
                            `${selectedPersonality.name} is thinking...`
                          ) : typeof msg.content === 'string' ? (
                            msg.content
                          ) : (
                            <div className="space-y-2">
                              {msg.content.summary && <p className="font-semibold">{msg.content.summary}</p>}

                              {typeof msg.content === 'object' && Array.isArray(msg.content.bullets) && msg.content.bullets.length > 0 && (
                                <ul className="list-disc list-inside ml-2">
                                  {msg.content.bullets.map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              )}

                              {typeof msg.content === 'object' && Array.isArray(msg.content.steps) && msg.content.steps.length > 0 && (
                                <ol className="list-decimal list-inside ml-2">
                                  {msg.content.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              )}

                              {msg.content.note && (
                                <p className="italic text-gray-600 dark:text-gray-300 mt-2">{msg.content.note}</p>
                              )}
                            </div>
                          )}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(msg.inserted_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                  </AnimatePresence>
                );
              }}
              components={{
                Header: isAIChat
                  ? () => (
                      <div className="flex items-start space-x-4 px-6 pt-6 pb-2">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white">
                          <Image 
                            src={selectedPersonality.avatar} 
                            alt={selectedPersonality.name} 
                            height={45} 
                            width={45} 
                            className='rounded-full self-center' 
                          />
                        </div>
                        <div className="flex-1 max-w-[75%] bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow">
                          <p className="text-gray-800 dark:text-gray-100">
                            Hey! I&apos;m {selectedPersonality.name}. {selectedPersonality.description.charAt(0).toLowerCase() + selectedPersonality.description.slice(1)}. How can I help you today?
                          </p>
                        </div>
                      </div>
                    )
                  : undefined,
              }}
              style={{ height: '100%' }}
            />
          </div>

          {/* Message Input */}
          <motion.form
            initial={{ opacity : 0 }}
            animate={{ opacity : 1 }}
            onSubmit={sendMessage}
            className="p-4 mb-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={user ? 'Type your message...' : 'Log in to send messages'}
                className="flex-1 p-2 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/20 text-white"
                disabled={!user}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !input.trim() || !user}
                className="cursor-pointer px-3 py-2 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.form>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}


