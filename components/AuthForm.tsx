/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

 const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (type === 'signup') {
      if (!username.trim()) {
        setError('Username is required')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    let data, error

    if (type === 'login') {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }))
    } else {
      ({ data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      }))
      alert('We have sent you a confirmation email')
      router.push("/login")
    }

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      alert('Check your email for the password reset link')
    }
  }

   return (
    <div className='min-h-screen pt-24 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center p-4'>
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {type === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {type === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Join our community for mental wellness support'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
            {type === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
              />
            </div>
            
            {type === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-600/30 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {type === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Forgot Password */}
            {type === 'login' && (
              <button 
                type="button"
                onClick={handleResetPassword}
                className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
              >
                Forgot your password?
              </button>
            )}

            {/* Switch Form Link */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  href={type === 'login' ? '/sign-up' : '/login'} 
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  {type === 'login' ? 'Sign up' : 'Sign in'}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
