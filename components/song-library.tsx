"use client"

import { useState } from "react"
import { Search, Play, SkipForward, SkipBack, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSongLibrary } from "@/hooks/use-song-library"
import { useSongPlayback } from "@/hooks/use-song-playback"
import type { Song, SongSection } from "@/types/song"

export function SongLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const { songs, searchSongs } = useSongLibrary()
  const { currentPlayback, startSong, nextSection, previousSection, goToSection, stopSong } = useSongPlayback()

  const filteredSongs = searchSongs(searchQuery)

  const getSectionLabel = (section: SongSection): string => {
    const typeLabel = section.type.charAt(0).toUpperCase() + section.type.slice(1)
    return section.number ? `${typeLabel} ${section.number}` : typeLabel
  }

  const getSectionBadgeColor = (type: SongSection["type"]): string => {
    switch (type) {
      case "verse":
        return "bg-blue-100 text-blue-800"
      case "chorus":
        return "bg-green-100 text-green-800"
      case "bridge":
        return "bg-purple-100 text-purple-800"
      case "pre-chorus":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Song List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600">Song Library</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSongs.map((song) => (
              <Card
                key={song.id}
                className={`cursor-pointer transition-colors ${
                  selectedSong?.id === song.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedSong(song)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{song.title}</h4>
                      {song.artist && <p className="text-sm text-gray-600">{song.artist}</p>}
                      <p className="text-xs text-gray-500 mt-1">{song.sections.length} sections</p>
                    </div>
                    {currentPlayback?.songId === song.id && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Playing
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Song Details & Controls */}
        <div className="space-y-4">
          {selectedSong ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3>{selectedSong.title}</h3>
                      {selectedSong.artist && (
                        <p className="text-sm font-normal text-gray-600">{selectedSong.artist}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {currentPlayback?.songId === selectedSong.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => previousSection(selectedSong)}
                            disabled={currentPlayback.currentSectionIndex === 0}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => nextSection(selectedSong)}
                            disabled={currentPlayback.currentSectionIndex === selectedSong.sections.length - 1}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={stopSong}>
                            <Square className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => startSong(selectedSong)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedSong.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentPlayback?.songId === selectedSong.id && currentPlayback.currentSectionIndex === index
                            ? "bg-primary/10 border-primary"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => goToSection(selectedSong, index)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getSectionBadgeColor(section.type)}>{getSectionLabel(section)}</Badge>
                          {currentPlayback?.songId === selectedSong.id &&
                            currentPlayback.currentSectionIndex === index && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Current
                              </Badge>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <p>Select a song to view sections and controls</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
