'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Heart, Users, Brain, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'Your conversations are completely confidential and secure. We prioritize your privacy above all else.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Get support whenever you need it. Our AI therapist is always here, day or night.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Every interaction is tailored to your unique needs and emotional state.',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others who understand your journey in our supportive community.',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: Brain,
      title: 'Evidence-Based',
      description: 'Our AI is trained on proven therapeutic techniques and psychological principles.',
      color: 'from-indigo-400 to-blue-500'
    },
    {
      icon: Sparkles,
      title: 'Multiple Personalities',
      description: 'Choose from different AI personalities to find the perfect therapeutic match for you.',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;ve built a comprehensive support system designed with your mental health and wellbeing in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 hover:-translate-y-2"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-200 dark:group-hover:border-purple-800 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
