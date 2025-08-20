'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BlogsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900'>
      <motion.div 
        className="container mx-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BlogsLayout;