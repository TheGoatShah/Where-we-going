import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

const SEGMENTS = [
  { emoji: '🍕', color: '#E8590C' },
  { emoji: '🍣', color: '#C44A08' },
  { emoji: '🌮', color: '#FF7043' },
  { emoji: '🍜', color: '#E64A19' },
  { emoji: '🥗', color: '#BF360C' },
  { emoji: '🍔', color: '#D84315' },
  { emoji: '🍛', color: '#F4511E' },
  { emoji: '🥩', color: '#FF5722' },
]

const TOTAL = SEGMENTS.length
const ANGLE = 360 / TOTAL
const R = 120 // wheel radius
const CENTER = 160

interface SpinWheelProps {
  onDone: () => void
}

export function SpinWheel({ onDone }: SpinWheelProps) {
  const controls = useAnimation()
  const doneRef = useRef(false)

  useEffect(() => {
    controls
      .start({
        rotate: 900 + Math.random() * 360,
        transition: {
          duration: 1.2,
          ease: [0.17, 0.67, 0.12, 0.99],
        },
      })
      .then(() => {
        if (!doneRef.current) {
          doneRef.current = true
          setTimeout(onDone, 300)
        }
      })
  }, [controls, onDone])

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-sm mb-6 font-medium tracking-wide uppercase text-xs" style={{ color: 'var(--text-muted)' }}>
        Finding your spot...
      </p>

      <div className="relative">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
          style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '20px solid white' }}
        />

        <motion.div animate={controls} style={{ originX: '50%', originY: '50%' }}>
          <svg width={CENTER * 2} height={CENTER * 2} viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}>
            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * ANGLE - 90) * (Math.PI / 180)
              const endAngle = ((i + 1) * ANGLE - 90) * (Math.PI / 180)
              const x1 = CENTER + R * Math.cos(startAngle)
              const y1 = CENTER + R * Math.sin(startAngle)
              const x2 = CENTER + R * Math.cos(endAngle)
              const y2 = CENTER + R * Math.sin(endAngle)
              const midAngle = ((i + 0.5) * ANGLE - 90) * (Math.PI / 180)
              const textR = R * 0.65
              const tx = CENTER + textR * Math.cos(midAngle)
              const ty = CENTER + textR * Math.sin(midAngle)

              return (
                <g key={i}>
                  <path
                    d={`M ${CENTER} ${CENTER} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1}
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={22}
                  >
                    {seg.emoji}
                  </text>
                </g>
              )
            })}
            {/* Center circle */}
            <circle cx={CENTER} cy={CENTER} r={18} fill="rgba(0,0,0,0.4)" />
            <circle cx={CENTER} cy={CENTER} r={14} fill="white" opacity={0.15} />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
