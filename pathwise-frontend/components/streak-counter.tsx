"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { useMemo } from "react"

interface StreakCounterProps {
  markedDates: string[] // Array of dates in 'YYYY-MM-DD' format
}

export function StreakCounter({ markedDates }: StreakCounterProps) {
  const calculateCurrentStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0

    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    let currentStreak = 0
    const longestStreak = 0

    if (sortedDates.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const todayFormatted = today.toISOString().split("T")[0]
    const yesterdayFormatted = yesterday.toISOString().split("T")[0]

    // Check if today or yesterday is marked to start the streak check
    let startIndex = -1
    if (sortedDates.includes(todayFormatted)) {
      startIndex = sortedDates.indexOf(todayFormatted)
      currentStreak = 1
    } else if (sortedDates.includes(yesterdayFormatted)) {
      startIndex = sortedDates.indexOf(yesterdayFormatted)
      currentStreak = 1
    } else {
      // If neither today nor yesterday is marked, the current streak is 0
      return 0
    }

    // Iterate backwards from the relevant start index
    for (let i = startIndex - 1; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i])
      const currentDate = new Date(sortedDates[i + 1])

      // Set hours to 0 for accurate day comparison
      prevDate.setHours(0, 0, 0, 0)
      currentDate.setHours(0, 0, 0, 0)

      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
      } else {
        break // Streak broken
      }
    }

    return currentStreak
  }

  const currentStreak = useMemo(() => calculateCurrentStreak(markedDates), [markedDates])

  return (
    <Card className="w-full border-border shadow-md bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
          Current Streak
          <Flame className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-5xl font-bold text-primary">{currentStreak}</p>
        <p className="text-muted-foreground text-sm mt-1">days</p>
      </CardContent>
    </Card>
  )
}
