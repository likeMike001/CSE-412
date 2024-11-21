
import React from 'react';
import { motion } from 'framer-motion';
import './animation.css';

const LoadingAnimation = () => {
  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="loading-text"
        initial={{ y: 50 }}
        animate={{ 
          y: 0,
          transition: {
            duration: 0.8,
            ease: "easeOut"
          }
        }}
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ 
            scale: 1,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }}
        >
          Movie Recommender
        </motion.h1>
        <motion.div 
          className="loading-bar"
          initial={{ width: 0 }}
          animate={{ 
            width: "100%",
            transition: {
              duration: 1.5,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingAnimation;


