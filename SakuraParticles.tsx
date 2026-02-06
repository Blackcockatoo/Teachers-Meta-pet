"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
}

export function SakuraParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100, // 0-100%
        animationDelay: Math.random() * 8, // 0-8s
        animationDuration: 8 + Math.random() * 4, // 8-12s
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="sakura-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
}
