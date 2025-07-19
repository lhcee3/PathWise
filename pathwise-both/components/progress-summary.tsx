import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListChecks } from "lucide-react"
import type { Stream } from "@/types"

interface ProgressSummaryProps {
  streams: Stream[]
}

export function ProgressSummary({ streams }: ProgressSummaryProps) {
  const totalTasks = streams.reduce((sum, stream) => sum + stream.tasks.length, 0)
  const completedTasks = streams.reduce((sum, stream) => sum + stream.tasks.filter((task) => task.completed).length, 0)

  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <Card className="w-full border-border shadow-md bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
          Overall Progress
          <ListChecks className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground">Tasks Completed:</p>
          <p className="text-foreground font-semibold">
            {completedTasks} / {totalTasks}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">{completionPercentage}% Completed</p>
      </CardContent>
    </Card>
  )
}
