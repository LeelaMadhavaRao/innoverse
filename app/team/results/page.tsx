"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TeamLayout } from "@/components/team/team-layout"
import { Award, Star, TrendingUp, Calendar } from "lucide-react"

export default function TeamResults() {
  const evaluations = [
    {
      id: 1,
      evaluator: "Dr. Jennifer Brown",
      evaluatedAt: "2024-03-10 15:30",
      scores: {
        innovation: 9,
        technical: 8,
        presentation: 9,
        feasibility: 8,
      },
      totalScore: 8.5,
      feedback:
        "Excellent innovative approach with strong technical implementation. The AI algorithms are well-designed and the user interface is intuitive. The team demonstrated deep understanding of machine learning concepts and their practical applications. Consider adding more real-world testing scenarios to validate the effectiveness of your personalization algorithms.",
      strengths: [
        "Innovative use of AI for personalized learning",
        "Clean and intuitive user interface design",
        "Strong technical architecture",
        "Well-structured presentation",
      ],
      improvements: [
        "Add more comprehensive testing with real users",
        "Consider scalability for larger user bases",
        "Implement more detailed analytics dashboard",
      ],
    },
    {
      id: 2,
      evaluator: "Prof. Mark Davis",
      evaluatedAt: "2024-03-09 14:20",
      scores: {
        innovation: 8,
        technical: 9,
        presentation: 8,
        feasibility: 9,
      },
      totalScore: 8.5,
      feedback:
        "Solid technical execution with practical applications. The backend architecture is impressive and shows good understanding of scalable system design. The API design is clean and well-documented. The team has done excellent work on the technical implementation side.",
      strengths: [
        "Robust backend architecture",
        "Excellent API design and documentation",
        "Good understanding of scalability principles",
        "Clean code structure",
      ],
      improvements: [
        "Enhance frontend user experience",
        "Add more interactive features",
        "Consider mobile responsiveness",
      ],
    },
  ]

  const overallStats = {
    averageScore: 8.5,
    totalEvaluations: evaluations.length,
    highestScore: Math.max(...evaluations.map((e) => e.totalScore)),
    lowestScore: Math.min(...evaluations.map((e) => e.totalScore)),
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-500"
    if (score >= 7) return "text-blue-500"
    if (score >= 5) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 9) return "bg-green-500/10 text-green-500"
    if (score >= 7) return "bg-blue-500/10 text-blue-500"
    if (score >= 5) return "bg-orange-500/10 text-orange-500"
    return "bg-red-500/10 text-red-500"
  }

  return (
    <TeamLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-foreground">Evaluation Results</h1>
          <p className="text-muted-foreground">View your evaluation scores and feedback from judges</p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-card-foreground">{overallStats.averageScore}</h3>
              <p className="text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-card-foreground">{overallStats.totalEvaluations}</h3>
              <p className="text-muted-foreground">Evaluations</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-card-foreground">{overallStats.highestScore}</h3>
              <p className="text-muted-foreground">Highest Score</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-card-foreground">{overallStats.lowestScore}</h3>
              <p className="text-muted-foreground">Lowest Score</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Evaluations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {evaluations.map((evaluation, index) => (
            <Card key={evaluation.id} className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-card-foreground">Evaluation by {evaluation.evaluator}</CardTitle>
                    <p className="text-muted-foreground text-sm">Evaluated on {evaluation.evaluatedAt}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1 text-lg px-3 py-1">
                    <Star className="w-4 h-4" />
                    {evaluation.totalScore}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Breakdown */}
                <div>
                  <h4 className="font-semibold text-card-foreground mb-4">Score Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Innovation</p>
                      <Badge className={getScoreBadgeColor(evaluation.scores.innovation)}>
                        {evaluation.scores.innovation}/10
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Technical</p>
                      <Badge className={getScoreBadgeColor(evaluation.scores.technical)}>
                        {evaluation.scores.technical}/10
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Presentation</p>
                      <Badge className={getScoreBadgeColor(evaluation.scores.presentation)}>
                        {evaluation.scores.presentation}/10
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Feasibility</p>
                      <Badge className={getScoreBadgeColor(evaluation.scores.feasibility)}>
                        {evaluation.scores.feasibility}/10
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Detailed Feedback</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{evaluation.feedback}</p>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-3 text-green-500">Strengths</h4>
                    <ul className="space-y-2">
                      {evaluation.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-3 text-orange-500">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {evaluation.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </TeamLayout>
  )
}
