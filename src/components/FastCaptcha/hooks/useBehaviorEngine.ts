import { useRef, useEffect, useCallback } from 'react';

export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
  type: 'mouse' | 'touch';
}

export interface EntropyPayload {
  pointsCount: number;
  timeTakenMs: number;
  straightLineRatio: number;
  jitterVariance: number;
  avgVelocity: number;
  maxVelocity: number;
  touchUsed: boolean;
  angleVariance: number;
  samplePoints: Array<{ x: number; y: number }>;
}

/**
 * useBehaviorEngine: Zero-re-render mouse & touch entropy tracker using strict useRef.
 */
export function useBehaviorEngine() {
  const pointsRef = useRef<TrajectoryPoint[]>([]);
  const isTrackingRef = useRef<boolean>(true);
  const hoverStartTimeRef = useRef<number | null>(null);

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
    let lastRecordTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isTrackingRef.current) return;
      const now = performance.now();

      if (now - lastRecordTime < 12) return;
      lastRecordTime = now;

      let clientX = 0;
      let clientY = 0;
      let type: 'mouse' | 'touch' = 'mouse';

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        type = 'touch';
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      pointsRef.current.push({
        x: Math.round(clientX * 10) / 10,
        y: Math.round(clientY * 10) / 10,
        t: now,
        type,
      });

      if (pointsRef.current.length > 80) {
        pointsRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const getEntropyPayload = useCallback((): EntropyPayload => {
    const pts = pointsRef.current;
    const count = pts.length;
    const now = performance.now();
    const duration = Math.max(10, Math.round(now - (pts[0]?.t || now)));

    if (count < 3) {
      return {
        pointsCount: count,
        timeTakenMs: duration,
        straightLineRatio: 1.0,
        jitterVariance: 0.0,
        avgVelocity: 0,
        maxVelocity: 0,
        touchUsed: pts.some(p => p.type === 'touch'),
        angleVariance: 0,
        samplePoints: pts.map(p => ({ x: p.x, y: p.y })),
      };
    }

    const first = pts[0];
    const last = pts[count - 1];
    const directDist = Math.hypot(last.x - first.x, last.y - first.y);

    let pathDist = 0;
    let maxVel = 0;
    const velocities: number[] = [];
    const angles: number[] = [];

    for (let i = 1; i < count; i++) {
      const p1 = pts[i - 1];
      const p2 = pts[i];
      const segDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const dt = Math.max(1, p2.t - p1.t);
      const v = (segDist / dt) * 1000;

      pathDist += segDist;
      velocities.push(v);
      if (v > maxVel) maxVel = v;

      if (segDist > 1) {
        angles.push(Math.atan2(p2.y - p1.y, p2.x - p1.x));
      }
    }

    const straightLineRatio = pathDist > 0 ? +(directDist / pathDist).toFixed(4) : 1.0;

    let deviationSum = 0;
    if (directDist > 0) {
      const dx = last.x - first.x;
      const dy = last.y - first.y;
      for (let i = 1; i < count - 1; i++) {
        const p = pts[i];
        const distToLine = Math.abs(dy * p.x - dx * p.y + last.x * first.y - last.y * first.x) / directDist;
        deviationSum += distToLine;
      }
    }
    const jitterVariance = +(deviationSum / Math.max(1, count - 2)).toFixed(3);

    let angleDiffSum = 0;
    for (let i = 1; i < angles.length; i++) {
      let diff = Math.abs(angles[i] - angles[i - 1]);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      angleDiffSum += diff;
    }
    const angleVariance = +(angleDiffSum / Math.max(1, angles.length - 1)).toFixed(3);
    const avgVelocity = Math.round(velocities.reduce((a, b) => a + b, 0) / Math.max(1, velocities.length));

    return {
      pointsCount: count,
      timeTakenMs: duration,
      straightLineRatio,
      jitterVariance,
      avgVelocity,
      maxVelocity: Math.round(maxVel),
      touchUsed: pts.some(p => p.type === 'touch'),
      angleVariance,
      samplePoints: pts.slice(-15).map(p => ({ x: p.x, y: p.y })),
    };
  }, []);

  return {
    resetTracking,
    onHoverWidget,
    getEntropyPayload,
    pointsRef,
  };
}
