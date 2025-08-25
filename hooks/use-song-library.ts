"use client"

import { useState, useCallback } from "react"
import type { Song } from "@/types/song"

// Mock song database with structured sections
const MOCK_SONG_LIBRARY: Song[] = [
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    artist: "John Newton",
    sections: [
      {
        id: "v1",
        type: "verse",
        number: 1,
        content:
          "Amazing Grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see",
      },
      {
        id: "v2",
        type: "verse",
        number: 2,
        content:
          "T'was Grace that taught my heart to fear\nAnd Grace, my fears relieved\nHow precious did that Grace appear\nThe hour I first believed",
      },
      {
        id: "v3",
        type: "verse",
        number: 3,
        content:
          "Through many dangers, toils and snares\nI have already come\n'Tis Grace that brought me safe thus far\nAnd Grace will lead me home",
      },
    ],
  },
  {
    id: "how-great-thou-art",
    title: "How Great Thou Art",
    artist: "Carl Boberg",
    sections: [
      {
        id: "v1",
        type: "verse",
        number: 1,
        content:
          "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made\nI see the stars, I hear the rolling thunder\nThy power throughout the universe displayed",
      },
      {
        id: "c1",
        type: "chorus",
        content:
          "Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art\nThen sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art",
      },
      {
        id: "v2",
        type: "verse",
        number: 2,
        content:
          "When through the woods, and forest glades I wander\nAnd hear the birds sing sweetly in the trees\nWhen I look down, from lofty mountain grandeur\nAnd see the brook, and feel the gentle breeze",
      },
    ],
  },
  {
    id: "10000-reasons",
    title: "10,000 Reasons (Bless the Lord)",
    artist: "Matt Redman",
    sections: [
      {
        id: "c1",
        type: "chorus",
        content:
          "Bless the Lord, O my soul\nO my soul, worship His holy name\nSing like never before, O my soul\nI'll worship Your holy name",
      },
      {
        id: "v1",
        type: "verse",
        number: 1,
        content:
          "The sun comes up, it's a new day dawning\nIt's time to sing Your song again\nWhatever may pass, and whatever lies before me\nLet me be singing when the evening comes",
      },
      {
        id: "v2",
        type: "verse",
        number: 2,
        content:
          "You're rich in love, and You're slow to anger\nYour name is great, and Your heart is kind\nFor all Your goodness I will keep on singing\nTen thousand reasons for my heart to find",
      },
    ],
  },
]

export function useSongLibrary() {
  const [songs] = useState<Song[]>(MOCK_SONG_LIBRARY)

  const getSong = useCallback(
    (songId: string): Song | undefined => {
      return songs.find((song) => song.id === songId)
    },
    [songs],
  )

  const searchSongs = useCallback(
    (query: string): Song[] => {
      if (!query.trim()) return songs

      const lowercaseQuery = query.toLowerCase()
      return songs.filter(
        (song) =>
          song.title.toLowerCase().includes(lowercaseQuery) || song.artist?.toLowerCase().includes(lowercaseQuery),
      )
    },
    [songs],
  )

  return {
    songs,
    getSong,
    searchSongs,
  }
}
