"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
  Star,
} from "lucide-react";

const reviews = [
  {
    name: "Daniel Carter",
    role: "Startup Founder",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    review:
      "Orvexa made finding the right freelancer incredibly easy. The whole process felt simple, secure, and professional from start to finish.",
  },
  {
    name: "Sarah Wilson",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    review:
      "I have worked with several freelance platforms, but Orvexa feels much cleaner. Communication with clients is straightforward and everything is easy to manage.",
  },
  {
    name: "Michael Lee",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    review:
      "We needed a freelancer quickly for an important project. We found exactly the right person on Orvexa and the delivery was excellent.",
  },
  {
    name: "Emma Davis",
    role: "Business Owner",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 4,
    review:
      "The experience was smooth from purchasing the service to receiving the final delivery. I especially liked how transparent the process was.",
  },
  {
    name: "James Anderson",
    role: "Founder",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 5,
    review:
      "Orvexa helped us connect with talented people without wasting time searching through hundreds of profiles. Definitely a great experience.",
  },
];

export default function ClientReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  const previousReview = () => {
    setActiveIndex(
      (current) => (current - 1 + reviews.length) % reviews.length,
    );
  };

  const nextReview = () => {
    setActiveIndex((current) => (current + 1) % reviews.length);
  };

  const review = reviews[activeIndex];

  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 sm:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/[0.035] blur-[150px]" />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-12">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Client reviews
          </span>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Loved by people who
            <span className="text-brand-green"> get things done.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-white/40 sm:text-lg">
            See what clients and professionals say about their experience
            with Orvexa.
          </p>
        </div>

        {/* Slider */}
        <div
          className="mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/2">
            {/* Top green line */}
            <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-brand-green/50 to-transparent" />

            <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              {/* Quote icon */}
              <div className="absolute right-7 top-7 opacity-[0.06] sm:right-10 sm:top-10">
                <Quote size={90} strokeWidth={1} />
              </div>

              {/* Rating */}
              <div className="relative flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill="currentColor"
                    className={
                      index < review.rating
                        ? "text-brand-green"
                        : "text-white/10"
                    }
                  />
                ))}
              </div>

              {/* Review */}
              <blockquote
                key={activeIndex}
                className="relative mt-7 max-w-3xl animate-[review-in_500ms_ease-out]"
              >
                <p className="text-xl font-medium leading-9 tracking-tight text-white sm:text-2xl sm:leading-10 lg:text-[28px] lg:leading-[1.6]">
                  “{review.review}”
                </p>
              </blockquote>

              {/* Client */}
              <div className="mt-9 flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/8"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    {review.name}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 sm:bottom-8 sm:right-10">
              <button
                type="button"
                onClick={previousReview}
                aria-label="Previous review"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/50 transition-all duration-300 hover:border-brand-green/30 hover:bg-brand-green hover:text-brand-navy"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                type="button"
                onClick={nextReview}
                aria-label="Next review"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-white/50 transition-all duration-300 hover:border-brand-green/30 hover:bg-brand-green hover:text-brand-navy"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-7 flex items-center justify-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to review ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-8 bg-brand-green"
                    : "w-1.5 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes review-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
