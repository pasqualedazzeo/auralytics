import React, { useRef, useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioContext: AudioContext | null | undefined;
  analyser: AnalyserNode | null | undefined;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isRecording, 
  audioContext, 
  analyser 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Debug function to check what's happening
  useEffect(() => {
    if (isRecording) {
      console.log("Recording state:", isRecording);
      console.log("Audio context:", audioContext?.state);
      console.log("Analyser:", analyser ? "exists" : "null");
      
      setDebugInfo(`Recording: ${isRecording}, Context: ${audioContext?.state}, Analyser: ${analyser ? "exists" : "null"}`);
    }
  }, [isRecording, audioContext, analyser]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous animation frame if it exists
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Set canvas dimensions to match display size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initial clear with background color
    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Only start visualization if recording and analyser exists
    if (isRecording && analyser && audioContext?.state === 'running') {
      // Create a new array to hold the frequency data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const draw = () => {
        // Safety check
        if (!isRecording || !analyser || !ctx) {
          return;
        }
        
        // Schedule the next frame
        animationRef.current = requestAnimationFrame(draw);
        
        // Get the frequency data
        analyser.getByteFrequencyData(dataArray);
        
        // Clear the canvas
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate bar width based on canvas width and buffer length
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        
        // Draw the frequency bars
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          
          // Use a fallback height for visualization if no real data
          const displayHeight = isRecording ? Math.max(barHeight, 1) : 0;
          
          // Create a gradient color based on frequency
          const hue = (i / bufferLength) * 120 + 180;
          ctx.fillStyle = `hsl(${hue}, 100%, ${50 + (displayHeight / 2)}%)`;
          
          // Draw the bar
          ctx.fillRect(x, canvas.height - displayHeight, barWidth, displayHeight);
          
          x += barWidth + 1;
        }
      };
      
      // Start the animation loop
      draw();
    } else {
      // If not recording, draw a flat line or idle state
      const width = canvas.width;
      const height = canvas.height;
      
      // Draw background
      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw idle line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgb(50, 50, 50)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRecording, audioContext, analyser]);
  
  return (
    <div className="w-full h-32 bg-neutral-100 rounded-lg overflow-hidden mb-6 relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {/* Debug info - remove in production */}
      {debugInfo && (
        <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
          {debugInfo}
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
