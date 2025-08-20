/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useUser from '@/lib/hooks/useUser';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Users, MessageCircle, Calendar, Crown, Sparkles, Hash } from 'lucide-react';

type Room = {
  id: string;
  name: string;
  created_at: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function RoomListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';

  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState('');
  const [inputValue, setInputValue] = useState(search);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setRooms(data);
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoom.trim() || !user) return;

    const { data, error } = await supabase.from('chat_rooms').insert([
      {
        name: newRoom,
        created_by: user.id
      }
    ]).select();

    if (data && data[0]) {
      setRooms(prevRooms => [...prevRooms, data[0]]);
      router.push(`/community/${data[0].id}`);
    }

    setNewRoom('');
    setIsCreating(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }

    router.push(`/community?${params.toString()}`);
  };

  const filteredRooms = search
    ? rooms.filter((room) => room.name.toLowerCase().includes(search))
    : rooms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 pt-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">
              Community
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent ml-3">
                Spaces
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light mb-8">
            Connect with others who understand your journey. Share experiences, find support, and build meaningful relationships.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2 bg-white/20 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 text-purple-500" />
              Safe Conversations
            </span>
            <span className="flex items-center gap-2 bg-white/20 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Crown className="w-4 h-4 text-pink-500" />
              Peer Support
            </span>
            <span className="flex items-center gap-2 bg-white/20 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Growth Together
            </span>
          </div>
        </motion.div>

        {/* Search and Create Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search community spaces..."
                value={inputValue}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
              />
            </div>

            {/* Create Button */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Create Space
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Community Spaces Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link href={`/community/${room.id}`}>
                  <div className="relative h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Gradient Header */}
                    <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Created {new Date(room.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Users className="w-3 h-3" />
                            Active
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <MessageCircle className="w-3 h-3" />
                            Chat
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg animate-pulse"></div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {search ? 'No spaces found' : 'No community spaces yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              {search 
                ? `No spaces match your search for "${search}". Try different keywords.`
                : 'Be the first to create a space where people can connect and support each other.'
              }
            </p>
            {!search && user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Create the first space
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Create Room Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setIsCreating(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-8 w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Create New Space
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Give your community space a meaningful name
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter space name..."
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
                    autoFocus
                  />
                  
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateRoom}
                      disabled={!newRoom.trim()}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      Create Space
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCreating(false)}
                      className="px-6 py-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-600/80"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}