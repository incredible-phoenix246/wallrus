'use client'
import { cn } from '!/lib/utils'
import React, { useState } from 'react'

const Icon1 = () => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <>
      <div className="relative animate-bounce">
        <div
          className={cn(
            'transform-gpu cursor-pointer drop-shadow-2xl transition-all duration-1000 ease-in-out hover:drop-shadow-[0_0_50px_rgba(147,51,234,0.5)]',
            isHovered ? 'scale-110' : 'scale-100'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: `
              perspective(1000px) 
              rotateX(${isHovered ? '25deg' : '15deg'}) 
              rotateY(${isHovered ? '45deg' : '25deg'}) 
              rotateZ(${isHovered ? '15deg' : '5deg'})
              ${isHovered ? 'scale3d(1.1, 1.1, 1.1)' : 'scale3d(1, 1, 1)'}
            `,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src="/cube-helix.svg"
            alt="3D Animated Cube"
            className="h-80 w-80 brightness-110 contrast-110 filter select-none md:h-96 md:w-96"
            draggable={false}
          />
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 -z-10 blur-3xl transition-opacity duration-1000 ${isHovered ? 'opacity-50' : 'opacity-30'} `}
          style={{
            background:
              'radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(59,130,246,0.6) 50%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <div className="absolute inset-0 -z-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-purple-400 opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes floatAndRotate {
          0% {
            transform: perspective(1000px) rotateX(15deg) rotateY(25deg)
              rotateZ(5deg) translateY(0px);
          }
          25% {
            transform: perspective(1000px) rotateX(20deg) rotateY(115deg)
              rotateZ(10deg) translateY(-15px);
          }
          50% {
            transform: perspective(1000px) rotateX(15deg) rotateY(205deg)
              rotateZ(5deg) translateY(-25px);
          }
          75% {
            transform: perspective(1000px) rotateX(20deg) rotateY(295deg)
              rotateZ(10deg) translateY(-15px);
          }
          100% {
            transform: perspective(1000px) rotateX(15deg) rotateY(385deg)
              rotateZ(5deg) translateY(0px);
          }
        }

        @keyframes fastSpin {
          0% {
            transform: perspective(1000px) rotateY(0deg);
          }
          100% {
            transform: perspective(1000px) rotateY(720deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  )
}

export default Icon1
