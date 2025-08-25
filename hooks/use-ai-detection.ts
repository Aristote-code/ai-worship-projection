"use client"

import { useState, useEffect, useCallback } from "react"
import { useSongLibrary } from "@/hooks/use-song-library"
import { useBibleVersions } from "@/hooks/use-bible-versions"

interface AISuggestion {
  id: string
  type: "verse" | "song"
  content: string
  reference?: string
  confidence: number
  timestamp: Date
  songData?: {
    songId: string
    sectionIndex: number
    totalSections: number
  }
}

interface DetectionActivity {
  id: string
  text: string
  timestamp: Date
  detected: boolean
}

const MOCK_SPEECH_PATTERNS = [
  "Let's turn to John chapter 3 verse 16",
  "As it says in Jeremiah 29:11",
  "Romans 8:28 tells us that",
  "I want to read from Philippians 4:13",
  "The psalmist writes in Psalm 23",
  "We're going to sing Amazing Grace",
  "Let's worship with How Great Thou Art",
  "Our next song is 10,000 Reasons",
  "Let's continue with the next verse",
  "We'll sing the chorus again",
]

export function useAIDetection() {
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [detectionActivity, setDetectionActivity] = useState<DetectionActivity[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { songs, getSong } = useSongLibrary()
  const { selectedVersion, getVerse, searchVerses } = useBibleVersions()

  const generateSuggestion = useCallback(
    (detectedText: string): AISuggestion | null => {
      const versePatterns = [
        /john\s*3:?16/i,
        /jeremiah\s*29:?11/i,
        /romans\s*8:?28/i,
        /philippians\s*4:?13/i,
        /psalm\s*23:?1/i,
      ]

      const referenceMap: { [key: string]: string } = {
        john: "John 3:16",
        jeremiah: "Jeremiah 29:11",
        romans: "Romans 8:28",
        philippians: "Philippians 4:13",
        psalm: "Psalm 23:1",
      }

      for (const pattern of versePatterns) {
        if (pattern.test(detectedText)) {
          const bookName = Object.keys(referenceMap).find((book) => detectedText.toLowerCase().includes(book))

          if (bookName) {
            const reference = referenceMap[bookName]
            const verseContent = getVerse(reference)

            if (verseContent) {
              return {
                id: Math.random().toString(36).substr(2, 9),
                type: "verse",
                content: verseContent.content,
                reference: `${verseContent.reference} (${verseContent.version.abbreviation})`,
                confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
                timestamp: new Date(),
              }
            }
          }
        }
      }

      for (const song of songs) {
        const songName = song.title.toLowerCase()
        const textLower = detectedText.toLowerCase()

        if (textLower.includes(songName) || textLower.includes("sing") || textLower.includes("worship")) {
          const randomSectionIndex = Math.floor(Math.random() * song.sections.length)
          const section = song.sections[randomSectionIndex]

          const getSectionLabel = (sectionType: string, sectionNumber?: number): string => {
            const typeLabel = sectionType.charAt(0).toUpperCase() + sectionType.slice(1)
            return sectionNumber ? `${typeLabel} ${sectionNumber}` : typeLabel
          }

          return {
            id: Math.random().toString(36).substr(2, 9),
            type: "song",
            content: section.content,
            reference: `${song.title} - ${getSectionLabel(section.type, section.number)}`,
            confidence: Math.floor(Math.random() * 15) + 75, // 75-89% confidence
            timestamp: new Date(),
            songData: {
              songId: song.id,
              sectionIndex: randomSectionIndex,
              totalSections: song.sections.length,
            },
          }
        }
      }

      return null
    },
    [songs, getVerse],
  )

  const simulateDetection = useCallback(() => {
    if (!isListening) return

    setIsProcessing(true)

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
    selectedVersion,
  }
}
