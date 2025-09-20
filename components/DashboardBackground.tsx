'use client'

import { useEffect, useRef } from 'react'

export default function DashboardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation variables
    let animationId: number
    let time = 0

    // Floating particles
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
    }> = []

    // Initialize particles with different colors
    const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#06B6D4', '#10B981']
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    // Connection lines between nearby particles
    const getDistance = (p1: any, p2: any) => {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    // Animation loop
    function animate() {
      time += 0.01

      // Create subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(248, 250, 252, 0.8)')
      gradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.9)')
      gradient.addColorStop(1, 'rgba(226, 232, 240, 0.8)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
      ctx.lineWidth = 1
      const gridSize = 80
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = getDistance(particles[i], particles[j])
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.1
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw floating particles
      particles.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        
        // Create particle glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw main particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Update particle position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Subtle opacity pulse
        particle.opacity = Math.sin(time + particle.x * 0.01) * 0.2 + 0.3
      })

      // Add animated accent lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'
      ctx.lineWidth = 2
      
      // Multiple diagonal lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const offset = i * 200
        const startX = Math.sin(time * 0.3 + i) * 50 + offset
        const startY = Math.cos(time * 0.2 + i) * 30 + canvas.height * 0.1
        const endX = startX + canvas.width * 0.4
        const endY = startY + canvas.height * 0.6
        
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      // Add floating geometric shapes
      ctx.fillStyle = 'rgba(99, 102, 241, 0.05)'
      for (let i = 0; i < 5; i++) {
        const x = Math.sin(time * 0.1 + i * 2) * 100 + canvas.width * (0.2 + i * 0.15)
        const y = Math.cos(time * 0.15 + i * 1.5) * 80 + canvas.height * (0.3 + i * 0.1)
        const size = 20 + Math.sin(time + i) * 10
        
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(time * 0.05 + i)
        ctx.fillRect(-size/2, -size/2, size, size)
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
