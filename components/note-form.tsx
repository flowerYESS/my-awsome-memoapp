"use client"

import { useState } from "react"
import { Plus, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const colors = [
  { name: "pink", class: "bg-pink-300 hover:bg-pink-400" },
  { name: "blue", class: "bg-sky-300 hover:bg-sky-400" },
  { name: "green", class: "bg-emerald-300 hover:bg-emerald-400" },
  { name: "yellow", class: "bg-amber-300 hover:bg-amber-400" },
  { name: "purple", class: "bg-violet-300 hover:bg-violet-400" },
]

interface NoteFormProps {
  onAdd: (title: string, content: string, color: string) => void
}

export function NoteForm({ onAdd }: NoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedColor, setSelectedColor] = useState("pink")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = () => {
    if (title.trim() || content.trim()) {
      onAdd(title.trim(), content.trim(), selectedColor)
      setTitle("")
      setContent("")
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border-2 border-border shadow-sm transition-all duration-300",
        isExpanded && "shadow-lg border-primary/30"
      )}
    >
      <div className="p-4">
        {isExpanded && (
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent text-lg font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 mb-2"
          />
        )}
        <Textarea
          placeholder="새로운 메모를 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "border-0 bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 resize-none",
            isExpanded ? "min-h-[100px]" : "min-h-[50px]"
          )}
        />
      </div>

      {isExpanded && (
        <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1.5">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-all",
                    color.class,
                    selectedColor === color.name &&
                      "ring-2 ring-offset-2 ring-foreground/30"
                  )}
                  aria-label={`${color.name} 색상 선택`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setTitle("")
                setContent("")
              }}
              className="text-muted-foreground"
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!title.trim() && !content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
