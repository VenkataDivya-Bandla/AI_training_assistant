import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const formatTime = (seconds) => {
  const s = Math.floor(seconds || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const hh = h > 0 ? `${h}:` : '';
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(sec).padStart(2, '0');
  return `${hh}${mm}:${ss}`;
};

const VideoPlayer = ({ src, youtubeId, startAt = 0, minDurationMinutes = 30, onDuration, onProgress, onManualComplete }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (youtubeId) {
      // For YouTube videos, we'll track time spent on the page
      // and mark as complete after watching for 80% of estimated duration
      let startTime = Date.now();
      let progressInterval;
      
      const updateProgress = () => {
        const timeSpent = (Date.now() - startTime) / 1000; // seconds
        const estimatedDuration = minDurationMinutes * 60; // convert to seconds
        const progress = Math.min(timeSpent / (estimatedDuration * 0.8), 1.0); // 80% of estimated time
        
        if (onProgress) {
          onProgress(progress);
        }
        
        if (progress >= 1.0) {
          clearInterval(progressInterval);
        }
      };
      
      // Update progress every 10 seconds
      progressInterval = setInterval(updateProgress, 10000);
      
      // Also update on page visibility change (user might be watching)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          updateProgress();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(progressInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      const videoDuration = video.duration || 0;
      setDuration(videoDuration);
      if (onDuration) {
        onDuration(videoDuration);
      }
    };
    
    const onTimeUpdate = () => {
      const current = video.currentTime || 0;
      setCurrentTime(current);
      if (onProgress && duration > 0) {
        const progress = current / duration;
        onProgress(progress);
      }
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      if (onProgress) {
        onProgress(1.0); // Mark as 100% complete when video ends
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [youtubeId, onDuration, onProgress, duration]);

  const togglePlay = () => {
    if (youtubeId) return; // Controls handled by YouTube UI
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (delta) => {
    if (youtubeId) return; // Not supported for iframe without API
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + delta, video.duration || 0));
  };

  const handleProgressChange = (e) => {
    if (youtubeId) return;
    const video = videoRef.current;
    if (!video || !duration) return;
    const value = Number(e.target.value);
    video.currentTime = (value / 100) * duration;
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const handleRateChange = (e) => {
    const r = Number(e.target.value);
    setPlaybackRate(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
  };

  const toggleFullscreen = async () => {
    const container = document.getElementById('video-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const meetsMinDuration = youtubeId ? true : (duration / 60) >= minDurationMinutes;

  return (
    <div id="video-container" className="bg-black">
      {youtubeId ? (
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1${startAt ? `&start=${startAt}` : ''}`}
            title="Course video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-[340px] md:h-[420px] lg:h-[480px]"
          controls={false}
          preload="metadata"
        />
      )}

      <div className="p-3 bg-black/70 text-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => seekBy(-10)} className="text-white" disabled={!!youtubeId}>
            <Icon name="RotateCcw" size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white" disabled={!!youtubeId}>
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => seekBy(10)} className="text-white" disabled={!!youtubeId}>
            <Icon name="RotateCw" size={18} />
          </Button>

          <div className="flex-1 mx-3">
            {!youtubeId && (
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={handleProgressChange}
              className="w-full"
            />)}
            {!youtubeId && (
            <div className="flex items-center justify-between text-xs mt-1 opacity-80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>)}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="Volume2" size={16} />
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} />
            </div>

            {!youtubeId && (
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} />
              <select value={playbackRate} onChange={handleRateChange} className="bg-transparent border rounded px-1 py-0.5">
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={1.75}>1.75x</option>
                <option value={2}>2x</option>
              </select>
            </div>)}

            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
              <Icon name={isFullscreen ? 'Minimize' : 'Maximize'} size={18} />
            </Button>
          </div>
        </div>

        {!meetsMinDuration && (
          <div className="mt-2 text-xs text-warning-foreground">
            Minimum duration requirement: {minDurationMinutes} min. Current video is {Math.round(duration / 60)} min.
          </div>
        )}
        
        {onManualComplete && (
          <div className="mt-3 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onManualComplete()}
              className="text-white border-white hover:bg-white hover:text-black"
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Mark as Completed
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default VideoPlayer;


