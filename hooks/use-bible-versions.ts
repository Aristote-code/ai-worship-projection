"use client"

import { useState, useCallback } from "react"
import type { BibleVersion, BibleVerse, VerseContent } from "@/types/bible"

// Available Bible versions
const BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: "niv",
    name: "New International Version",
    abbreviation: "NIV",
    language: "English",
    description: "Contemporary English translation",
  },
  {
    id: "esv",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "English",
    description: "Literal translation with modern English",
  },
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    description: "Traditional English translation",
  },
  {
    id: "nasb",
    name: "New American Standard Bible",
    abbreviation: "NASB",
    language: "English",
    description: "Highly literal translation",
  },
  {
    id: "nlt",
    name: "New Living Translation",
    abbreviation: "NLT",
    language: "English",
    description: "Thought-for-thought translation",
  },
]

// Mock Bible verses with multiple versions
const BIBLE_VERSES: BibleVerse[] = [
  {
    reference: "John 3:16",
    versions: {
      niv: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      esv: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      kjv: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      nasb: "For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish, but have eternal life.",
      nlt: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
    },
  },
  {
    reference: "Jeremiah 29:11",
    versions: {
      niv: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.',
      esv: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
      kjv: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.",
      nasb: "For I know the plans that I have for you,' declares the Lord, 'plans for welfare and not for calamity to give you a future and a hope.",
      nlt: 'For I know the plans I have for you," says the Lord. "They are plans for good and not for disaster, to give you a future and a hope.',
    },
  },
  {
    reference: "Romans 8:28",
    versions: {
      niv: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      esv: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
      kjv: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      nasb: "And we know that God causes all things to work together for good to those who love God, to those who are called according to His purpose.",
      nlt: "And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.",
    },
  },
  {
    reference: "Philippians 4:13",
    versions: {
      niv: "I can do all this through him who gives me strength.",
      esv: "I can do all things through him who strengthens me.",
      kjv: "I can do all things through Christ which strengtheneth me.",
      nasb: "I can do all things through Him who strengthens me.",
      nlt: "For I can do everything through Christ, who gives me strength.",
    },
  },
  {
    reference: "Psalm 23:1",
    versions: {
      niv: "The Lord is my shepherd, I lack nothing.",
      esv: "The Lord is my shepherd; I shall not want.",
      kjv: "The Lord is my shepherd; I shall not want.",
      nasb: "The Lord is my shepherd, I shall not want.",
      nlt: "The Lord is my shepherd; I have all that I need.",
    },
  },
]

export function useBibleVersions() {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>(BIBLE_VERSIONS[0]) // Default to NIV

  const getVerse = useCallback(
    (reference: string, versionId?: string): VerseContent | null => {
      const verse = BIBLE_VERSES.find((v) => v.reference === reference)
      if (!verse) return null

      const targetVersionId = versionId || selectedVersion.id
      const content = verse.versions[targetVersionId]
      const version = BIBLE_VERSIONS.find((v) => v.id === targetVersionId)

      if (!content || !version) return null

      return {
        reference,
        content,
        version,
      }
    },
    [selectedVersion],
  )

  const getAllVerses = useCallback(
    (versionId?: string): VerseContent[] => {
      const targetVersionId = versionId || selectedVersion.id
      const version = BIBLE_VERSIONS.find((v) => v.id === targetVersionId)

      if (!version) return []

      return BIBLE_VERSES.map((verse) => ({
        reference: verse.reference,
        content: verse.versions[targetVersionId] || "",
        version,
      })).filter((v) => v.content)
    },
    [selectedVersion],
  )

  const searchVerses = useCallback(
    (query: string, versionId?: string): VerseContent[] => {
      const targetVersionId = versionId || selectedVersion.id
      const version = BIBLE_VERSIONS.find((v) => v.id === targetVersionId)

      if (!version) return []

      const queryLower = query.toLowerCase()

      return BIBLE_VERSES.filter((verse) => {
        const content = verse.versions[targetVersionId]
        return (
          content && (verse.reference.toLowerCase().includes(queryLower) || content.toLowerCase().includes(queryLower))
        )
      }).map((verse) => ({
        reference: verse.reference,
        content: verse.versions[targetVersionId],
        version,
      }))
    },
    [selectedVersion],
  )

  return {
    versions: BIBLE_VERSIONS,
    selectedVersion,
    setSelectedVersion,
    getVerse,
    getAllVerses,
    searchVerses,
  }
}
