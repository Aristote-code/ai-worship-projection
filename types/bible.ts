export interface BibleVersion {
  id: string
  name: string
  abbreviation: string
  language: string
  description: string
}

export interface BibleVerse {
  reference: string
  versions: {
    [versionId: string]: string
  }
}

export interface VerseContent {
  reference: string
  content: string
  version: BibleVersion
}
