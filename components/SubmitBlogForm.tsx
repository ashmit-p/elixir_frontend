'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase/client'
import { ChevronDown, PenTool, FileText, Eye, Sparkles, BookOpen, Send } from 'lucide-react'; 
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast';

export default function SubmitBlogForm(
  // { userId }: { userId: string }
) {
  const [title, setTitle] = useState('')
  const [showGuide, setShowGuide] = useState(false);
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // console.log("USERID", userId);

    const session = await supabase.auth.getSession();

    const res = await fetch('/api/blogs/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: JSON.stringify({ title, content, desc }),
    });
    setLoading(false)

    if (res.ok) {
      toast.success('Your blog has been submitted and will be published after review by moderators.');
      router.push('/blogs') 
    } else {
      const err = await res.json()
      toast.error(err.error || '❌ Submission failed.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto pt-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Share Your
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent ml-3">
                Story
              </span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create inspiring content that helps others on their mental health journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <FileText className="w-4 h-4" />
                    Blog Title
                  </label>
                  <Input
                    placeholder="Enter your blog title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/30 dark:border-slate-600/30 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Eye className="w-4 h-4" />
                    Description
                  </label>
                  <Textarea 
                    placeholder="Write a compelling description that draws readers in..."
                    rows={3}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    className="bg-white/50 dark:bg-slate-900/50 border-white/30 dark:border-slate-600/30 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Content Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <BookOpen className="w-4 h-4" />
                    Content
                  </label>
                  <Textarea
                    placeholder="Share your story, insights, or advice. Use Markdown for formatting..."
                    rows={12}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    className="bg-white/50 dark:bg-slate-900/50 border-white/30 dark:border-slate-600/30 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit Blog
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar - Markdown Guide */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-6 sticky top-6">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200/30 dark:border-purple-700/30 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Markdown Guide
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showGuide ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-purple-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        📝 Formatting Tips
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-white/60 dark:bg-slate-700/30 rounded-lg">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Headers</div>
                          <code className="text-purple-600 dark:text-purple-400 text-xs"># H1, ## H2, ### H3</code>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-slate-700/30 rounded-lg">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Emphasis</div>
                          <code className="text-purple-600 dark:text-purple-400 text-xs">**bold**, *italic*</code>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-slate-700/30 rounded-lg">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Lists</div>
                          <code className="text-purple-600 dark:text-purple-400 text-xs">- Item or * Item</code>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-slate-700/30 rounded-lg">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Links</div>
                          <code className="text-purple-600 dark:text-purple-400 text-xs">[text](url)</code>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-slate-700/30 rounded-lg">
                          <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Quotes</div>
                          <code className="text-purple-600 dark:text-purple-400 text-xs">&gt; Quote text</code>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
