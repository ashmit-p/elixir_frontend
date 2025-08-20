'use client';

import { Suspense, use } from 'react';
import { motion } from 'framer-motion';
import Blogs from '@/components/Blogs';
import SearchBlogs from '@/components/SearchBlogs';
import Link from 'next/link';
import { Pencil, BookOpen, Sparkles } from 'lucide-react';

const BlogsLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white/10 dark:bg-slate-800/50 h-32 rounded-2xl backdrop-blur-sm" />
    ))}
  </div>
);

export default function BlogList({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const search = resolvedSearchParams.search ?? '';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white montserrat-one">
              Blog
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent ml-3">
                Hub
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light">
            Discover insights, stories, and expert advice to support your journey
          </p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8 text-sm md:text-base text-slate-500 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Expert Articles
            </span>
            <span className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Community Stories
            </span>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Latest Articles
            </h2>
            {search && (
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Searching: &quot;{search}&quot;
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <SearchBlogs initialSearch={search} />
            <Link
              href="/blogs/submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Pencil className="w-4 h-4" />
              Write
            </Link>
          </div>
        </motion.div>

        {/* Blogs Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ zIndex: 100 }}
        >
          <Suspense fallback={<BlogsLoadingSkeleton />}>
            <Blogs search={search} />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
