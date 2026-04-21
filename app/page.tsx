"use client"

import { FormEvent, useEffect, useState } from "react"
import { Notebook, Sun } from "lucide-react"
import { NoteCard, type Note } from "@/components/note-card"
import { NoteForm } from "@/components/note-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  userId: string
  email: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const fetchNotes = async () => {
    const res = await fetch("/api/notes")
    if (!res.ok) return
    const data = await res.json()
    setNotes(data.notes)
  }

  useEffect(() => {
    const initialize = async () => {
      const meRes = await fetch("/api/auth/me")
      const meData = await meRes.json()
      if (meData.user) {
        setUser(meData.user)
        await fetchNotes()
      }
      setLoading(false)
    }

    void initialize()
  }, [])

  const addNote = async (title: string, content: string, color: string) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, color }),
    })

    if (!res.ok) return
    const data = await res.json()
    setNotes((prev) => [data.note, ...prev])
  }

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" })
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const editNote = async (
    id: string,
    title: string,
    content: string,
    color: string
  ) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, color }),
    })

    if (!res.ok) return
    const data = await res.json()
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...data.note } : note))
    )
  }

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setAuthLoading(true)

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup"
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setAuthLoading(false)

    if (!res.ok) {
      setErrorMessage(data.message ?? "인증에 실패했습니다.")
      return
    }

    setUser(data.user)
    setEmail("")
    setPassword("")
    await fetchNotes()
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setNotes([])
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center text-muted-foreground">
        로딩 중...
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">밝은 메모</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {authMode === "login"
              ? "로그인해서 내 메모를 불러오세요."
              : "회원가입 후 바로 메모를 시작할 수 있어요."}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading
                ? "처리 중..."
                : authMode === "login"
                  ? "로그인"
                  : "회원가입"}
            </Button>
          </form>

          <button
            className="mt-4 text-sm text-primary hover:underline"
            onClick={() =>
              setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
            }
          >
            {authMode === "login"
              ? "계정이 없나요? 회원가입"
              : "이미 계정이 있나요? 로그인"}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Notebook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">밝은 메모</h1>
              <p className="text-xs text-muted-foreground">
                오늘도 좋은 하루 되세요!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>{notes.length}개의 메모</span>
            <span className="hidden sm:inline">| {user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Note Form */}
        <div className="mb-8">
          <NoteForm onAdd={addNote} />
        </div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={editNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Notebook className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              아직 메모가 없어요
            </h2>
            <p className="text-muted-foreground">
              위의 입력창에서 새로운 메모를 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
