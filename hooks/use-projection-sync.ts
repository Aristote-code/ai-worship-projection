"use client"

import { useState, useEffect, useCallback } from "react"

interface ProjectionContent {
  type: "verse" | "song" | "announcement" | "blank"
  content: string
  reference?: string
  timestamp?: number
}

const STORAGE_KEY = "spiritcast-projection-content"

export function useProjectionSync() {
  const [currentContent, setCurrentContent] = useState<ProjectionContent>({
    type: "blank",
    content: "",
  })

  // Listen for storage changes (real-time updates from operator dashboard)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newContent = JSON.parse(e.newValue) as ProjectionContent
          setCurrentContent(newContent)
        } catch (error) {
          console.error("Failed to parse projection content:", error)
        }
      }
    }

    // Listen for storage events from other windows/tabs
    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events in the same window (for testing)
    const handleCustomEvent = (e: CustomEvent<ProjectionContent>) => {
      setCurrentContent(e.detail)
    }

    window.addEventListener("projection-update" as any, handleCustomEvent)

    // Load initial content from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const content = JSON.parse(stored) as ProjectionContent
        setCurrentContent(content)
      }
    } catch (error) {
      console.error("Failed to load stored projection content:", error)
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("projection-update" as any, handleCustomEvent)
    }
  }, [])

  // Function to update projection content (used by operator dashboard)
  const updateProjection = useCallback((content: ProjectionContent) => {
    const contentWithTimestamp = {
      ...content,
      timestamp: Date.now(),
    }

    // Update localStorage (triggers storage event in other windows)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentWithTimestamp))

    // Also dispatch custom event for same window updates
    window.dispatchEvent(
      new CustomEvent("projection-update", {
        detail: contentWithTimestamp,
      }),
    )

    // Update local state
    setCurrentContent(contentWithTimestamp)
  }, [])

  // Function to clear projection
  const clearProjection = useCallback(() => {
    updateProjection({
      type: "blank",
      content: "",
    })
  }, [updateProjection])

  return {
    currentContent,
    updateProjection,
    clearProjection,
  }
}
