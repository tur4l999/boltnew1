import React, { useRef } from 'react';
import { IconButton } from '../ui/IconButton';

interface VideoPlayerProps {
  src: string;
  watermark: string;
}

export function VideoPlayer({ src, watermark }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };
  
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration || videoRef.current.currentTime + 10,
        videoRef.current.currentTime + 10
      );
    }
  };
  
  const requestPictureInPicture = () => {
    if (videoRef.current && 'pictureInPictureEnabled' in document) {
      videoRef.current.requestPictureInPicture?.();
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        className="w-full h-56 object-cover"
      />
      <div className="absolute right-2 bottom-2 text-xs text-white/70 pointer-events-none select-none">
        {watermark}
      </div>
      <div className="absolute left-2 top-2 flex gap-2">
        <IconButton 
          label="Skip back 10s" 
          onClick={skipBackward}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          ⏪
        </IconButton>
        <IconButton 
          label="Skip forward 10s" 
          onClick={skipForward}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          ⏩
        </IconButton>
        <IconButton 
          label="Picture in Picture" 
          onClick={requestPictureInPicture}
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        >
          🖼️
        </IconButton>
      </div>
    </div>
  );
}