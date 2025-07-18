"use client"

import { use, useState, useEffect } from "react" // Import 'use' from React
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, PlusCircle, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"

// Define types for our data structure
type Task = {
  id: string
  name: string
  completed: boolean
}

type Stream = {
  id: string
  name: string
  tasks: Task[]
}

export default function StreamPage({ params }: { params: Promise<{ id: string }> }) {
  // Update params type to Promise
  const { id } = use(params) // Unwrap the params Promise using React.use()

  const [streams, setStreams] = useLocalStorage<Stream[]>("task-streams", [])
  const [currentStream, setCurrentStream] = useState<Stream | null>(null)
  const [newTaskName, setNewTaskName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTaskName, setEditTaskName] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStreamName, setEditingStreamName] = useState(false)
  const [newStreamName, setNewStreamName] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  // Load current stream based on ID
  useEffect(() => {
    const stream = streams.find((s: Stream) => s.id === id) // Use the unwrapped 'id'
    if (stream) {
      setCurrentStream(stream)
      setNewStreamName(stream.name) // Initialize for editing
    } else {
      router.push("/") // Redirect if stream not found
    }
  }, [id, streams, router]) // Update dependency array to use 'id'

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Error",
        description: "Task name cannot be empty",
        variant: "destructive",
      })
      return
    }

    if (!currentStream) return

    const newTask: Task = {
      id: generateId(),
      name: newTaskName,
      completed: false,
    }

    const updatedStream = {
      ...currentStream,
      tasks: [...currentStream.tasks, newTask],
    }

    const updatedStreams = streams.map((stream) => (stream.id === currentStream.id ? updatedStream : stream))

    setStreams(updatedStreams)
    setCurrentStream(updatedStream)
    setNewTaskName("")
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: `Added new task: ${newTaskName}`,
    })
  }

  const handleEditTask = () => {
    if (!editTaskName.trim() || !editingTask || !currentStream) return

    const updatedTasks = currentStream.tasks.map((task) =>
      task.id === editingTask.id ? { ...task, name: editTaskName } : task,
    )

    const updatedStream = {
      ...currentStream,
      tasks: updatedTasks,
    }

    const updatedStreams = streams.map((stream) => (stream.id === currentStream.id ? updatedStream : stream))

    setStreams(updatedStreams)
    setCurrentStream(updatedStream)
    setEditingTask(null)
    setEditTaskName("")
    setIsEditDialogOpen(false)

    toast({
      title: "Success",
      description: "Task updated successfully",
    })
  }

  const handleDeleteTask = (taskId: string) => {
    if (!currentStream) return

    const updatedTasks = currentStream.tasks.filter((task) => task.id !== taskId)
    const updatedStream = {
      ...currentStream,
      tasks: updatedTasks,
    }

    const updatedStreams = streams.map((stream) => (stream.id === currentStream.id ? updatedStream : stream))

    setStreams(updatedStreams)
    setCurrentStream(updatedStream)

    toast({
      title: "Success",
      description: "Task deleted successfully",
    })
  }

  const handleToggleTask = (taskId: string) => {
    if (!currentStream) return

    const updatedTasks = currentStream.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )

    const updatedStream = {
      ...currentStream,
      tasks: updatedTasks,
    }

    const updatedStreams = streams.map((stream) => (stream.id === currentStream.id ? updatedStream : stream))

    setStreams(updatedStreams)
    setCurrentStream(updatedStream)
  }

  const handleUpdateStreamName = () => {
    if (!newStreamName.trim() || !currentStream) {
      toast({
        title: "Error",
        description: "Stream name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const updatedStream = {
      ...currentStream,
      name: newStreamName,
    }

    const updatedStreams = streams.map((stream) => (stream.id === currentStream.id ? updatedStream : stream))

    setStreams(updatedStreams)
    setCurrentStream(updatedStream)
    setEditingStreamName(false)

    toast({
      title: "Success",
      description: "Stream name updated successfully",
    })
  }

  if (!currentStream) {
    return <div className="container mx-auto py-8 text-foreground bg-background">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 bg-background text-foreground">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4 text-foreground hover:bg-muted">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          {editingStreamName ? (
            <div className="flex items-center gap-2">
              <Input
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateStreamName()
                  if (e.key === "Escape") setEditingStreamName(false)
                }}
                className="text-2xl font-bold h-12 border-input focus-visible:ring-ring bg-input text-foreground"
              />
              <Button
                onClick={handleUpdateStreamName}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Save Stream Name</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEditingStreamName(false)}
                className="text-destructive hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel Edit</span>
              </Button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold flex items-center text-foreground">
              {currentStream.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingStreamName(true)}
                className="ml-2 text-foreground hover:bg-muted"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Stream Name</span>
              </Button>
            </h1>
          )}

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground border-border">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Task name"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="border-input focus-visible:ring-ring bg-input text-foreground"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {currentStream.tasks.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg text-muted-foreground">
            <p>No tasks yet. Add your first task!</p>
          </div>
        ) : (
          currentStream.tasks.map((task) => (
            <Card key={task.id} className="border-border bg-card text-card-foreground">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <span
                      className={cn(
                        "text-lg",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {task.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTask(task)
                        setEditTaskName(task.name)
                        setIsEditDialogOpen(true)
                      }}
                      className="text-foreground hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Task</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Task</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Task name"
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
              className="border-input focus-visible:ring-ring bg-input text-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button onClick={handleEditTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
