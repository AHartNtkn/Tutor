import { Progress } from "@/components/ui/progress"

const subjects = [
  { name: "Algebra", progress: 65 },
  { name: "Geometry", progress: 40 },
  { name: "Calculus", progress: 20 },
]

export default function ProgressOverview() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Progress Overview</h2>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex justify-between mb-1">
              <span className="text-blue-300">{subject.name}</span>
              <span className="text-purple-300">{subject.progress}%</span>
            </div>
            <Progress value={subject.progress} className="w-full [&>div]:bg-purple-600" />
          </div>
        ))}
      </div>
    </div>
  )
}

