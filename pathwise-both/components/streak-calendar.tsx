"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface StreakCalendarProps {
  markedDates: string[] // Array of dates in 'YYYY-MM-DD' format
  onMarkDate: (date: string) => void
}

export function StreakCalendar({ markedDates, onMarkDate }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const { toast } = useToast()

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay() // 0 for Sunday, 1 for Monday

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const calendarDays = useMemo(() => {
    const numDays = daysInMonth(currentMonth, currentYear)
    const startDay = firstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Add empty placeholders for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Add actual days
    for (let i = 1; i <= numDays; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
      days.push({ day: i, date: formattedDate, isMarked: markedDates.includes(formattedDate) })
    }
    return days
  }, [currentMonth, currentYear, markedDates])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1)
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1)
  }

  const handleMarkToday = () => {
    const today = new Date()
    const todayFormatted = today.toISOString().split("T")[0]
    if (!markedDates.includes(todayFormatted)) {
      onMarkDate(todayFormatted)
      toast({
        title: "Streak Marked!",
        description: "Today's consistency has been recorded.",
      })
    } else {
      toast({
        title: "Already Marked",
        description: "Today's streak is already recorded.",
        variant: "default",
      })
    }
  }

  return (
    <Card className="w-full max-w-md border-orange-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg pb-2">
        <CardTitle className="text-xl text-center">Consistency Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-orange-700 hover:bg-orange-100">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-orange-700 hover:bg-orange-100">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {dayNames.map((day) => (
            <div key={day} className="font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {calendarDays.map((dayInfo, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full",
                dayInfo && "text-foreground",
                dayInfo?.isMarked && "bg-primary text-primary-foreground font-bold",
                !dayInfo && "opacity-0 cursor-default",
              )}
            >
              {dayInfo?.day}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button onClick={handleMarkToday} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Mark Today's Streak
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
