"use client";

import { motion } from "framer-motion";

export default function AnimatedProgressAvatar() {
    // Circle calculations
    const radius = 160;
    const circumference = 2 * Math.PI * radius; // ~1005.3
    const progress = 0.7; // 70% progress
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <motion.svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Glow filter definition */}
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background track circle */}
                <circle
                    cx="200"
                    cy="200"
                    r="160"
                    stroke="#F0F0F0"
                    strokeWidth="24"
                    opacity={0.15}
                />

                {/* Animated progress circle */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="160"
                    stroke="url(#progressGradient)"
                    strokeWidth="24"
                    strokeLinecap="round"
                    fill="none"
                    style={{
                        transformOrigin: "center",
                        rotate: -90,
                    }}
                    initial={{
                        strokeDasharray: circumference,
                        strokeDashoffset: circumference,
                    }}
                    animate={{
                        strokeDashoffset: strokeDashoffset,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 0.3,
                    }}
                />

                {/* Gradient for progress */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007BFF" />
                        <stop offset="100%" stopColor="#00D4FF" />
                    </linearGradient>
                </defs>

                {/* Glow effect for progress */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="160"
                    stroke="#007BFF"
                    strokeWidth="24"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#glow)"
                    style={{
                        transformOrigin: "center",
                        rotate: -90,
                    }}
                    initial={{
                        strokeDasharray: circumference,
                        strokeDashoffset: circumference,
                        opacity: 0,
                    }}
                    animate={{
                        strokeDashoffset: strokeDashoffset,
                        opacity: 0.5,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 0.3,
                    }}
                />

                {/* Face group with entrance animation */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
                        delay: 0.5,
                    }}
                    style={{ transformOrigin: "200px 200px" }}
                >
                    <g transform="translate(100 100) scale(0.5)">
                        {/* Face background (peachy color) */}
                        <motion.circle
                            cx="200"
                            cy="200"
                            r="160"
                            fill="#FF9E8E"
                            animate={{
                                filter: ["drop-shadow(0 0 0px #FF9E8E)", "drop-shadow(0 0 10px #FF9E8E)", "drop-shadow(0 0 0px #FF9E8E)"]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Blue "hat" / top half with subtle shine animation */}
                        <motion.path
                            d="M360 200C360 111.634 288.366 40 200 40C111.634 40 40 111.634 40 200"
                            fill="#0057FF"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                                ease: "easeOut"
                            }}
                        />

                        {/* Left eye socket with draw animation */}
                        <motion.circle
                            cx="150"
                            cy="200"
                            r="50"
                            stroke="white"
                            strokeWidth="10"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 1.0,
                                ease: "easeOut"
                            }}
                        />

                        {/* Right eye socket with draw animation */}
                        <motion.circle
                            cx="250"
                            cy="200"
                            r="50"
                            stroke="white"
                            strokeWidth="10"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 1.1,
                                ease: "easeOut"
                            }}
                        />

                        {/* Left pupil - with look around and blink */}
                        <motion.circle
                            cx="160"
                            cy="200"
                            r="15"
                            fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: [0, 5, -5, 3, 0],
                                y: [0, -3, 2, -2, 0],
                                scaleY: [1, 1, 1, 1, 0.1, 1, 1, 1, 1],
                            }}
                            transition={{
                                scale: { duration: 0.3, delay: 1.3 },
                                opacity: { duration: 0.3, delay: 1.3 },
                                x: { duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" },
                                y: { duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" },
                                scaleY: { duration: 3, repeat: Infinity, repeatDelay: 2, times: [0, 0.4, 0.45, 0.5, 0.52, 0.54, 0.6, 0.8, 1] },
                            }}
                            style={{ transformOrigin: "160px 200px" }}
                        />

                        {/* Right pupil - with look around and blink */}
                        <motion.circle
                            cx="240"
                            cy="200"
                            r="15"
                            fill="black"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: [0, 5, -5, 3, 0],
                                y: [0, -3, 2, -2, 0],
                                scaleY: [1, 1, 1, 1, 0.1, 1, 1, 1, 1],
                            }}
                            transition={{
                                scale: { duration: 0.3, delay: 1.4 },
                                opacity: { duration: 0.3, delay: 1.4 },
                                x: { duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" },
                                y: { duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" },
                                scaleY: { duration: 3, repeat: Infinity, repeatDelay: 2, times: [0, 0.4, 0.45, 0.5, 0.52, 0.54, 0.6, 0.8, 1] },
                            }}
                            style={{ transformOrigin: "240px 200px" }}
                        />

                        {/* Nose with playful bounce and glow */}
                        <motion.circle
                            cx="200"
                            cy="260"
                            r="15"
                            fill="#E22B3D"
                            filter="url(#innerGlow)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: 1,
                            }}
                            transition={{
                                scale: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                                opacity: { duration: 0.3, delay: 1.5 },
                            }}
                            style={{ transformOrigin: "200px 260px" }}
                        />
                    </g>
                </motion.g>

                {/* Floating particles around the avatar */}
                {[...Array(8)].map((_, i) => (
                    <motion.circle
                        key={i}
                        r={3 + (i % 3)}
                        fill={i % 2 === 0 ? "#007BFF" : "#00D4FF"}
                        initial={{
                            cx: 200 + Math.cos((i * Math.PI * 2) / 8) * 190,
                            cy: 200 + Math.sin((i * Math.PI * 2) / 8) * 190,
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={{
                            opacity: [0, 0.9, 0],
                            scale: [0, 1.2, 0],
                            cx: [
                                200 + Math.cos((i * Math.PI * 2) / 8) * 190,
                                200 + Math.cos((i * Math.PI * 2) / 8) * 210,
                                200 + Math.cos((i * Math.PI * 2) / 8) * 190,
                            ],
                            cy: [
                                200 + Math.sin((i * Math.PI * 2) / 8) * 190,
                                200 + Math.sin((i * Math.PI * 2) / 8) * 210,
                                200 + Math.sin((i * Math.PI * 2) / 8) * 190,
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.25,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Sparkle effects */}
                {[...Array(4)].map((_, i) => (
                    <motion.g
                        key={`sparkle-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1 + i * 0.5,
                            ease: "easeInOut"
                        }}
                        style={{
                            transformOrigin: `${150 + i * 50}px ${80 + (i % 2) * 30}px`
                        }}
                    >
                        <motion.path
                            d={`M${150 + i * 50} ${75 + (i % 2) * 30}
                                L${153 + i * 50} ${80 + (i % 2) * 30}
                                L${150 + i * 50} ${85 + (i % 2) * 30}
                                L${147 + i * 50} ${80 + (i % 2) * 30}Z`}
                            fill="#FFD700"
                        />
                    </motion.g>
                ))}

                {/* Rotating orbit ring */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="185"
                    stroke="url(#orbitGradient)"
                    strokeWidth="1"
                    strokeDasharray="10 20"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 0.3,
                        rotate: 360
                    }}
                    transition={{
                        opacity: { duration: 1, delay: 2 },
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ transformOrigin: "center" }}
                />

                <defs>
                    <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007BFF" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#00D4FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#007BFF" stopOpacity="0.5" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </div>
    );
}
