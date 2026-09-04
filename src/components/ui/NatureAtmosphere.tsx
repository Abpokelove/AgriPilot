import React, { useEffect, useRef } from 'react';

export type AtmosphereMode = 'rain-leaves' | 'leaves' | 'rain' | 'off';
export type AtmosphereDensity = 'low' | 'medium' | 'high';

interface NatureAtmosphereProps {
  mode?: AtmosphereMode;
  density?: AtmosphereDensity;
  className?: string;
}

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  color: string;
  type: 'oak' | 'sprout' | 'willow' | 'maple';
  opacity: number;
}

interface RainParticle {
  x: number;
  y: number;
  length: number;
  vy: number;
  vx: number;
  opacity: number;
  width: number;
}

interface SplashRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface SunParticle {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
  opacity: number;
  pulsePhase: number;
}

const STORAGE_MODE_KEY = 'agripilot.atmosphere.mode';
const STORAGE_DENSITY_KEY = 'agripilot.atmosphere.density';

export const getStoredAtmosphereMode = (): AtmosphereMode => {
  const stored = localStorage.getItem(STORAGE_MODE_KEY);
  if (stored && ['rain-leaves', 'leaves', 'rain', 'off'].includes(stored)) {
    return stored as AtmosphereMode;
  }
  return 'rain-leaves';
};

export const getStoredAtmosphereDensity = (): AtmosphereDensity => {
  const stored = localStorage.getItem(STORAGE_DENSITY_KEY);
  if (stored && ['low', 'medium', 'high'].includes(stored)) {
    return stored as AtmosphereDensity;
  }
  return 'medium';
};

export const NatureAtmosphere: React.FC<NatureAtmosphereProps> = ({
  mode = getStoredAtmosphereMode(),
  density = getStoredAtmosphereDensity(),
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    if (mode === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rx = e.clientX;
      const ry = e.clientY;

      // Spawn click ripples
      ripples.push({
        x: rx,
        y: ry,
        radius: 4,
        maxRadius: 38 + Math.random() * 20,
        opacity: 0.8,
      });

      // Spawn spiral burst leaves on click
      if (mode !== 'rain') {
        const count = 4;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
          const speed = 1.8 + Math.random() * 2;
          leaves.push(createLeaf(rx, ry, Math.cos(angle) * speed, Math.sin(angle) * speed - 1.2));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Color palettes for agricultural leaves
    const leafColors = [
      '#0D5C46', // Emerald Dark
      '#10B981', // Vivid Emerald
      '#059669', // Emerald Mid
      '#84CC16', // Fresh Sprout Green
      '#D97706', // Harvest Amber Gold
      '#F59E0B', // Golden Warmth
      '#15803D', // Deep Forest Green
    ];

    const densityMultiplier = density === 'low' ? 0.4 : density === 'high' ? 1.6 : 1.0;
    const leafCount = Math.floor((mode === 'rain' ? 0 : 26) * densityMultiplier);
    const rainCount = Math.floor((mode === 'leaves' ? 0 : 45) * densityMultiplier);
    const sunParticleCount = Math.floor(18 * densityMultiplier);

    function createLeaf(spawnX?: number, spawnY?: number, customVx?: number, customVy?: number): LeafParticle {
      const types: Array<'oak' | 'sprout' | 'willow' | 'maple'> = ['oak', 'sprout', 'willow', 'maple'];
      return {
        x: spawnX !== undefined ? spawnX : Math.random() * width,
        y: spawnY !== undefined ? spawnY : -30 - Math.random() * 100,
        size: 12 + Math.random() * 14,
        vx: customVx !== undefined ? customVx : -0.6 + Math.random() * 1.2,
        vy: customVy !== undefined ? customVy : 0.8 + Math.random() * 1.4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        swayFreq: 0.01 + Math.random() * 0.025,
        swayAmp: 0.8 + Math.random() * 1.6,
        swayPhase: Math.random() * Math.PI * 2,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        type: types[Math.floor(Math.random() * types.length)],
        opacity: 0.6 + Math.random() * 0.35,
      };
    }

    function createRain(): RainParticle {
      return {
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height - height,
        length: 18 + Math.random() * 22,
        vy: 11 + Math.random() * 8,
        vx: -1.5 + Math.random() * 0.6,
        opacity: 0.25 + Math.random() * 0.35,
        width: 1 + Math.random() * 0.8,
      };
    }

    function createSunParticle(): SunParticle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 2.5,
        vy: -0.2 - Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        opacity: 0.2 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    }

    const leaves: LeafParticle[] = Array.from({ length: leafCount }, () => createLeaf(undefined, Math.random() * height));
    const rainDrops: RainParticle[] = Array.from({ length: rainCount }, () => createRain());
    const sunParticles: SunParticle[] = Array.from({ length: sunParticleCount }, () => createSunParticle());
    const ripples: SplashRipple[] = [];

    // Helper to draw realistic, organic leaf paths (No stars, purely botanical leaf curves)
    const drawLeafPath = (c: CanvasRenderingContext2D, size: number, type: LeafParticle['type']) => {
      c.beginPath();
      if (type === 'sprout') {
        // Organic teardrop sprout leaf
        c.moveTo(0, -size * 1.1);
        c.bezierCurveTo(size * 0.75, -size * 0.5, size * 0.7, size * 0.5, 0, size);
        c.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.75, -size * 0.5, 0, -size * 1.1);
      } else if (type === 'maple') {
        // Almond / Mango Curved Leaf (Replaced old spiky star shape with curved botanical leaf)
        c.moveTo(0, -size * 1.25);
        c.bezierCurveTo(size * 0.85, -size * 0.4, size * 0.6, size * 0.6, 0, size);
        c.bezierCurveTo(-size * 0.6, size * 0.6, -size * 0.85, -size * 0.4, 0, -size * 1.25);
      } else if (type === 'willow') {
        // Willow / Bamboo Slender Blade
        c.moveTo(0, -size * 1.4);
        c.quadraticCurveTo(size * 0.45, 0, 0, size * 1.3);
        c.quadraticCurveTo(-size * 0.45, 0, 0, -size * 1.4);
      } else {
        // Classic Farm Oak Leaf (Smooth rounded lobes)
        c.moveTo(0, -size * 1.1);
        c.bezierCurveTo(size * 0.8, -size * 0.7, size * 0.9, 0, size * 0.5, size * 0.4);
        c.bezierCurveTo(size * 0.3, size * 0.7, 0, size * 0.9, 0, size * 1.1);
        c.bezierCurveTo(0, size * 0.9, -size * 0.3, size * 0.7, -size * 0.5, size * 0.4);
        c.bezierCurveTo(-size * 0.9, 0, -size * 0.8, -size * 0.7, 0, -size * 1.1);
      }
      c.fill();

      // Leaf central vein and side veinlets
      c.beginPath();
      c.moveTo(0, -size * 0.9);
      c.lineTo(0, size * 1.2);
      c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      c.lineWidth = 1;
      c.stroke();

      // Side veinlets for realistic botanical detail
      c.beginPath();
      c.moveTo(0, -size * 0.4);
      c.lineTo(size * 0.35, -size * 0.65);
      c.moveTo(0, -size * 0.4);
      c.lineTo(-size * 0.35, -size * 0.65);
      c.moveTo(0, 0);
      c.lineTo(size * 0.4, -size * 0.2);
      c.moveTo(0, 0);
      c.lineTo(-size * 0.4, -size * 0.2);
      c.moveTo(0, size * 0.4);
      c.lineTo(size * 0.3, size * 0.2);
      c.moveTo(0, size * 0.4);
      c.lineTo(-size * 0.3, size * 0.2);
      c.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      c.lineWidth = 0.75;
      c.stroke();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render Sunlit Bokeh Particles
      for (const p of sunParticles) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(tick * 0.02 + p.pulsePhase) * 0.2;
        p.pulsePhase += 0.03;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        if (p.y < -10) p.y = height + 10;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${currentOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Rain Drizzle
      if (mode === 'rain-leaves' || mode === 'rain') {
        for (const r of rainDrops) {
          r.y += r.vy;
          r.x += r.vx;

          if (r.y > height + 20) {
            r.y = -20;
            r.x = Math.random() * (width + 200) - 100;

            // Occasional rain splash on ground
            if (Math.random() < 0.25) {
              ripples.push({
                x: r.x,
                y: height - 10 - Math.random() * 40,
                radius: 1,
                maxRadius: 10 + Math.random() * 12,
                opacity: 0.4,
              });
            }
          }

          ctx.save();
          ctx.beginPath();
          const gradient = ctx.createLinearGradient(r.x, r.y, r.x + r.vx * 2, r.y + r.length);
          gradient.addColorStop(0, `rgba(187, 247, 208, 0)`);
          gradient.addColorStop(0.5, `rgba(167, 243, 208, ${r.opacity})`);
          gradient.addColorStop(1, `rgba(52, 211, 153, ${r.opacity * 0.8})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = r.width;
          ctx.lineCap = 'round';
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.vx * 1.5, r.y + r.length);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Render Click & Rain Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 1.2;
        rp.opacity -= 0.022;

        if (rp.opacity <= 0 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.radius, rp.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${rp.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Render Falling Leaves
      if (mode === 'rain-leaves' || mode === 'leaves') {
        for (let i = 0; i < leaves.length; i++) {
          const l = leaves[i];

          // Swaying physics
          l.swayPhase += l.swayFreq;
          const swayX = Math.sin(l.swayPhase) * l.swayAmp;

          // Mouse deflection force (leaf responds to breeze around cursor)
          if (mousePos.current.active) {
            const dx = l.x - mousePos.current.x;
            const dy = l.y - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxRadius = 140;

            if (dist < maxRadius && dist > 0) {
              const force = ((maxRadius - dist) / maxRadius) * 2.2;
              l.vx += (dx / dist) * force * 0.15;
              l.vy += (dy / dist) * force * 0.12;
              l.vRot += (dx / dist) * 0.01;
            }
          }

          // Apply velocity and drag
          l.x += l.vx + swayX * 0.5;
          l.y += l.vy;
          l.rotation += l.vRot;

          // Gentle velocity dampening back to normal
          l.vx *= 0.98;
          if (l.vy > 2.8) l.vy *= 0.96;
          if (l.vy < 0.6) l.vy += 0.05;

          // Screen bounds reset
          if (l.y > height + 40 || l.x < -60 || l.x > width + 60) {
            leaves[i] = createLeaf();
          }

          // Draw individual leaf
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.rotation);

          // 3D perspective fold illusion
          const foldScaleX = Math.cos(l.swayPhase * 1.5);
          ctx.scale(Math.abs(foldScaleX) < 0.1 ? 0.1 : foldScaleX, 1);

          ctx.fillStyle = l.color;
          ctx.globalAlpha = l.opacity;
          ctx.shadowColor = 'rgba(13, 92, 70, 0.25)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 3;

          drawLeafPath(ctx, l.size, l.type);
          ctx.restore();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [mode, density]);

  if (mode === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    />
  );
};
