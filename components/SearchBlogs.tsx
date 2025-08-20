"use client";

import React, { useState, useEffect, memo, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ListFilter, X, Search, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBlogsProps {
  initialSearch?: string;
}

const SearchBlogs = memo(({ initialSearch = '' }: SearchBlogsProps) => {
  const [inputVisible, setInputVisible] = useState(!!initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [sortVisible, setSortVisible] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const current = new URLSearchParams(Array.from(params.entries()));
      if (query.trim()) {
        current.set('search', query.trim());
      } else {
        current.delete('search');
      }
      router.push(`?${current.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, params, router]);

  const handleToggleSearch = useCallback(() => {
    setInputVisible(prev => !prev);
    if (inputVisible && query) {
      setQuery('');
    }
  }, [inputVisible, query]);

  const handleSort = useCallback((sortType: string) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    current.set('sort', sortType);
    router.push(`?${current.toString()}`);
    setSortVisible(false);
  }, [params, router]);

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {inputVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 dark:bg-slate-800/50 
                border border-white/20 dark:border-slate-700/50 backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white
                transition-all duration-200"
                placeholder="Search articles..."
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Toggle Button */}
      <motion.button 
        className="p-2.5 bg-white/20 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl 
        border border-white/20 dark:border-slate-700/50 
        hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200
        text-slate-700 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400"
        onClick={handleToggleSearch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={inputVisible ? "Close search" : "Open search"}
      >
        <AnimatePresence mode="wait">
          {inputVisible ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sort/Filter Dropdown */}
      <div className="relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-2.5 bg-white/20 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl 
                border border-white/20 dark:border-slate-700/50 
                hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200
                text-slate-700 dark:text-slate-300 hover:text-purple-500 dark:hover:text-purple-400"
                onClick={() => setSortVisible(!sortVisible)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Sort options"
                style={{zIndex: 9999}}
              >
                <ListFilter className="w-5 h-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="bg-black/80 text-white px-2 py-1 rounded-lg text-sm">
              <p>Sort & Filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AnimatePresence>
          {sortVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{zIndex: 9999}}
              className="absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-slate-800/90 
              backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 
              shadow-2xl z-[500] overflow-hidden"
            >
              <div className="p-2 space-y-1 ">
                <button
                  onClick={() => handleSort('newest')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150 text-slate-700 dark:text-slate-300"
                >
                  <SortDesc className="w-4 h-4" />
                  Newest First
                </button>
                <button
                  onClick={() => handleSort('oldest')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150 text-slate-700 dark:text-slate-300"
                >
                  <SortAsc className="w-4 h-4" />
                  Oldest First
                </button>
                <button
                  onClick={() => handleSort('popular')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-150 text-slate-700 dark:text-slate-300"
                >
                  <Calendar className="w-4 h-4" />
                  Most Popular
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

SearchBlogs.displayName = 'SearchBlogs';

export default SearchBlogs;