"use client";
import { useEffect, useRef, useState } from "react";

export function useLocalForm<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { 
      const raw = localStorage.getItem(key); 
      return raw ? JSON.parse(raw) as T : initial; 
    } catch { 
      return initial; 
    }
  });
  
  const timeout = useRef<number | null>(null);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      try { 
        localStorage.setItem(key, JSON.stringify(state)); 
      } catch {
        // Silently fail if localStorage is unavailable
      }
    }, 250);
    
    return () => { 
      if (timeout.current) window.clearTimeout(timeout.current); 
    };
  }, [key, state]);
  
  return [state, setState] as const;
}