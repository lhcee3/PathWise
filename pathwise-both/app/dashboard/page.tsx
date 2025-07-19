"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { generateId } from "@/lib/utils"
import type { Stream } from "@/types"
import { StreakCalendar } from "@/components/streak-calendar"
import { Greeting } from "@/components/greeting"
import { StreakCounter } from "@/components/streak-counter"
import { DailyFocus } from "@/components/daily-focus"
import { ProgressSummary } from "@/components/progress-summary"

export default function Dashboard() {
  const [streams, setStreams] = useLocalStorage<Stream[]>("task-streams", [
    {
      id: generateId(),
      name: "Web Development",
      tasks: [
        { id: generateId(), name: "Learn React", completed: false },
        { id: generateId(), name: "Build portfolio", completed: false },
      ],
    },
    {
      id: generateId(),
      name: "UI/UX",
      tasks: [
        { id: generateId(), name: "Study color theory", completed: false },
        { id: generateId(), name: "Practice in Figma", completed: false },
      ],
    },
  ])
  const [markedDates, setMarkedDates] = useLocalStorage<string[]>("streak-dates", [])
  const [newStreamName, setNewStreamName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateStream = () => {
    if (!newStreamName.trim()) {
      toast({
        title: "Error",
        description: "Stream name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const newStream: Stream = {
      id: generateId(),
      name: newStreamName,
      tasks: [],
    }

    setStreams([...streams, newStream])
    setNewStreamName("")
    setIsDialogOpen(false)

    toast({
      title: "Success",
      description: `Created new stream: ${newStreamName}`,
    })
  }

  const handleStreamClick = (streamId: string) => {
    router.push(`/stream/${streamId}`)
  }

  const handleMarkDate = (date: string) => {
    setMarkedDates((prevDates) => {
      if (!prevDates.includes(date)) {
        return [...prevDates, date]
      }
      return prevDates
    })
  }

  return (
    <div className="container mx-auto py-8">
      {/* Central Greeting */}
      <div className="mb-8">
        <Greeting />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Task Streams</h1>
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
          {streams.map((stream) => (
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
          ))}
        </div>
        {/* Right Column: Streak Counter, Calendar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StreakCounter markedDates={markedDates} />
          <StreakCalendar markedDates={markedDates} onMarkDate={handleMarkDate} />
        </div>
      </div>
    </div>
  )
}
