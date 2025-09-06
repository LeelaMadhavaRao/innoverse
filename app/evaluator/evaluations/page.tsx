"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EvaluatorLayout } from "@/components/evaluator/evaluator-layout"
import { Award, Edit, Save, Star } from "lucide-react"

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      teamName: "Team Alpha",
      project: "AI-Powered Learning Platform",
      scores: {
        innovation: 9,
        technical: 8,
        presentation: 9,
        feasibility: 8,
      },
      totalScore: 8.5,
      feedback:
        "Excellent innovative approach with strong technical implementation. The AI algorithms are well-designed and the user interface is intuitive.",
      evaluatedAt: "2024-03-10 15:30",
    },
    {
      id: 2,
      teamName: "Team Beta",
      project: "Smart Campus Management",
      scores: {
        innovation: 8,
        technical: 9,
        presentation: 8,
        feasibility: 9,
      },
      totalScore: 8.5,
      feedback:
        "Solid technical execution with practical applications. The IoT integration is impressive and the system architecture is well-planned.",
      evaluatedAt: "2024-03-09 14:20",
    },
  ])

  const [isEvaluating, setIsEvaluating] = useState(false)
  const [currentEvaluation, setCurrentEvaluation] = useState({
    teamName: "Team Gamma",
    project: "Sustainable Energy Monitor",
    scores: {
      innovation: [7],
      technical: [8],
      presentation: [7],
      feasibility: [8],
    },
    feedback: "",
  })
  const [message, setMessage] = useState("")

  const handleScoreChange = (category: string, value: number[]) => {
    setCurrentEvaluation({
      ...currentEvaluation,
      scores: {
        ...currentEvaluation.scores,
        [category]: value,
      },
    })
  }

  const calculateTotalScore = () => {
    const scores = currentEvaluation.scores
    const total = (scores.innovation[0] + scores.technical[0] + scores.presentation[0] + scores.feasibility[0]) / 4
    return Math.round(total * 10) / 10
  }

  const handleSubmitEvaluation = () => {
    const newEvaluation = {
      id: evaluations.length + 1,
      teamName: currentEvaluation.teamName,
      project: currentEvaluation.project,
      scores: {
        innovation: currentEvaluation.scores.innovation[0],
        technical: currentEvaluation.scores.technical[0],
        presentation: currentEvaluation.scores.presentation[0],
        feasibility: currentEvaluation.scores.feasibility[0],
      },
      totalScore: calculateTotalScore(),
      feedback: currentEvaluation.feedback,
      evaluatedAt: new Date().toLocaleString(),
    }

    setEvaluations([newEvaluation, ...evaluations])
    setIsEvaluating(false)
    setMessage("Evaluation submitted successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-500"
    if (score >= 7) return "text-blue-500"
    if (score >= 5) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <EvaluatorLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Evaluations</h1>
            <p className="text-muted-foreground">Review and manage your team evaluations</p>
          </div>

          <Dialog open={isEvaluating} onOpenChange={setIsEvaluating}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Award className="w-4 h-4 mr-2" />
                New Evaluation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Evaluate Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Team Info */}
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold text-card-foreground">{currentEvaluation.teamName}</h3>
                  <p className="text-muted-foreground">{currentEvaluation.project}</p>
                </div>

                {/* Scoring Categories */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-card-foreground">Evaluation Criteria</h3>

                  {/* Innovation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-card-foreground">Innovation & Creativity</Label>
                      <Badge variant="outline" className={getScoreColor(currentEvaluation.scores.innovation[0])}>
                        {currentEvaluation.scores.innovation[0]}/10
                      </Badge>
                    </div>
                    <Slider
                      value={currentEvaluation.scores.innovation}
                      onValueChange={(value) => handleScoreChange("innovation", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Technical */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-card-foreground">Technical Implementation</Label>
                      <Badge variant="outline" className={getScoreColor(currentEvaluation.scores.technical[0])}>
                        {currentEvaluation.scores.technical[0]}/10
                      </Badge>
                    </div>
                    <Slider
                      value={currentEvaluation.scores.technical}
                      onValueChange={(value) => handleScoreChange("technical", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Presentation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-card-foreground">Presentation Quality</Label>
                      <Badge variant="outline" className={getScoreColor(currentEvaluation.scores.presentation[0])}>
                        {currentEvaluation.scores.presentation[0]}/10
                      </Badge>
                    </div>
                    <Slider
                      value={currentEvaluation.scores.presentation}
                      onValueChange={(value) => handleScoreChange("presentation", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Feasibility */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-card-foreground">Feasibility & Impact</Label>
                      <Badge variant="outline" className={getScoreColor(currentEvaluation.scores.feasibility[0])}>
                        {currentEvaluation.scores.feasibility[0]}/10
                      </Badge>
                    </div>
                    <Slider
                      value={currentEvaluation.scores.feasibility}
                      onValueChange={(value) => handleScoreChange("feasibility", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Total Score */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-card-foreground">Total Score</span>
                      <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                        {calculateTotalScore()}/10
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-card-foreground">
                    Detailed Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    value={currentEvaluation.feedback}
                    onChange={(e) => setCurrentEvaluation({ ...currentEvaluation, feedback: e.target.value })}
                    placeholder="Provide detailed feedback on the team's performance, strengths, and areas for improvement..."
                    rows={4}
                    className="bg-input border-border"
                  />
                </div>

                <Button
                  onClick={handleSubmitEvaluation}
                  disabled={!currentEvaluation.feedback.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Evaluation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <Alert className="border-primary/50 bg-primary/10">
            <AlertDescription className="text-primary">{message}</AlertDescription>
          </Alert>
        )}

        {/* Evaluations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id} className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-card-foreground">{evaluation.teamName}</CardTitle>
                    <p className="text-muted-foreground">{evaluation.project}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {evaluation.totalScore}/10
                    </Badge>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Innovation</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluation.scores.innovation)}`}>
                      {evaluation.scores.innovation}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Technical</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluation.scores.technical)}`}>
                      {evaluation.scores.technical}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Presentation</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluation.scores.presentation)}`}>
                      {evaluation.scores.presentation}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Feasibility</p>
                    <p className={`text-lg font-bold ${getScoreColor(evaluation.scores.feasibility)}`}>
                      {evaluation.scores.feasibility}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Feedback</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{evaluation.feedback}</p>
                </div>

                <div className="text-xs text-muted-foreground">Evaluated on: {evaluation.evaluatedAt}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </EvaluatorLayout>
  )
}
