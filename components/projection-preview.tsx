"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ProjectionContent {
  type: "verse" | "song" | "announcement" | "blank"
  content: string
  reference?: string
  timestamp?: number
}

interface ProjectionPreviewProps {
  content: ProjectionContent
  className?: string
}

export default function ProjectionPreview({ content, className }: ProjectionPreviewProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayContent, setDisplayContent] = useState<ProjectionContent>(content)

  useEffect(() => {
    if (content.timestamp !== displayContent.timestamp) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayContent(content)
        setIsTransitioning(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [content, displayContent.timestamp])

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

  return (
    <div className={cn("aspect-video rounded-lg overflow-hidden", getBackgroundClass(), className)}>
      <div
        className={cn(
          "h-full flex items-center justify-center p-4 transition-all duration-200",
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
        )}
      >
        {displayContent.type === "blank" ? (
          <div className="text-white/30 text-sm text-center">
            <div className="font-serif">SpiritCast AI</div>
            <div className="text-xs mt-1">Ready for projection</div>
          </div>
        ) : (
          <div className="text-center max-w-full">
            {/* Main Content */}
            <div className="text-white text-xs leading-relaxed mb-2 font-sans">
              {displayContent.content.length > 100
                ? `${displayContent.content.substring(0, 100)}...`
                : displayContent.content}
            </div>

            {/* Reference */}
            {displayContent.reference && (
              <div className="text-white/80 text-xs font-serif italic">{displayContent.reference}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
