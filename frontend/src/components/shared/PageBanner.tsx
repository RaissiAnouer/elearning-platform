import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface PageBannerProps {
  title: string;
  subtitle: string;
  highlight?: string;
  tag?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, highlight, tag = "Votre avenir commence ici" }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/featured/?education,learning')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-700/90" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/20">
            <SparklesIcon className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium text-white">{tag}</span>
          </div>
          
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-white leading-tight">
            {highlight ? (
              <>
                {title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
                  {highlight}
                </span>
              </>
            ) : (
              title
            )}
          </h1>
          
          <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PageBanner;
