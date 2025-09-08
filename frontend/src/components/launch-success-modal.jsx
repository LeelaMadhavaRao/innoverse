import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LaunchSuccessModal = ({ isVisible, posterTitle, onClose }) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      const timer = setTimeout(() => {
        setShowFireworks(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const fireworkParticles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [1, 1, 0],
        x: [0, Math.random() * 400 - 200],
        y: [0, Math.random() * 400 - 200],
      }}
      transition={{
        duration: 2,
        delay: Math.random() * 1,
        ease: "easeOut"
      }}
      style={{
        left: '50%',
        top: '50%',
      }}
    />
  ));

  const sparkles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-2xl"
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 360],
        x: [0, Math.random() * 600 - 300],
        y: [0, Math.random() * 600 - 300],
      }}
      transition={{
        duration: 3,
        delay: Math.random() * 2,
        ease: "easeOut"
      }}
      style={{
        left: '50%',
        top: '50%',
      }}
    >
      ✨
    </motion.div>
  ));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center"
        >
          {/* Fireworks and Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {showFireworks && (
              <>
                {fireworkParticles}
                {sparkles}
                
                {/* Rainbow circles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`circle-${i}`}
                    className="absolute rounded-full border-4"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: 100 + i * 50,
                      height: 100 + i * 50,
                      marginLeft: -(50 + i * 25),
                      marginTop: -(50 + i * 25),
                      borderColor: `hsl(${i * 60}, 70%, 60%)`,
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 2, 0],
                      opacity: [1, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-10 text-center bg-gradient-to-br from-emerald-900/90 to-teal-900/90 backdrop-blur-md rounded-3xl p-12 max-w-md"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🚀
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Launch Successful!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-emerald-400 text-lg mb-6"
            >
              {posterTitle} is now live with spectacular effects!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="flex items-center justify-center gap-2 text-yellow-400"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchSuccessModal;
