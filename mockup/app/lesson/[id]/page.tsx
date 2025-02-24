"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        solution: "2 + 2 = 4 because when you combine two groups of two, you get four in total.",
      },
      {
        question: "What is 5 x 3?",
        options: ["10", "12", "15", "18"],
        correctAnswer: "15",
        solution: "5 x 3 = 15 because it means 5 groups of 3, which is 3 + 3 + 3 + 3 + 3 = 15.",
      },
      // Add more practice questions here
    ],
  },
]

export default function LessonPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showSolution, setShowSolution] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentQuestion(0)
      setSelectedAnswer("")
      setShowSolution(false)
    } else {
      router.push("/")
    }
  }

  const handleSubmit = () => {
    const currentQuestionData = lessonSteps[currentStep].questions[currentQuestion]
    if (selectedAnswer === currentQuestionData.correctAnswer) {
      if (currentQuestion < lessonSteps[currentStep].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      } else {
        handleNext()
      }
    } else {
      setShowSolution(true)
    }
  }

  const currentStepData = lessonSteps[currentStep]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold mb-4 text-purple-300">Lesson {params.id}: Sample Lesson Title</h1>

          {currentStepData.type === "explanation" && <div className="text-blue-300">{currentStepData.content}</div>}

          {currentStepData.type === "example" && <div className="text-blue-300">{currentStepData.content}</div>}

          {currentStepData.type === "practice" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-purple-300">Practice Question {currentQuestion + 1}</h2>
              <p className="text-blue-300 mb-4">{currentStepData.questions[currentQuestion].question}</p>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-2">
                {currentStepData.questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="w-full">
                    <Label
                      htmlFor={`option-${index}`}
                      className={`w-full flex items-center p-3 rounded-lg cursor-pointer border border-purple-300 ${
                        selectedAnswer === option
                          ? 'bg-purple-700 text-white'
                          : 'bg-purple-700/20 text-blue-300 hover:bg-purple-700/30'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} className="hidden" />
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {showSolution && (
                <div className="mt-4 p-4 bg-purple-900 rounded-md">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Solution:</h3>
                  <p className="text-blue-300">{currentStepData.questions[currentQuestion].solution}</p>
                </div>
              )}
              <div className="mt-8 flex justify-end space-x-4">
                {showSolution ? (
                  <Button
                    onClick={() => {
                      if (currentQuestion < lessonSteps[currentStep].questions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1)
                        setSelectedAnswer("")
                        setShowSolution(false)
                      } else {
                        handleNext()
                      }
                    }}
                    className="bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="bg-purple-700 hover:bg-purple-800 text-white"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStepData.type !== "practice" && (
            <div className="mt-8 flex justify-end">
              <Button onClick={handleNext} className="bg-purple-700 hover:bg-purple-800 text-white">
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

