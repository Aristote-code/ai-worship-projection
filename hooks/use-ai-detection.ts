"use client"

import { useState, useEffect, useCallback } from "react"

interface AISuggestion {
  id: string
  type: "verse" | "song"
  content: string
  reference?: string
  confidence: number
  timestamp: Date
}

interface DetectionActivity {
  id: string
  text: string
  timestamp: Date
  detected: boolean
}

// Mock Bible verses and songs database
const MOCK_BIBLE_VERSES = [
  {
    reference: "John 3:16",
    content:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
  {
    reference: "Jeremiah 29:11",
    content:
      'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.',
  },
  {
    reference: "Romans 8:28",
    content:
      "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
  },
  {
    reference: "Philippians 4:13",
    content: "I can do all this through him who gives me strength.",
  },
  {
    reference: "Psalm 23:1",
    content: "The Lord is my shepherd, I lack nothing.",
  },
]

const MOCK_SONGS = [
  {
    reference: "Amazing Grace - Verse 1",
    content:
      "Amazing Grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see",
  },
  {
    reference: "How Great Thou Art - Chorus",
    content:
      "Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art\nThen sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art",
  },
  {
    reference: "Blessed Be Your Name - Verse 1",
    content:
      "Blessed be Your name\nIn the land that is plentiful\nWhere Your streams of abundance flow\nBlessed be Your name",
  },
  {
    reference: "10,000 Reasons - Chorus",
    content:
      "Bless the Lord, O my soul\nO my soul, worship His holy name\nSing like never before, O my soul\nI'll worship Your holy name",
  },
]

const MOCK_SPEECH_PATTERNS = [
  "Let's turn to John chapter 3 verse 16",
  "As it says in Jeremiah 29:11",
  "Romans 8:28 tells us that",
  "I want to read from Philippians 4:13",
  "The psalmist writes in Psalm 23",
  "We're going to sing Amazing Grace",
  "Let's worship with How Great Thou Art",
  "Our next song is Blessed Be Your Name",
  "We'll close with 10,000 Reasons",
]

export function useAIDetection() {
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [detectionActivity, setDetectionActivity] = useState<DetectionActivity[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const generateSuggestion = useCallback((detectedText: string): AISuggestion | null => {
    // Simulate verse detection
    for (const verse of MOCK_BIBLE_VERSES) {
      const verseRef = verse.reference.toLowerCase()
      const textLower = detectedText.toLowerCase()

      if (
        textLower.includes(verseRef) ||
        textLower.includes(verseRef.replace(":", " ")) ||
        textLower.includes(verseRef.split(" ")[0])
      ) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          type: "verse",
          content: verse.content,
          reference: verse.reference,
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
          timestamp: new Date(),
        }
      }
    }

    // Simulate song detection
    for (const song of MOCK_SONGS) {
      const songName = song.reference.split(" - ")[0].toLowerCase()
      const textLower = detectedText.toLowerCase()

      if (textLower.includes(songName) || textLower.includes("sing") || textLower.includes("worship")) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          type: "song",
          content: song.content,
          reference: song.reference,
          confidence: Math.floor(Math.random() * 15) + 75, // 75-89% confidence
          timestamp: new Date(),
        }
      }
    }

    return null
  }, [])

  const simulateDetection = useCallback(() => {
    if (!isListening) return

    setIsProcessing(true)

    // Simulate speech recognition delay
    setTimeout(
      () => {
        const randomPattern = MOCK_SPEECH_PATTERNS[Math.floor(Math.random() * MOCK_SPEECH_PATTERNS.length)]
        const suggestion = generateSuggestion(randomPattern)

        const activity: DetectionActivity = {
          id: Math.random().toString(36).substr(2, 9),
          text: randomPattern,
          timestamp: new Date(),
          detected: suggestion !== null,
        }

        setDetectionActivity((prev) => [activity, ...prev.slice(0, 9)]) // Keep last 10 activities

        if (suggestion) {
          setSuggestions((prev) => {
            // Avoid duplicate suggestions
            const exists = prev.some((s) => s.reference === suggestion.reference)
            if (exists) return prev
            return [suggestion, ...prev.slice(0, 4)] // Keep max 5 suggestions
          })
        }

        setIsProcessing(false)
      },
      1000 + Math.random() * 2000,
    ) // 1-3 second delay
  }, [isListening, generateSuggestion])

  useEffect(() => {
    if (!isListening) return

    const interval = setInterval(
      () => {
        simulateDetection()
      },
      3000 + Math.random() * 7000,
    ) // Every 3-10 seconds

    return () => clearInterval(interval)
  }, [isListening, simulateDetection])

  const startListening = () => {
    setIsListening(true)
    setDetectionActivity([])
  }

  const stopListening = () => {
    setIsListening(false)
    setIsProcessing(false)
  }

  const removeSuggestion = (suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId))
  }

  const clearActivity = () => {
    setDetectionActivity([])
  }

  return {
    isListening,
    suggestions,
    detectionActivity,
    isProcessing,
    startListening,
    stopListening,
    removeSuggestion,
    clearActivity,
  }
}
