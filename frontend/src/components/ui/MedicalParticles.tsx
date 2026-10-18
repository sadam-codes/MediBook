import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    radius: number;
    baseRadius: number;
    vx: number;
    vy: number;
    color: string;
    alpha: number;
    phase: number;
}

interface MedicalParticlesProps {
    className?: string;
    particleCount?: number;
    interactive?: boolean;
    connectLines?: boolean;
    speed?: number;
}

export const MedicalParticles: React.FC<MedicalParticlesProps> = ({
    className = 'absolute inset-0 pointer-events-none overflow-hidden',
    particleCount = 20,
    interactive = true,
    connectLines = true,
    speed = 0.35,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mouseRef = useRef<{ x: number | null; y: number | null; radius: number }>({
        x: null,
        y: null,
        radius: 120
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Check reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let animationFrameId: number;
        let isVisible = true;
        let width = 0;
        let height = 0;
        let particles: Particle[] = [];

        // Healthcare palette: Forest green, deep teal, mint, sage
        const palette = [
            'rgba(36, 91, 84, 0.22)',   // Teal
            'rgba(189, 232, 218, 0.35)', // Mint
            'rgba(23, 61, 57, 0.18)',   // Forest green
            'rgba(142, 208, 190, 0.28)'  // Soft seafoam
        ];

        // Mobile responsiveness: Reduce count on small screens
        const isMobile = window.innerWidth < 768;
        const effectiveCount = isMobile ? Math.max(8, Math.floor(particleCount * 0.4)) : particleCount;

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < effectiveCount; i++) {
                const radius = Math.random() * 2.5 + 1.5;
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius,
                    baseRadius: radius,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    alpha: Math.random() * 0.4 + 0.2,
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.parentElement?.clientHeight || window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);
            initParticles();
        };

        resize();

        const ro = new ResizeObserver(() => resize());
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        // Pause animation when out of view (Battery & CPU conservation)
        const io = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId) {
                render();
            }
        }, { threshold: 0.05 });
        io.observe(canvas);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isVisible = false;
            } else {
                isVisible = true;
                if (!animationFrameId) render();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const handleMouseMove = (e: MouseEvent) => {
            if (!interactive) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        if (interactive && canvas.parentElement) {
            canvas.parentElement.addEventListener('mousemove', handleMouseMove);
            canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
        }

        const render = () => {
            if (!isVisible) {
                animationFrameId = 0;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Connect lines if enabled (subtle molecular / node look)
            if (connectLines) {
                const maxDist = isMobile ? 80 : 110;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < maxDist) {
                            const opacity = (1 - dist / maxDist) * 0.12;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(36, 91, 84, ${opacity})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Gentle drift
                p.x += p.vx;
                p.y += p.vy;
                p.phase += 0.02;

                // Subtle breathing pulse
                const pulseRadius = p.baseRadius + Math.sin(p.phase) * 0.4;

                // Wrap around edges seamlessly
                if (p.x < -10) p.x = width + 10;
                else if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                else if (p.y > height + 10) p.y = -10;

                // Subtle mouse repulsion
                if (interactive && mouseRef.current.x !== null && mouseRef.current.y !== null) {
                    const mdx = p.x - mouseRef.current.x;
                    const mdy = p.y - mouseRef.current.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < mouseRef.current.radius && mdist > 0) {
                        const force = (1 - mdist / mouseRef.current.radius) * 1.5;
                        p.x += (mdx / mdist) * force;
                        p.y += (mdy / mdist) * force;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, pulseRadius), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (canvas.parentElement) {
                canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
                canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [particleCount, interactive, connectLines, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            aria-hidden="true"
        />
    );
};
