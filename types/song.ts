export interface SongSection {
  id: string
  type: "verse" | "chorus" | "bridge" | "pre-chorus" | "outro" | "intro"
  number?: number
  content: string
}

export interface Song {
  id: string
  title: string
  artist?: string
  sections: SongSection[]
}

export interface SongPlayback {
  songId: string
  currentSectionIndex: number
  isPlaying: boolean
}
