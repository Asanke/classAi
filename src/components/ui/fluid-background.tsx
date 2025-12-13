"use client";

import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

export function FluidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const fluid = new WebGLFluidEnhanced(canvasRef.current);
            fluid.setConfig({
                startSplats: 8,
                densityDissipation: 0.98,
                velocityDissipation: 0.99,
                pressure: 0.8,
                pressureIterations: 20,
                curl: 30,
                splatRadius: 0.4,
                fluidColor: [50 / 255, 150 / 255, 255 / 255], // RGB values normalized to 0-1
                transparent: true,
                bloom: true,
                bloomIntensity: 0.5,
                bloomThreshold: 0.2,
            });
            fluid.start();

            return () => {
                fluid.stop();
            };
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
