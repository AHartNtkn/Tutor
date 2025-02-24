import Link from "next/link"
import { Button } from "@/components/ui/button"

const reviews = [
  { id: 1, title: "Quadratic Equations Review", urgency: "High" },
  { id: 2, title: "Pythagorean Theorem Review", urgency: "Medium" },
  { id: 3, title: "Linear Functions Review", urgency: "Low" },
]

const lessons = [
  { id: 1, title: "Introduction to Trigonometry" },
  { id: 2, title: "Solving Systems of Equations" },
]

export default function ReviewsAndLessons() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Pending Reviews</h2>
        <ul className="space-y-2">
          {reviews.map((review) => (
            <li key={review.id} className="flex justify-between items-center">
              <span className="text-blue-300">{review.title}</span>
              <Button
                variant="outline"
                size="sm"
                className="text-purple-300 border-purple-300 hover:bg-purple-800 bg-gray-800"
              >
                Start Review
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {reviews.length < 25 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Next Lessons</h2>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="flex justify-between items-center">
                <span className="text-blue-300">{lesson.title}</span>
                <Link href={`/lesson/${lesson.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-300 border-purple-300 hover:bg-purple-800 bg-gray-800"
                  >
                    Start Lesson
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

