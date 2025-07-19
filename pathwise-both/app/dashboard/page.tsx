"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StreakCalendar } from "@/components/streak-calendar"
import { Greeting } from "@/components/greeting"
import { StreakCounter } from "@/components/streak-counter"
import { DailyFocus } from "@/components/daily-focus"
import { ProgressSummary } from "@/components/progress-summary"
import { useAuth } from "@/hooks/use-auth"
import { useStreams } from "@/hooks/use-streams"
import { useStreak } from "@/hooks/use-streak"
import { useState } from "react"

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { streams, loading: streamsLoading, createStream } = useStreams()
  const { markedDates, markDate } = useStreak()
  const [newStreamName, setNewStreamName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  const handleCreateStream = async () => {
    if (!newStreamName.trim()) return

    await createStream(newStreamName)
    setNewStreamName("")
    setIsDialogOpen(false)
  }

  const handleStreamClick = (streamId: string) => {
    router.push(`/stream/${streamId}`)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  if (authLoading || streamsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header with Sign Out */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Central Greeting */}
      <div className="mb-8">
        <Greeting />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">My Task Streams</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground border-border">
            <DialogHeader>
              <DialogTitle>Create New Stream</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Stream name"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                className="border-input focus-visible:ring-ring bg-input text-foreground"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateStream} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Daily Focus, Progress Summary, Streams */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <DailyFocus />
          <ProgressSummary streams={streams} />
          {streams.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No streams yet. Create your first stream to get started!</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Stream
                </Button>
              </CardContent>
            </Card>
          ) : (
            streams.map((stream) => (
              <Card
                key={stream.id}
                className="cursor-pointer border-border hover:border-primary transition-colors"
                onClick={() => handleStreamClick(stream.id)}
              >
                <CardHeader className="bg-card rounded-t-lg pb-2">
                  <CardTitle className="text-xl text-card-foreground">{stream.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground">{stream.tasks.length} tasks</p>
                  <div className="mt-2 space-y-1">
                    {stream.tasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="py-1 px-2 bg-muted rounded-md text-sm text-muted-foreground">
                        {task.name}
                      </div>
                    ))}
                    {stream.tasks.length > 2 && (
                      <div className="text-sm text-muted-foreground mt-1">+{stream.tasks.length - 2} more tasks</div>
                    )}
                    {stream.tasks.length === 0 && (
                      <div className="py-1 px-2 bg-muted rounded-md text-sm text-muted-foreground">No tasks yet</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-card rounded-b-lg pt-2">
                  <Button variant="link" className="w-full text-primary hover:text-primary/90">
                    View Tasks
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        {/* Right Column: Streak Counter, Calendar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StreakCounter markedDates={markedDates} />
          <StreakCalendar markedDates={markedDates} onMarkDate={markDate} />
        </div>
      </div>
    </div>
  )
}
