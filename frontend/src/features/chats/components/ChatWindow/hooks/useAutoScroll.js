import { useEffect, useRef } from "react";

export function useAutoScroll(trigger) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [trigger]); 

  return ref;
}