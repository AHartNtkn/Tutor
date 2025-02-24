import { Button } from "@/components/ui/button"

export default function TopBar() {
  return (
    <header className="bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-lg font-semibold text-purple-300">Learning App</div>
        <div className="flex items-center space-x-4">
          <div className="text-blue-300">User: John Doe</div>
          <Button
            variant="outline"
            size="sm"
            className="text-purple-300 border-purple-300 hover:bg-purple-800 bg-gray-800"
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-purple-300 border-purple-300 hover:bg-purple-800 bg-gray-800"
          >
            Export
          </Button>
        </div>
      </div>
    </header>
  )
}

