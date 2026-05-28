"use client";

import { useCallback, useRef } from "react";

interface LongPressOptions {
  threshold?: number;
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void;
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void;
}

export function useLongPress({ threshold = 500, onLongPress, onClick }: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      isLongPressRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress(e);
      }, threshold);
    },
    [onLongPress, threshold],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startPosRef.current) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startPosRef.current.x);
      const dy = Math.abs(touch.clientY - startPosRef.current.y);
      if (dx > 10 || dy > 10) {
        clear();
      }
    },
    [clear],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      clear();
      if (!isLongPressRef.current && onClick) {
        onClick(e);
      }
      startPosRef.current = null;
    },
    [clear, onClick],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startPosRef.current = { x: e.clientX, y: e.clientY };
      isLongPressRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress(e);
      }, threshold);
    },
    [onLongPress, threshold],
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      clear();
      if (!isLongPressRef.current && onClick) {
        onClick(e);
      }
      startPosRef.current = null;
    },
    [clear, onClick],
  );

  const onMouseLeave = useCallback(() => {
    clear();
    startPosRef.current = null;
  }, [clear]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
  };
}
