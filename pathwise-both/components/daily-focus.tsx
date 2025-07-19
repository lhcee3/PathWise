"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Save, X } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

export function DailyFocus() {
  const [focus, setFocus] = useLocalStorage("daily-focus", "")
  const [lastUpdateDate, setLastUpdateDate] = useLocalStorage("daily-focus-date", "")
  const [isEditing, setIsEditing] = useState(false)
  const [tempFocus, setTempFocus] = useState(focus)
  const { toast } = useToast()

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    if (lastUpdateDate !== today) {
      // Reset focus if it's a new day and not already empty
      if (focus !== "") {
        setFocus("")
        setTempFocus("")
        toast({
          title: "New Day, New Focus!",
          description: "Your daily focus has been reset.",
        })
      }
      setLastUpdateDate(today)
    }
  }, [focus, lastUpdateDate, setFocus, setLastUpdateDate, toast])

  const handleSave = () => {
    setFocus(tempFocus.trim())
    setIsEditing(false)
    toast({
      title: "Daily Focus Updated!",
      description: tempFocus.trim() ? `Your focus is: "${tempFocus.trim()}"` : "Daily focus cleared.",
    })
  }

  const handleCancel = () => {
    setTempFocus(focus)
    setIsEditing(false)
  }

  return (
    <Card className="w-full border-border shadow-md bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
          Daily Focus
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Daily Focus</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              placeholder="What's your main goal today?"
              value={tempFocus}
              onChange={(e) => setTempFocus(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              className="flex-1 border-input focus-visible:ring-ring bg-input text-foreground"
            />
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4" />
              <span className="sr-only">Save Focus</span>
            </Button>
            <Button variant="ghost" onClick={handleCancel} className="text-destructive hover:bg-destructive/20">
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel Edit</span>
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-base italic">{focus || "Set your main goal for today!"}</p>
        )}
      </CardContent>
    </Card>
  )
}
