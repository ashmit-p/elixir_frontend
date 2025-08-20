'use client';

import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Eye, ArrowRight, BookOpen } from 'lucide-react';
import LikeButton from './LikeButton';
import Pagination from './Pagination';
import useUser from '@/lib/hooks/useUser';
import { supabase } from '@/lib/supabase/client';

type Blog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  likes: number;
  views?: number;
  coverImage?: string;
  author?: string;
  readTime?: number;
};

const BlogCard = memo(({ 
  blog, 
  isLiked, 
  index,
  user 
}: { 
  blog: Blog; 
  isLiked: boolean; 
  index: number;
  user: { id: string; accessToken?: string } | null;
}) => {
  const formatDate = useMemo(() => {
    return new Date(blog.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [blog.created_at]);

  // Use readTime from API response if available, otherwise fallback to 1 minute
  const readTime = blog.readTime || 1;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2">
        <Link href={`/blogs/${blog.slug}`} className="block">
          {/* Cover Image or Gradient Header */}
          <div className="relative h-48 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden">
            {blog.coverImage ? (
              <Image 
                src={blog.coverImage} 
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 opacity-80" />
            )}
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute top-4 left-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                {readTime} min read
              </span>
            </div>
            
            {/* Floating icon */}
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {blog.description}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate}
                </span>
                {blog.views && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {blog.views}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-pink-500 group-hover:gap-3 transition-all duration-300">
                <span className="font-medium">Read more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>

        {/* Like Button */}
        {user && (
          <div className="px-6 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Heart  className="w-4 h-4" />
              <span className="text-sm">{blog.likes} likes</span>
            </div>
            <LikeButton
              blogId={blog.id}
              initialLiked={isLiked}
            />
          </div>
        )}
      </div>
    </motion.li>
  );
});

BlogCard.displayName = 'BlogCard';

// Loading skeleton component
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="bg-white/10 dark:bg-slate-800/20 rounded-2xl overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Empty state component
const EmptyState = memo(({ search }: { search: string }) => (
  <motion.div 
    className="text-center py-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl flex items-center justify-center">
      <BookOpen className="w-12 h-12 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
      {search ? 'No articles found' : 'No articles yet'}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
      {search 
        ? `No articles match your search for "${search}". Try different keywords.`
        : 'Be the first to share your story and insights with the community.'
      }
    </p>
    {!search && (
      <Link 
        href="/blogs/submit"
        className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
      >
        Write the first article
        <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </motion.div>
));

EmptyState.displayName = 'EmptyState';

export default memo(function Blogs({ search }: { search: string }) {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const { user } = useUser();

  const fetchBlogs = useCallback(async (page = 1, limit = 9) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const json = await res.json();
      setBlogs(json.blogs || []);
      setLikedIds(json.likedIds || []);
      
      // Update pagination state
      if (json.pagination) {
        setPagination(json.pagination);
      }
    } catch (e) {
      console.error('Error fetching blogs:', e);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [search, user?.accessToken]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchBlogs(page, pagination.limit);
    // Smooth scroll to top of blogs section
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }, [fetchBlogs, pagination.limit]);

  useEffect(() => {
    // Reset to page 1 when search changes
    fetchBlogs(1, 6);
  }, [fetchBlogs]);

  // Separate effect for fetching likes to avoid re-fetching blogs
  useEffect(() => {
    const fetchLikes = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('blog_likes')
        .select('blog_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setLikedIds(data.map((like) => like.blog_id));
      }
    };

    fetchLikes();
  }, [user?.id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!blogs || blogs.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.ul 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          key={pagination.page} // Key for smooth transitions between pages
        >
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              isLiked={likedIds.includes(blog.id)}
              index={index}
              user={user}
            />
          ))}
        </motion.ul>
      </AnimatePresence>

      {/* Pagination Component */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
      />
    </div>
  );
});
