"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, GraduationCap, Users, Award } from "lucide-react"

export function TeamStructure() {
  const teamData = {
    hods: [
      { name: "Dr. Sarah Johnson", department: "Computer Science", email: "sarah.johnson@university.edu" },
      { name: "Prof. Michael Chen", department: "Engineering", email: "michael.chen@university.edu" },
      { name: "Dr. Emily Rodriguez", department: "Arts & Sciences", email: "emily.rodriguez@university.edu" },
    ],
    facultyCoordinators: [
      { name: "Dr. James Wilson", department: "Computer Science", role: "Technical Coordinator" },
      { name: "Prof. Lisa Anderson", department: "Engineering", role: "Project Coordinator" },
      { name: "Dr. Robert Taylor", department: "Arts & Sciences", role: "Cultural Coordinator" },
    ],
    studentCoordinators: [
      { name: "Alex Thompson", year: "Final Year", department: "CS", role: "Lead Coordinator" },
      { name: "Priya Sharma", year: "Third Year", department: "ECE", role: "Event Coordinator" },
      { name: "David Kim", year: "Final Year", department: "ME", role: "Technical Coordinator" },
      { name: "Maria Garcia", year: "Third Year", department: "Arts", role: "Cultural Coordinator" },
    ],
    evaluationTeam: [
      { name: "Dr. Jennifer Brown", expertise: "AI & Machine Learning", role: "Senior Evaluator" },
      { name: "Prof. Mark Davis", expertise: "Software Engineering", role: "Technical Evaluator" },
      { name: "Dr. Amanda White", expertise: "Innovation & Design", role: "Design Evaluator" },
      { name: "Prof. Kevin Lee", expertise: "Research Methodology", role: "Research Evaluator" },
    ],
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="team-structure" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Event Team Structure</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Meet the dedicated team of faculty and students organizing this exceptional event
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* HODs */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Crown className="w-6 h-6 text-primary" />
                  Heads of Department
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamData.hods.map((hod, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold text-card-foreground">{hod.name}</h4>
                    <p className="text-muted-foreground text-sm">{hod.department}</p>
                    <p className="text-muted-foreground text-xs">{hod.email}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Faculty Coordinators */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Faculty Coordinators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamData.facultyCoordinators.map((coordinator, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold text-card-foreground">{coordinator.name}</h4>
                    <p className="text-muted-foreground text-sm">{coordinator.department}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {coordinator.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Coordinators */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Users className="w-6 h-6 text-primary" />
                  Student Coordinators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamData.studentCoordinators.map((coordinator, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold text-card-foreground">{coordinator.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {coordinator.year} - {coordinator.department}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs border-primary text-primary">
                      {coordinator.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Evaluation Team */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-card-foreground">
                  <Award className="w-6 h-6 text-primary" />
                  Evaluation Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamData.evaluationTeam.map((evaluator, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold text-card-foreground">{evaluator.name}</h4>
                    <p className="text-muted-foreground text-sm">{evaluator.expertise}</p>
                    <Badge variant="default" className="mt-2 text-xs bg-primary">
                      {evaluator.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
