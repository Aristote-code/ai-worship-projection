"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useProjectionSync } from "@/hooks/use-projection-sync"

interface ProjectionContent {
  type: "verse" | "song" | "announcement" | "blank"
  content: string
  reference?: string
  timestamp?: number
  songData?: {
    songId: string
    sectionIndex: number
    totalSections: number
  }
}

export default function ProjectionView() {
  const { currentContent } = useProjectionSync()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayContent, setDisplayContent] = useState<ProjectionContent>(currentContent)

  // Handle content transitions with smooth animation
  useEffect(() => {
    if (currentContent.timestamp !== displayContent.timestamp) {
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setDisplayContent(currentContent)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [currentContent, displayContent.timestamp])

  const getBackgroundClass = () => {
    switch (displayContent.type) {
      case "verse":
        return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      case "song":
        return "bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900"
      case "announcement":
        return "bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900"
      default:
        return "bg-black"
    }
  }

  const getTextSizeClass = () => {
    if (displayContent.content.length > 200) return "text-4xl md:text-5xl lg:text-6xl"
    if (displayContent.content.length > 100) return "text-5xl md:text-6xl lg:text-7xl"
    return "text-6xl md:text-7xl lg:text-8xl"
  }

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-8 transition-all duration-500",
        getBackgroundClass(),
      )}
    >
      <div
        className={cn(
          "max-w-6xl mx-auto text-center transition-all duration-300",
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
        )}
      >
        {displayContent.type === "blank" ? (
          <div className="text-white/30 text-2xl font-serif">
            SpiritCast AI
            <div className="text-lg mt-2 font-sans">Ready for projection</div>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div
              className={cn(
                "text-white font-sans leading-relaxed mb-8",
                getTextSizeClass(),
                displayContent.type === "verse" && "font-medium",
                displayContent.type === "song" && "font-normal leading-tight",
              )}
            >
              {displayContent.content.split("\n").map((line, index) => (
                <div key={index} className="mb-2">
                  {line}
                </div>
              ))}
            </div>

            {/* Reference */}
            {displayContent.reference && (
              <div className="text-white/80 text-2xl md:text-3xl lg:text-4xl font-serif italic">
                {displayContent.reference}
              </div>
            )}

            {displayContent.type === "song" && displayContent.songData && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {Array.from({ length: displayContent.songData.totalSections }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        index === displayContent.songData!.sectionIndex
                          ? "bg-white scale-125"
                          : index < displayContent.songData!.sectionIndex
                            ? "bg-white/60"
                            : "bg-white/20",
                      )}
                    />
                  ))}
                </div>
                <div className="ml-4 text-white/60 text-lg">
                  {displayContent.songData.sectionIndex + 1} / {displayContent.songData.totalSections}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white/40 text-sm">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Connected</span>
      </div>

      {/* Subtle branding */}
      <div className="absolute bottom-4 right-4 text-white/20 text-sm font-sans">SpiritCast AI</div>
    </div>
  )
}
