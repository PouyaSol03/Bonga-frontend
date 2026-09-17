import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface SplashScreenProps {
  onFinish: () => void
  videoSrc?: string
}

export function SplashScreen({ onFinish, videoSrc = '/splash.mp4' }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isFinishedRef = useRef(false)

  const handleComplete = () => {
    if (isFinishedRef.current) return
    isFinishedRef.current = true
    setIsVisible(false)
  }

  const applySpeed = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.5
    }
  }

  useEffect(() => {
    applySpeed()

    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: if playback fails, dismiss gracefully
      })
    }

    // Safety timeout in case video loading hangs or is blocked (3.2s expected at 2.5x)
    const timeout = setTimeout(() => {
      handleComplete()
    }, 4500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && (
        <motion.div
          key="bonga-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary overflow-hidden select-none"
        >
          <div className="relative w-full h-full max-w-[500px] flex items-center justify-center bg-primary overflow-hidden">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={applySpeed}
              onPlay={applySpeed}
              onEnded={handleComplete}
              onError={handleComplete}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
