import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isRecording, 
  audioContext, 
  analyser 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRecording || !audioContext || !analyser) return;

    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteTimeDomainData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(249, 250, 251)'; // bg-gray-50
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(79, 70, 229)'; // indigo-600
      
      canvasCtx.beginPath();
      
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvas.height / 2);
        
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioContext, analyser]);

  return (
    <div className="bg-gray-50 rounded-lg p-2 mb-4 relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-16 rounded"
        width={1000}
        height={100}
      />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-gray-500">Audio visualization will appear here when recording</p>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
