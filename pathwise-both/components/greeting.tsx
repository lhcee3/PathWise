"use client" // Ensure this component is a client component

import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react" // Import useState and useEffect

export function Greeting() {
  const [greetingMessage, setGreetingMessage] = useState("Hello") // Initialize with a default

  useEffect(() => {
    const hour = new Date().getHours()
    let message = "Good evening"

    if (hour < 12) {
      message = "Good Morning"
    } else if (hour < 18) {
      message = "Good Afternoon"
    }
    setGreetingMessage(message)
  }, []) // Empty dependency array means this runs once after initial render

  return (
    <Card className="w-full border-border shadow-md text-center bg-card">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-card-foreground">{greetingMessage}, Learner!</h2>
        <p className="text-muted-foreground mt-2">Let's make today count.</p>
      </CardContent>
    </Card>
  )
}
