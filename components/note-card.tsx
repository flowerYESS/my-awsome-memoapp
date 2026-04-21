"use client"

import { useState } from "react"
import { Check, Pencil, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface Note {
  id: string
  title: string
  content: string
  color: string
  createdAt: Date | string
}

const colorClasses: Record<string, string> = {
  pink: "bg-pink-100 border-pink-200 hover:border-pink-300",
  blue: "bg-sky-100 border-sky-200 hover:border-sky-300",
  green: "bg-emerald-100 border-emerald-200 hover:border-emerald-300",
  yellow: "bg-amber-100 border-amber-200 hover:border-amber-300",
  purple: "bg-violet-100 border-violet-200 hover:border-violet-300",
}

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
  onEdit: (id: string, title: string, content: string, color: string) => Promise<void>
}

export function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  const createdAt = new Date(note.createdAt)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return
    setIsSaving(true)
    await onEdit(note.id, title.trim(), content.trim(), note.color)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        "group relative p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        colorClasses[note.color] || colorClasses.pink
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary/60" />
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목 없음"
              className="h-8 text-sm"
            />
          ) : (
            <h3 className="font-semibold text-foreground line-clamp-1">
              {note.title || "제목 없음"}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                onClick={handleSave}
                disabled={isSaving || (!title.trim() && !content.trim())}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">메모 저장</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">수정 취소</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">메모 수정</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(note.id)}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">메모 삭제</span>
          </Button>
        </div>
      </div>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용이 없습니다"
          className="mt-3 text-sm min-h-[110px] resize-none"
        />
      ) : (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
          {note.content || "내용이 없습니다"}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground/70">
        {createdAt.toLocaleDateString("ko-KR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}
