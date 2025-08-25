"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, SkipForward, Volume2, Settings, ExternalLink, Trash2 } from "lucide-react"
import ProjectionPreview from "@/components/projection-preview"
import AIDetectionPanel from "@/components/ai-detection-panel"
import { useAIDetection } from "@/hooks/use-ai-detection"
import { useProjectionSync } from "@/hooks/use-projection-sync"

interface AISuggestion {
  id: string
  type: "verse" | "song"
  content: string
  reference?: string
  confidence: number
  timestamp: Date
}

export default function OperatorDashboard() {
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    isListening,
    suggestions,
    detectionActivity,
    isProcessing,
    startListening,
    stopListening,
    removeSuggestion,
    clearActivity,
  } = useAIDetection()

  const { currentContent, updateProjection, clearProjection } = useProjectionSync()

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    updateProjection({
      type: suggestion.type,
      content: suggestion.content,
      reference: suggestion.reference,
    })
    removeSuggestion(suggestion.id)
  }

  const handleRejectSuggestion = (suggestionId: string) => {
    removeSuggestion(suggestionId)
  }

  const handleClearProjection = () => {
    clearProjection()
  }

  const openProjectionView = () => {
    window.open("/projection", "_blank", "fullscreen=yes")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">SpiritCast AI</h1>
            <p className="text-muted-foreground mt-1">Worship Projection System</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="default" size="sm" onClick={openProjectionView}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Projection
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Control Panel */}
          <div className="lg:col-span-1">
            <AIDetectionPanel
              isListening={isListening}
              isProcessing={isProcessing}
              suggestions={suggestions}
              detectionActivity={detectionActivity}
              onStartListening={startListening}
              onStopListening={stopListening}
              onAcceptSuggestion={handleAcceptSuggestion}
              onRejectSuggestion={handleRejectSuggestion}
              onClearActivity={clearActivity}
            />
          </div>

          {/* Main Projection Control */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Current Projection</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Live</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClearProjection}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Projection Preview */}
                <div className="mb-6">
                  <ProjectionPreview content={currentContent} />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button variant="outline" size="sm">
                    <SkipForward className="w-4 h-4 rotate-180" />
                  </Button>
                  <Button size="sm" onClick={() => setIsPlaying(!isPlaying)} className="px-6">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() =>
                      updateProjection({
                        type: "verse",
                        content: "The Lord is my shepherd, I lack nothing.",
                        reference: "Psalm 23:1",
                      })
                    }
                  >
                    <span className="text-2xl">📖</span>
                    <span className="text-sm">Bible</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() =>
                      updateProjection({
                        type: "song",
                        content: "Amazing Grace, how sweet the sound\nThat saved a wretch like me",
                        reference: "Amazing Grace - Verse 1",
                      })
                    }
                  >
                    <span className="text-2xl">🎵</span>
                    <span className="text-sm">Songs</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() =>
                      updateProjection({
                        type: "announcement",
                        content: "Please join us for prayer",
                        reference: "Prayer Time",
                      })
                    }
                  >
                    <span className="text-2xl">🙏</span>
                    <span className="text-sm">Prayer</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() =>
                      updateProjection({
                        type: "announcement",
                        content: "Welcome to our service today!",
                        reference: "Welcome",
                      })
                    }
                  >
                    <span className="text-2xl">📝</span>
                    <span className="text-sm">Notes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
