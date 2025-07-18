export interface Task {
  id: string
  name: string
  completed: boolean
}

export interface Stream {
  id: string
  name: string
  tasks: Task[]
}
