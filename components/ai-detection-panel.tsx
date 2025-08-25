"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Activity, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DetectionActivity {
  id: string
  text: string
  timestamp: Date
  detected: boolean
}

interface AISuggestion {
  id: string
  type: "verse" | "song"
  content: string
  reference?: string
  confidence: number
  timestamp: Date
}

interface AIDetectionPanelProps {
  isListening: boolean
  isProcessing: boolean
  suggestions: AISuggestion[]
  detectionActivity: DetectionActivity[]
  onStartListening: () => void
  onStopListening: () => void
  onAcceptSuggestion: (suggestion: AISuggestion) => void
  onRejectSuggestion: (suggestionId: string) => void
  onClearActivity: () => void
}

export default function AIDetectionPanel({
  isListening,
  isProcessing,
  suggestions,
  detectionActivity,
  onStartListening,
  onStopListening,
  onAcceptSuggestion,
  onRejectSuggestion,
  onClearActivity,
}: AIDetectionPanelProps) {
  return (
    <div className="space-y-6">
      {/* Listening Control */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            AI Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {isListening ? (
                <Mic className="w-5 h-5 text-primary animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <span className="font-medium block">{isListening ? "Listening for speech..." : "Not listening"}</span>
                {isProcessing && <span className="text-sm text-muted-foreground">Processing audio...</span>}
              </div>
            </div>
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              onClick={isListening ? onStopListening : onStartListening}
            >
              {isListening ? "Stop" : "Start"}
            </Button>
          </div>

          {/* Detection Activity */}
          {detectionActivity.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Recent Activity</h4>
                <Button variant="ghost" size="sm" onClick={onClearActivity}>
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {detectionActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-2 p-2 rounded-md bg-background border text-xs"
                    >
                      {activity.detected ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{activity.text}</p>
                        <p className="text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No suggestions yet. Start listening to get AI recommendations.
              </p>
            ) : (
              suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={suggestion.type === "verse" ? "default" : "secondary"}>
                        {suggestion.type === "verse" ? "Bible Verse" : "Song Lyrics"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{suggestion.reference}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{suggestion.content}</p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onAcceptSuggestion(suggestion)} className="flex-1">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onRejectSuggestion(suggestion.id)}>
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
