'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrev 
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous button */}
      <motion.button
        onClick={() => hasPrev && onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${hasPrev 
            ? 'bg-white/20 dark:bg-slate-800/50 hover:bg-white/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-105' 
            : 'bg-slate-200/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }
        `}
        whileHover={hasPrev ? { scale: 1.05 } : {}}
        whileTap={hasPrev ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <motion.div key={index}>
            {page === '...' ? (
              <div className="flex items-center justify-center w-10 h-10 text-slate-400 dark:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            ) : (
              <motion.button
                onClick={() => onPageChange(page as number)}
                className={`
                  w-10 h-10 rounded-lg transition-all duration-200 font-medium
                  ${currentPage === page
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/20 dark:bg-slate-800/50 hover:bg-white/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {page}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Next button */}
      <motion.button
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${hasNext 
            ? 'bg-white/20 dark:bg-slate-800/50 hover:bg-white/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-105' 
            : 'bg-slate-200/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }
        `}
        whileHover={hasNext ? { scale: 1.05 } : {}}
        whileTap={hasNext ? { scale: 0.95 } : {}}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
