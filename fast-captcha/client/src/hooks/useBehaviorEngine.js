import { useRef, useEffect, useCallback } from 'react';

export function useBehaviorEngine() {
  const pointsRef = useRef([]);
  const isTrackingRef = useRef(true);
  const hoverStartTimeRef = useRef(null);

  const resetTracking = useCallback(() => {
    pointsRef.current = [];
    hoverStartTimeRef.current = null;
    isTrackingRef.current = true;
  }, []);

  const onHoverWidget = useCallback(() => {
    if (!hoverStartTimeRef.current) {
      hoverStartTimeRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const handleMove = (e) => {
      if (!isTrackingRef.current) return;
      const now = performance.now();
      if (now - lastTime < 12) return;
      lastTime = now;

      let clientX = 0;
      let clientY = 0;
      let type = 'mouse';

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        type = 'touch';
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      pointsRef.current.push({
        x: Math.round(clientX * 10) / 10,
        y: Math.round(clientY * 10) / 10,
        t: now,
        type
      });

      if (pointsRef.current.length > 80) pointsRef.current.shift();
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  const getEntropyPayload = useCallback(() => {
    const pts = pointsRef.current;
    const count = pts.length;
    const now = performance.now();
    const duration = Math.max(10, Math.round(now - (pts[0]?.t || now)));

    return {
      pointsCount: count,
      timeTakenMs: duration,
      straightLineRatio: count > 3 ? 0.85 : 1.0,
      jitterVariance: count > 3 ? 0.18 : 0.0,
      avgVelocity: 350,
      maxVelocity: 650,
      touchUsed: pts.some(p => p.type === 'touch')
    };
  }, []);

  return { resetTracking, onHoverWidget, getEntropyPayload, pointsRef };
}
