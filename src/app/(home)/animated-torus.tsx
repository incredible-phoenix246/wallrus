'use client'
import React, { useState } from 'react'

const AnimtatedTorus = () => {
  const [isHovered, setIsHovered] = useState(false)
  const hoverScale = isHovered ? 'scale3d(1.2, 1.2, 1.2)' : 'scale3d(1, 1, 1)'

  return (
    <>
      <div className="relative">
        <div
          className={`transform-gpu cursor-pointer drop-shadow-2xl transition-all duration-700 ease-out hover:drop-shadow-[0_0_60px_rgba(168,85,247,0.6)]`}
          style={{
            transformStyle: 'preserve-3d',
            animation: `orbit 8s linear infinite`,
            transform: `perspective(1000px) ${hoverScale}`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src="/torus.svg"
            alt="3D Animated Torus"
            className="h-80 w-80 brightness-110 contrast-110 filter select-none md:h-96 md:w-96"
            draggable={false}
          />
        </div>

        <div
          className={`absolute inset-0 -z-10 blur-3xl transition-all duration-700 ${isHovered ? 'scale-110 opacity-60' : 'scale-100 opacity-40'} `}
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(236,72,153,0.6) 40%, rgba(59,130,246,0.4) 70%, transparent 90%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />

        {/* Orbital Particles */}
        <div className="absolute inset-0 -z-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-70"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                animation: `orbit ${6 + i * 0.5}s linear infinite ${i * 0.3}s`,
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(200px)`,
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: perspective(1000px) rotateX(15deg) rotateY(0deg)
              rotateZ(0deg);
          }
          33% {
            transform: perspective(1000px) rotateX(45deg) rotateY(120deg)
              rotateZ(15deg);
          }
          66% {
            transform: perspective(1000px) rotateX(15deg) rotateY(240deg)
              rotateZ(-15deg);
          }
          100% {
            transform: perspective(1000px) rotateX(15deg) rotateY(360deg)
              rotateZ(0deg);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  )
}

export default AnimtatedTorus
