import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AnimatedError({ message, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (message) {
      gsap.fromTo(
        ref.current,
        { height: 0, opacity: 0 },
        {
          height: ref.current.scrollHeight,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(ref.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [message]);

  return (
    <div ref={ref} style={{ height: 0, overflow: "hidden" }} className={className}>
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}