import { motion } from 'framer-motion';
import Navigation from '../components/navigation';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

function Gallery() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              🚧
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4"
            >
              Gallery Coming Soon!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              We're working hard to bring you an amazing gallery experience with optimized image viewing and seamless uploads.
            </motion.p>

            {/* Features Preview */}
            <motion.div
              variants={fadeInUp}
              className="grid md:grid-cols-3 gap-6 mt-12 mb-12 max-w-3xl mx-auto"
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Loading</h3>
                <p className="text-gray-400 text-sm">Optimized images with CDN integration for lightning-fast loading</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-semibold text-white mb-2">Responsive Design</h3>
                <p className="text-gray-400 text-sm">Perfect viewing experience on all devices and screen sizes</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Upload</h3>
                <p className="text-gray-400 text-sm">Safe and secure image uploads with admin approval system</p>
              </div>
            </motion.div>

            {/* Sorry Message */}
            <motion.div
              variants={fadeInUp}
              className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className="text-2xl">🙏</span>
                <h3 className="text-xl font-semibold text-orange-400">Sorry for the Inconvenience</h3>
              </div>
              <p className="text-orange-200">
                This feature will be available in the next update. We appreciate your patience as we work to deliver the best possible experience!
              </p>
            </motion.div>

            {/* Update Timeline */}
            <motion.div
              variants={fadeInUp}
              className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 max-w-xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className="text-2xl">⏰</span>
                <h3 className="text-lg font-semibold text-purple-400">Expected Timeline</h3>
              </div>
              <p className="text-purple-200 mb-4">
                The gallery feature will be available in the next major update, coming very soon!
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">Development Progress: 75%</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link to="/" className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Back to Home</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800">
                <Link to="/#evaluation" className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>View Evaluation Criteria</span>
                </Link>
              </Button>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeInUp}
              className="text-center pt-12 border-t border-gray-700/50 max-w-2xl mx-auto"
            >
              <p className="text-gray-400 text-sm mb-2">
                Have questions or suggestions for the gallery feature?
              </p>
              <p className="text-purple-400 font-medium">
                Contact the Innoverse Team for updates and feedback!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
