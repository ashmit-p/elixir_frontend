'use client';

import React, { memo, useMemo } from 'react';
import { heroItems } from '@/lib/constants';
import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

// Memoize icon map to prevent recreation on every render
const iconMap = {
  individual: Heart,
  couples: Users,
  teen: Sparkles,
} as const;

// Memoize gradient styles to prevent recalculation
const gradientStyles = {
  individual: '#ff6b9d, #c44569',
  couples: '#4834d4, #686de0',
  teen: '#f8b500, #feca57',
} as const;

// Memoized card component to prevent unnecessary re-renders
const HeroCard = memo(({ item, index }: { item: typeof heroItems[0]; index: number }) => {
  const IconComponent = iconMap[item.slug as keyof typeof iconMap];
  const gradientStyle = gradientStyles[item.slug as keyof typeof gradientStyles];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className='w-full h-full'
    >
      <Link
        href={`/blogs/${item.slug}`}
        className="relative group overflow-hidden rounded-3xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300 h-[350px] md:h-[400px] block"
      >
        <div 
          className="absolute inset-0 opacity-90 group-hover:opacity-95 transition-opacity duration-200"
          style={{
            background: `linear-gradient(135deg, ${gradientStyle})`
          }}
        />
        
        <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <IconComponent className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold">
                {item.heading}
              </h3>
              <p className="text-lg opacity-90 font-medium">{item.subHeading}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Get Started</span>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

HeroCard.displayName = 'HeroCard';

const Hero = memo(() => {
  // Memoize feature badges to prevent re-creation
  const featureBadges = useMemo(() => [
    { icon: Heart, text: '24/7 AI Support', color: 'text-pink-500' },
    { icon: Users, text: 'Community Chat', color: 'text-blue-500' },
    { icon: Sparkles, text: 'Expert Articles', color: 'text-purple-500' },
  ], []);

  return (
     <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-12 pt-24">
          <motion.div 
            className="text-center space-y-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold montserrat-one text-slate-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                You{' '}
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  deserve
                </span>{' '}
                to be happy
              </motion.h1>
              <motion.p 
                className="text-xl md:text-3xl text-slate-600 dark:text-slate-300 montserrat-one font-light max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Find the support you need, tailored just for you
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-slate-500 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {featureBadges.map((badge, index) => (
                <span key={index} className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  {badge.text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {heroItems.map((item, i) => (
              <HeroCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;