"use client"

import { useState, useCallback } from "react"
import type { Song, SongSection, SongPlayback } from "@/types/song"

export function useSongPlayback() {
  const [currentPlayback, setCurrentPlayback] = useState<SongPlayback | null>(null)

  const startSong = useCallback((song: Song, sectionIndex = 0) => {
    setCurrentPlayback({
      songId: song.id,
      currentSectionIndex: sectionIndex,
      isPlaying: true,
    })

    // Broadcast to projection view
    const content = {
      type: "song" as const,
      content: song.sections[sectionIndex].content,
      reference: `${song.title} - ${getSectionLabel(song.sections[sectionIndex])}`,
      timestamp: Date.now(),
      songData: {
        songId: song.id,
        sectionIndex,
        totalSections: song.sections.length,
      },
    }

    localStorage.setItem("projection-content", JSON.stringify(content))
    window.dispatchEvent(new CustomEvent("projection-update", { detail: content }))
  }, [])

  const nextSection = useCallback(
    (song: Song) => {
      if (!currentPlayback || currentPlayback.songId !== song.id) return

      const nextIndex = currentPlayback.currentSectionIndex + 1
      if (nextIndex < song.sections.length) {
        startSong(song, nextIndex)
      }
    },
    [currentPlayback, startSong],
  )

  const previousSection = useCallback(
    (song: Song) => {
      if (!currentPlayback || currentPlayback.songId !== song.id) return

      const prevIndex = currentPlayback.currentSectionIndex - 1
      if (prevIndex >= 0) {
        startSong(song, prevIndex)
      }
    },
    [currentPlayback, startSong],
  )

  const goToSection = useCallback(
    (song: Song, sectionIndex: number) => {
      if (sectionIndex >= 0 && sectionIndex < song.sections.length) {
        startSong(song, sectionIndex)
      }
    },
    [startSong],
  )

  const stopSong = useCallback(() => {
    setCurrentPlayback(null)

    // Clear projection
    localStorage.removeItem("projection-content")
    window.dispatchEvent(new CustomEvent("projection-clear"))
  }, [])

  return {
    currentPlayback,
    startSong,
    nextSection,
    previousSection,
    goToSection,
    stopSong,
  }
}

function getSectionLabel(section: SongSection): string {
  const typeLabel = section.type.charAt(0).toUpperCase() + section.type.slice(1)
  return section.number ? `${typeLabel} ${section.number}` : typeLabel
}
