'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, MessageCircleHeart } from 'lucide-react';
import type { Variants } from 'framer-motion';

type Blog = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-72 w-full" />
);

const Offer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        setBlogs(json.blogs.slice(0, 3));
      } catch (e) {
        console.error('Error fetching blogs:', e);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Section Header */}
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight px-2">
          Support When You Need It —{' '}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Your Way
          </span>
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light px-2">
          Whether you&apos;re looking for expert guidance or a community that listens, we&apos;re here for you.
        </p>
      </motion.div>

      {/* Blog Cards */}
      <div className="max-w-7xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Latest Insights & Resources
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {loading
            ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            : blogs.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Link href={`/blogs/${blog.slug}`} className="block">
                    {blog.coverImage && (
                      <div className="relative overflow-hidden h-48 sm:h-56">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all duration-300">
                        <span className="text-sm sm:text-base">Read more</span>
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>

      <div className="overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {/* Community Chat */}
        <motion.div
          initial={{ opacity: 0, translateX: -50 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <MessageCircleHeart className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Join the Conversation</h3>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-md">
                Dive into our community chat and connect with people who care. Share your story, find support.
              </p>
            </div>
            <Link
              href="/community"
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              Join Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* AI Therapist */}
        <motion.div
          initial={{ opacity: 0, translateX: 50 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Bot className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Talk to Our AI Therapist</h3>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-md">
                Our AI-powered therapist is available 24/7 to listen and guide you through any challenge.
              </p>
            </div>
            <Link
              href="/chat"
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              Start Talking
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Offer;
