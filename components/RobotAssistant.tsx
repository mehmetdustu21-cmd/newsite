'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, Cylinder, Environment, ContactShadows, PresentationControls, useGLTF } from '@react-three/drei'
import { Mesh, Group } from 'three'
import { gsap } from 'gsap'

// Robot Head Component
function RobotHead({ isTalking, isThinking, isHappy }: { isTalking: boolean, isThinking: boolean, isHappy: boolean }) {
  const headRef = useRef<Group>(null)
  const leftEyeRef = useRef<Mesh>(null)
  const rightEyeRef = useRef<Mesh>(null)
  const mouthRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (headRef.current) {
      // Gentle head movement
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }

    // Eye blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 2) > 0.9 ? 0.1 : 1
      leftEyeRef.current.scale.y = blink
      rightEyeRef.current.scale.y = blink
    }

    // Mouth animation when talking
    if (mouthRef.current && isTalking) {
      mouthRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1
    }
  })

  return (
    <group ref={headRef}>
      {/* Head */}
      <Box args={[1.2, 1.2, 1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#4A90E2" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.15, 16, 16]} position={[-0.3, 1.6, 0.4]}>
        <meshStandardMaterial color="#00FF00" emissive="#00AA00" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.15, 16, 16]} position={[0.3, 1.6, 0.4]}>
        <meshStandardMaterial color="#00FF00" emissive="#00AA00" emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Mouth */}
      <Box ref={mouthRef} args={[0.4, 0.1, 0.1]} position={[0, 1.3, 0.4]}>
        <meshStandardMaterial color="#FF6B6B" emissive="#FF0000" emissiveIntensity={isTalking ? 0.5 : 0} />
      </Box>
      
      {/* Antenna */}
      <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Sphere args={[0.08]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFFF00" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  )
}

// Robot Body Component
function RobotBody({ isTalking, isThinking, isHappy }: { isTalking: boolean, isThinking: boolean, isHappy: boolean }) {
  const bodyRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle breathing animation
      bodyRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    }

    // Arm waving when happy
    if (isHappy && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.5
      rightArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3 + Math.PI) * 0.5
    } else if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0
      rightArmRef.current.rotation.z = 0
    }

    // Thinking pose
    if (isThinking && rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.3
      rightArmRef.current.rotation.x = -0.2
    }
  })

  return (
    <group ref={bodyRef}>
      {/* Main Body */}
      <Box args={[1.5, 2, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2E86AB" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-1.2, 0.5, 0]}>
        <Cylinder args={[0.15, 0.15, 1.2]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#4A90E2" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.2]} position={[0.6, 0, 0]}>
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[1.2, 0.5, 0]}>
        <Cylinder args={[0.15, 0.15, 1.2]} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshStandardMaterial color="#4A90E2" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.2]} position={[-0.6, 0, 0]}>
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
      
      {/* Chest Panel */}
      <Box args={[1, 0.8, 0.1]} position={[0, 0.2, 0.45]}>
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
      </Box>
      
      {/* Status Lights */}
      <Sphere args={[0.05]} position={[-0.3, 0.4, 0.5]}>
        <meshStandardMaterial 
          color={isTalking ? "#00FF00" : isThinking ? "#FFFF00" : "#FF0000"} 
          emissive={isTalking ? "#00AA00" : isThinking ? "#AAAA00" : "#AA0000"} 
          emissiveIntensity={0.5} 
        />
      </Sphere>
      <Sphere args={[0.05]} position={[0.3, 0.4, 0.5]}>
        <meshStandardMaterial 
          color={isTalking ? "#00FF00" : isThinking ? "#FFFF00" : "#FF0000"} 
          emissive={isTalking ? "#00AA00" : isThinking ? "#AAAA00" : "#AA0000"} 
          emissiveIntensity={0.5} 
        />
      </Sphere>
    </group>
  )
}

// Robot Legs Component
function RobotLegs() {
  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)

  useFrame((state) => {
    // Walking animation
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1
      rightLegRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.1
    }
  })

  return (
    <group>
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.4, -1.5, 0]}>
        <Cylinder args={[0.2, 0.2, 1.5]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2E86AB" metalness={0.7} roughness={0.3} />
        </Cylinder>
        <Box args={[0.6, 0.2, 1]} position={[0, -0.8, 0.2]}>
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </Box>
      </group>
      
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.4, -1.5, 0]}>
        <Cylinder args={[0.2, 0.2, 1.5]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2E86AB" metalness={0.7} roughness={0.3} />
        </Cylinder>
        <Box args={[0.6, 0.2, 1]} position={[0, -0.8, 0.2]}>
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </Box>
      </group>
    </group>
  )
}

// Speech Bubble Component
function SpeechBubble({ message, isVisible }: { message: string, isVisible: boolean }) {
  const bubbleRef = useRef<Group>(null)

  useEffect(() => {
    if (bubbleRef.current) {
      if (isVisible) {
        gsap.fromTo(bubbleRef.current.scale, 
          { x: 0, y: 0, z: 0 }, 
          { x: 1, y: 1, z: 1, duration: 0.3, ease: "back.out(1.7)" }
        )
      } else {
        gsap.to(bubbleRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.2 })
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <group ref={bubbleRef} position={[0, 3, 0]}>
      {/* Bubble */}
      <Box args={[3, 1, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.9} />
      </Box>
      
      {/* Text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {message}
      </Text>
      
      {/* Tail */}
      <Box args={[0.3, 0.3, 0.1]} position={[0, -0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.9} />
      </Box>
    </group>
  )
}

// Yoda Model Component
function YodaModel({ isTalking, isThinking, isHappy }: { 
  isTalking: boolean, 
  isThinking: boolean, 
  isHappy: boolean 
}) {
  const yodaRef = useRef<Group>(null)
  
  // Load the model
  const { scene, animations } = useGLTF('/models/michi_bot.glb')
  
  if (scene) {
    console.log('✅ Michibot model loaded successfully:', scene)
    console.log('🎬 Available animations:', animations)
  }

  useFrame((state) => {
    if (yodaRef.current) {
      // Very gentle floating animation (much smaller)
      yodaRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
      
      // Only slight movement when thinking
      if (isThinking) {
        yodaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      }
      
      // Wing flapping animation
      const wingFlapSpeed = 3.0
      const wingFlapAmount = 0.4
      const wingFlap = Math.sin(state.clock.elapsedTime * wingFlapSpeed) * wingFlapAmount
      
      // Find and animate wings (assuming they're named 'wing' or similar)
      yodaRef.current.traverse((child) => {
        if (child.name.toLowerCase().includes('wing') || 
            child.name.toLowerCase().includes('kanat') ||
            child.name.toLowerCase().includes('arm') ||
            child.name.toLowerCase().includes('kol')) {
          // Wing flapping motion
          child.rotation.x = wingFlap
          // Slight rotation for more natural movement
          child.rotation.z = Math.sin(state.clock.elapsedTime * wingFlapSpeed * 1.2) * 0.1
        }
      })
      
      // Body swaying with wing movement
      yodaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * wingFlapSpeed * 0.5) * 0.05
      
      // Remove constant head movement - keep it still
    }
  })

  // Show fallback if no scene
  if (!scene) {
    return (
      <group ref={yodaRef} scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#4A90E2"
          anchorX="center"
          anchorY="middle"
        >
          Loading Michibot...
        </Text>
      </group>
    )
  }
  

  return (
    <group ref={yodaRef} scale={[25, 25, 25]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

// Main Robot Component
function Robot({ isTalking, isThinking, isHappy, message }: { 
  isTalking: boolean, 
  isThinking: boolean, 
  isHappy: boolean, 
  message: string 
}) {
  return (
    <group>
      <YodaModel isTalking={isTalking} isThinking={isThinking} isHappy={isHappy} />
    </group>
  )
}

// Main Robot Assistant Component
export default function RobotAssistant() {
  const [isTalking, setIsTalking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  // Demo conversation
  useEffect(() => {
  const demoMessages = [
    'Merhaba! Ben Michibot, EasyChat\'in AI asistanıyım! 🤖',
    'Dashboard\'ında sorun mu var? Michibot yardım edebilir!',
    'WhatsApp entegrasyonu hakkında bilgi istiyorsun? Anlatabilirim!',
    'Bugün güzel bir gün! Size nasıl yardımcı olabilirim?',
    'Teknoloji konusunda uzmanım! Sorularınızı yanıtlayabilirim.',
    'EasyChat ile müşteri desteği çok daha kolay olacak!'
  ]

    const interval = setInterval(() => {
      if (isVisible) {
        setIsThinking(true)
        setTimeout(() => {
          setIsThinking(false)
          setIsTalking(true)
          setMessage(demoMessages[Math.floor(Math.random() * demoMessages.length)])
          setTimeout(() => {
            setIsTalking(false)
            setIsHappy(true)
            setTimeout(() => {
              setIsHappy(false)
              setMessage('')
            }, 2000)
          }, 3000)
        }, 1000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center mb-4"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* 3D Robot */}
      {isVisible && (
        <div className="w-80 h-96 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 1.5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4A90E2" />
            
            <Environment preset="studio" />
            <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
            
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Robot 
                isTalking={isTalking} 
                isThinking={isThinking} 
                isHappy={isHappy} 
                message={message} 
              />
            </PresentationControls>
          </Canvas>
        </div>
      )}
    </div>
  )
}
