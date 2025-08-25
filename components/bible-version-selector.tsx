"use client"

import { Check, ChevronDown, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { BibleVersion } from "@/types/bible"

interface BibleVersionSelectorProps {
  versions: BibleVersion[]
  selectedVersion: BibleVersion
  onVersionChange: (version: BibleVersion) => void
}

export default function BibleVersionSelector({
  versions,
  selectedVersion,
  onVersionChange,
}: BibleVersionSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span className="font-medium">{selectedVersion.abbreviation}</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">{selectedVersion.name}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        {versions.map((version) => (
          <DropdownMenuItem
            key={version.id}
            onClick={() => onVersionChange(version)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{version.abbreviation}</span>
                <span className="text-sm">{version.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{version.description}</span>
            </div>
            {selectedVersion.id === version.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
