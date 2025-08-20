'use client'

import { supabase } from '@/lib/supabase/client'
import useUser from '@/lib/hooks/useUser'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogOut, KeyRound, FileText, User, Mail } from 'lucide-react'
import AvatarUploader from '@/components/AvatarUploader'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) router.push('/login')
  }

  const handleResetPassword = async () => {
    if (!user) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error('Error resetting password:', error.message)
    } else {
      alert('Check your email for the password reset link')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-900/10 dark:to-pink-900/10 rounded-3xl"></div>
          
          {/* Avatar section with enhanced styling */}
          <motion.div 
            className="relative z-10 w-full flex justify-center items-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative">
              <AvatarUploader />
              {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div> */}
            </div>
          </motion.div>

          <motion.h1
            className="relative z-10 text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Your Profile
          </motion.h1>
          
          <motion.p
            className="relative z-10 text-center text-slate-600 dark:text-slate-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Manage your account and preferences
          </motion.p>

          {/* Enhanced User Info Cards */}
          <motion.div 
            className="relative z-10 space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <label className="text-sm font-semibold text-purple-600 dark:text-purple-400">Email Address</label>
              </div>
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200 ml-11">{user?.email}</p>
            </div>
            {user?.username && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <label className="text-sm font-semibold text-blue-600 dark:text-blue-400">Username</label>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 ml-11">{user.username}</p>
              </div>
            )}
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div 
            className="relative z-10 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              onClick={handleResetPassword}
              className="flex items-center gap-3 justify-center w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                <KeyRound className="w-3 h-3" />
              </div>
              Reset Password
            </motion.button>

            {user && (
              <Link href={`blogs/my-blogs/${user.username}`} passHref>
                <motion.button
                  className="flex items-center gap-3 justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                    <FileText className="w-3 h-3" />
                  </div>
                  Your Blogs
                </motion.button>
              </Link>
            )}

            <motion.button
              onClick={handleSignOut}
              className="mt-4 flex items-center gap-3 justify-center w-full px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                <LogOut className="w-3 h-3" />
              </div>
              Sign Out
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
