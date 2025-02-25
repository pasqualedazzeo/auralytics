import React, { useRef, useEffect } from 'react';

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
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRecording || !analyser) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const dataArray = new Uint8Array(analyser instanceof AnalyserNode ? analyser.frequencyBinCount : 128);
    
    const draw = () => {
      if (!isRecording) return;
      
      requestAnimationFrame(draw);
      
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgb(20, 20, 20)';
        ctx.fillRect(0, 0, width, height);
        
        const barWidth = (width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i] / 2;
          
          ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight);
          
          x += barWidth + 1;
        }
      }
    };
    
    draw();
  }, [isRecording, analyser]);
  
  return (
    <div className="w-full h-32 bg-neutral-100 rounded-lg overflow-hidden mb-6">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={128} 
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
