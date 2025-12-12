"use client";

import { useEffect, useRef } from "react";

export const PlexusBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const particles: Particle[] = [];
        const properties = {
            bgColor: "rgba(17, 17, 19, 1)",
            particleColor: "rgba(46, 169, 209, 0.5)", // Cyan-ish
            particleRadius: 3,
            particleCount: 60,
            lineLength: 150,
            particleLife: 6,
        };

        class Particle {
            x: number;
            y: number;
            velocityX: number;
            velocityY: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.velocityX = (Math.random() - 0.5) * 1.5; // Moderate speed
                this.velocityY = (Math.random() - 0.5) * 1.5;
            }

            position() {
                this.x += this.velocityX;
                this.y += this.velocityY;

                if (this.x > w || this.x < 0) this.velocityX *= -1;
                if (this.y > h || this.y < 0) this.velocityY *= -1;
            }

            reDraw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = properties.particleColor;
                ctx.fill();
            }
        }

        const reDrawBackground = () => {
            ctx.clearRect(0, 0, w, h);
            // ctx.fillStyle = properties.bgColor;
            // ctx.fillRect(0, 0, w, h);
        };

        const drawLines = () => {
            let x1, y1, x2, y2, length, opacity;
            for (let i = 0; i < particles.length; i++) {
                for (let j = 0; j < particles.length; j++) {
                    x1 = particles[i].x;
                    y1 = particles[i].y;
                    x2 = particles[j].x;
                    y2 = particles[j].y;
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    if (length < properties.lineLength) {
                        opacity = 1 - length / properties.lineLength;
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = `rgba(46, 169, 209, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
        };

        const reDrawParticles = () => {
            for (let i in particles) {
                particles[i].position();
                particles[i].reDraw();
            }
        };

        const loop = () => {
            reDrawBackground();
            reDrawParticles();
            drawLines();
            requestAnimationFrame(loop);
        };

        const init = () => {
            for (let i = 0; i < properties.particleCount; i++) {
                particles.push(new Particle());
            }
            loop();
        };

        init();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none opacity-30 dark:opacity-20"
        />
    );
};
