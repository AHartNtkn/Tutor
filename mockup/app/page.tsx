import TopBar from "@/components/TopBar"
import ProgressOverview from "@/components/ProgressOverview"
import ReviewsAndLessons from "@/components/ReviewsAndLessons"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <ProgressOverview />
          </div>
          <div className="w-full md:w-2/3">
            <ReviewsAndLessons />
          </div>
        </div>
      </div>
    </main>
  )
}

