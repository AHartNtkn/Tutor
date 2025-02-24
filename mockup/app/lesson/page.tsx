"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const lessonSteps = [
  {
    type: "explanation",
    content: "This is the initial explanation of the concept. It fits in one screen without scrolling.",
  },
  {
    type: "example",
    content: "This is a worked example demonstrating the concept.",
  },
  {
    type: "practice",
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "7"],
        correctAnswer: "4",
      },
      // Add more practice questions here
    ],
  },
]

export default function LessonPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answered, setAnswered] = useState(false)

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setAnswered(false)
    }
  }

  const handleAnswer = () => {
    setAnswered(true)
  }

  const currentStepData = lessonSteps[currentStep]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Lesson Title</h1>

        {currentStepData.type === "explanation" && <div>{currentStepData.content}</div>}

        {currentStepData.type === "example" && <div>{currentStepData.content}</div>}

        {currentStepData.type === "practice" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Practice Question</h2>
            <p>{currentStepData.questions[0].question}</p>
            <div className="space-y-2 mt-4">
              {currentStepData.questions[0].options.map((option, index) => (
                <Button key={index} onClick={handleAnswer} className="w-full">
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button onClick={handleNext} disabled={!answered && currentStepData.type === "practice"}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

