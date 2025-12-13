"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, systemTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Theme configuration
        const currentTheme = theme === "system" ? systemTheme : theme;
        const isDark = currentTheme === "dark";

        // Configuration matching Particle.js aesthetics
        const config = {
            bgColor: isDark ? "rgb(10, 15, 30)" : "#ffffff",
            particleColor: isDark ? "rgba(45, 212, 191, 0.8)" : "rgba(37, 99, 235, 0.8)", // Teal vs Blue
            lineColor: isDark ? "rgba(45, 212, 191," : "rgba(37, 99, 235,",
            particleCount: Math.floor((width * height) / 10000), // Responsive count
            connectionDistance: 150,
            mouseDistance: 200,
        };

        const particles: Particle[] = [];
        const mouse = { x: 0, y: 0 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5; // Slightly faster for particle.js feel
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseDistance) {
                    if (distance < config.mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (config.mouseDistance - distance) / config.mouseDistance;
                        const directionX = forceDirectionX * force * 2; // Stronger repulsion near mouse
                        const directionY = forceDirectionY * force * 2;
                        // this.vx -= directionX;
                        // this.vy -= directionY;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = config.particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.fillStyle = config.bgColor;
            ctx.fillRect(0, 0, width, height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                for (let j = index; j < particles.length; j++) {
                    const dx = particles[j].x - particle.x;
                    const dy = particles[j].y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        ctx.beginPath();
                        const opacity = 1 - distance / config.connectionDistance;
                        ctx.strokeStyle = `${config.lineColor} ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            config.particleCount = Math.floor((width * height) / 10000);
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        init();
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animId);
        };
    }, [theme, systemTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10" // Changed Z-index to -10 to be safer
        />
    );
}
