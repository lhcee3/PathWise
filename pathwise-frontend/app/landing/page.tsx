"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, LayoutDashboard, ListChecks, CalendarDays, Target } from "lucide-react"

// Background animation styles (defined in globals.css)
function AnimatedBackground() {
  return <div className="animated-gradient-background absolute inset-0 -z-10" />
}

// Decorative shapes - now darker and with subtle orange glow
function DecorativeShapes() {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-gray-950/50 rounded-full mix-blend-overlay filter blur-lg opacity-70 animate-blob shadow-orange-glow"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-950/50 rounded-full mix-blend-overlay filter blur-lg opacity-70 animate-blob animation-delay-2000 shadow-orange-glow"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gray-950/50 rounded-full mix-blend-overlay filter blur-lg opacity-70 animate-blob animation-delay-4000 shadow-orange-glow"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
      />
    </>
  )
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1], // Changed ease to cubic-bezier array for "easeOut"
    },
    staggerChildren: 0.1,
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Organize with Streams",
      description: "Categorize your tasks into custom streams like 'Web Dev' or 'UI/UX' for clear organization.",
    },
    {
      icon: ListChecks,
      title: "Track Every Task",
      description: "Add, rename, mark complete, and delete tasks within each stream with ease.",
    },
    {
      icon: CalendarDays,
      title: "Build Consistency",
      description: "Visualize your daily progress with a built-in streak calendar and consistency tracker.",
    },
    {
      icon: Target,
      title: "Set Daily Focus",
      description: "Define your main goal for the day to stay aligned and productive.",
    },
    {
      icon: CheckCircle,
      title: "Monitor Progress",
      description: "Get an overview of your completed tasks and overall progress across all your streams.",
    },
  ]

  const quote = {
    text: "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
    author: "Tony Robbins",
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-black">
      <AnimatedBackground />
      <DecorativeShapes />

      {/* Hero Section */}
      <motion.section
        className="relative z-10 text-center py-20 md:py-32 px-4 max-w-5xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight text-primary drop-shadow-lg"
          variants={itemVariants}
        >
          PathWise
        </motion.h1>
        <motion.p
          className="text-xl md:text-3xl font-medium mb-10 text-gray-200 drop-shadow-md"
          variants={itemVariants}
        >
          Your personalized journey to consistent learning and unstoppable progress.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            className="px-10 py-7 text-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
          >
            <Link href="/dashboard">Start Your Path</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        className="relative z-10 w-full bg-black/70 backdrop-blur-sm py-16 px-4 border-y border-gray-800"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.blockquote
          className="max-w-3xl mx-auto text-center italic text-xl md:text-2xl text-gray-300"
          variants={itemVariants}
        >
          <p className="mb-4 leading-relaxed">"{quote.text}"</p>
          <footer className="text-base text-gray-400">— {quote.author}</footer>
        </motion.blockquote>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 py-20 px-4 max-w-6xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white" variants={itemVariants}>
          Unlock Your Potential
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black/60 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-800 text-white hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-2"
              variants={itemVariants}
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final Call to Action */}
      <motion.section
        className="relative z-10 text-center py-20 px-4 max-w-4xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-8" variants={itemVariants}>
          Ready to Start Your Journey?
        </motion.h2>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            className="px-10 py-7 text-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
          >
            <Link href="/dashboard">Begin Now</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Footer (Optional, but good for completeness) */}
      <footer className="relative z-10 w-full py-8 text-center text-gray-500 text-sm bg-black/50 border-t border-gray-900">
        <p>&copy; {new Date().getFullYear()} PathWise. All rights reserved.</p>
      </footer>
    </div>
  )
}
