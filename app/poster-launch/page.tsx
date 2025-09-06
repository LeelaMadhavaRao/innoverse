"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

interface PosterConfig {
  title: string
  description: string
  imageUrl: string
  isLaunched: boolean
  launchDate?: Date
}

// Confetti component
const Confetti = ({ isActive }: { isActive: boolean }) => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => i)

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiPieces.map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-coral-400 to-coral-600 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
                x: Math.random() * window.innerWidth,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

export default function PosterLaunchPage() {
  const [posterConfig, setPosterConfig] = useState<PosterConfig | null>(null)
  const [showCurtains, setShowCurtains] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosterConfig()
  }, [])

  const fetchPosterConfig = async () => {
    try {
      const response = await fetch("/api/admin/poster-launch")
      if (response.ok) {
        const data = await response.json()
        setPosterConfig(data)

        // If poster is launched, automatically open curtains after a delay
        if (data?.isLaunched) {
          setTimeout(() => {
            setShowCurtains(false)
            setShowConfetti(true)
            // Stop confetti after 3 seconds
            setTimeout(() => setShowConfetti(false), 3000)
          }, 1000)
        }
      }
    } catch (error) {
      console.error("Failed to fetch poster config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReveal = () => {
    setShowCurtains(false)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading poster...</p>
        </div>
      </div>
    )
  }

  if (!posterConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Poster Not Found</h1>
          <p className="text-slate-300 mb-6">The poster configuration could not be loaded.</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="absolute top-6 left-6 z-40">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="relative">
          {/* Poster Container */}
          <motion.div
            className="relative w-80 h-96 md:w-96 md:h-[32rem] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Poster Image */}
            <img
              src={posterConfig.imageUrl || "/placeholder.svg"}
              alt={posterConfig.title}
              className="w-full h-full object-cover"
            />

            {/* Poster Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Poster Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <motion.h1
                className="text-2xl md:text-3xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {posterConfig.title}
              </motion.h1>
              <motion.p
                className="text-sm md:text-base opacity-90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {posterConfig.description}
              </motion.p>
            </div>

            {/* Curtains */}
            <AnimatePresence>
              {showCurtains && (
                <>
                  {/* Left Curtain */}
                  <motion.div
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-900 via-red-800 to-red-700 z-10"
                    initial={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-black/30" />
                  </motion.div>

                  {/* Right Curtain */}
                  <motion.div
                    className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-900 via-red-800 to-red-700 z-10"
                    initial={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent" />
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-l from-transparent to-black/30" />
                  </motion.div>

                  {/* Curtain Rod */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 z-20"
                    initial={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Launch Button */}
          {!posterConfig.isLaunched && showCurtains && (
            <motion.div
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Button
                onClick={handleReveal}
                size="lg"
                className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Reveal Poster
              </Button>
            </motion.div>
          )}

          {/* Status Message */}
          {posterConfig.isLaunched && !showCurtains && (
            <motion.div
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <p className="text-white text-lg font-semibold">🎉 Poster Launched Successfully!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confetti */}
      <Confetti isActive={showConfetti} />

      {/* Spotlight Effect */}
      {!showCurtains && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
        </motion.div>
      )}
    </div>
  )
}
