"use client";

export default function DashboardStyles() {
  return (
    <style>{`
      @keyframes dash-rise {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes dash-slide {
        from { opacity: 0; transform: translateX(-12px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes dash-grow-y {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
      }
      @keyframes dash-grow-x {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @keyframes dash-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes dash-ping {
        0% { transform: scale(1); opacity: 0.6; }
        80%, 100% { transform: scale(2.6); opacity: 0; }
      }

      .dash-rise {
        opacity: 0;
        animation: dash-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--d, 0ms);
      }
      .dash-slide {
        opacity: 0;
        animation: dash-slide 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--d, 0ms);
      }
      .dash-grow-y {
        animation: dash-grow-y 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--d, 0ms);
      }
      .dash-grow-x {
        animation: dash-grow-x 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--d, 0ms);
      }
      .dash-shimmer {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.04) 25%,
          rgba(255, 255, 255, 0.09) 50%,
          rgba(255, 255, 255, 0.04) 75%
        );
        background-size: 200% 100%;
        animation: dash-shimmer 1.6s linear infinite;
      }
      .dash-ping {
        animation: dash-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .dash-rise, .dash-slide, .dash-grow-y, .dash-grow-x,
        .dash-shimmer, .dash-ping {
          animation: none !important;
          opacity: 1;
          transform: none;
        }
      }
    `}</style>
  );
}
