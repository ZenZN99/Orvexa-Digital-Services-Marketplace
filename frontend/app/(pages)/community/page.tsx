"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

const posts = [
  {
    id: 1,
    name: "Alex Morgan",
    username: "@alexmorgan",
    avatar: "/images/avatars/avatar-1.png",
    time: "2h",
    text: "Just finished a new SaaS dashboard for a client. Really happy with how the final result turned out.",
    likes: 42,
    comments: 8,
    tags: ["SaaS", "Design", "Development"],
  },
  {
    id: 2,
    name: "Sarah Wilson",
    username: "@sarahw",
    avatar: "/images/avatars/avatar-2.png",
    time: "5h",
    text: "What makes a freelance project go smoothly for you? For me, clear requirements from day one make a huge difference.",
    likes: 76,
    comments: 19,
    tags: ["Freelancing", "Discussion"],
  },
  {
    id: 3,
    name: "Daniel Kim",
    username: "@danielkim",
    avatar: "/images/avatars/avatar-3.png",
    time: "1d",
    text: "Sharing a few lessons I learned while building my first production application.",
    likes: 31,
    comments: 6,
    tags: ["Engineering", "Learning"],
  },
];

const suggestions = [
  {
    name: "Maya Chen",
    username: "@mayachen",
    avatar: "/images/avatars/avatar-4.png",
  },
  {
    name: "James Carter",
    username: "@jamesc",
    avatar: "/images/avatars/avatar-5.png",
  },
  {
    name: "Nora Ahmed",
    username: "@noraahmed",
    avatar: "/images/avatars/avatar-6.png",
  },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-brand-navy text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-brand-navy/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            Orvexa
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/services"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Services
            </Link>

            <Link
              href="/community"
              className="text-sm font-medium text-brand-green"
            >
              Community
            </Link>
          </div>

          <Link
            href="/services"
            className="rounded-lg bg-brand-green px-4 py-2 text-xs font-semibold text-brand-navy transition hover:brightness-110"
          >
            Explore services
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/35">
            <Users size={15} />
            Community
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Orvexa Community
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            A place for freelancers and clients to share ideas, projects,
            knowledge, and experiences.
          </p>
        </div>

        {/* Community preview */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[8 bg-white/2">
          {/* Blurred application */}
          <div className="pointer-events-none select-none blur-[6px]">
            <div className="grid lg:grid-cols-[1fr_300px]">
              {/* Feed */}
              <div className="border-r border-white/[0.07]">
                {/* Create post */}
                <div className="border-b border-white/[0.07] p-5">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />

                    <div className="flex-1 rounded-xl border border-white/8 bg-white/2.5 px-4 py-3 text-sm text-white/25">
                      Share something with the community...
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div className="flex gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} />
                        Post
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        Project
                      </span>
                    </div>

                    <button className="rounded-lg bg-brand-green px-4 py-2 text-xs font-semibold text-brand-navy">
                      Post
                    </button>
                  </div>
                </div>

                {/* Posts */}
                <div>
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="border-b border-white/[0.07] p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                            <Image
                              src={post.avatar}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">
                                {post.name}
                              </span>

                              <CheckCircle2
                                size={13}
                                className="text-brand-green"
                              />
                            </div>

                            <p className="text-xs text-white/30">
                              {post.username} · {post.time}
                            </p>
                          </div>
                        </div>

                        <MoreHorizontal size={18} className="text-white/25" />
                      </div>

                      <p className="mt-4 text-sm leading-6 text-white/60">
                        {post.text}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/35"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-6 text-xs text-white/30">
                        <span className="flex items-center gap-1.5">
                          <Heart size={15} />
                          {post.likes}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MessageCircle size={15} />
                          {post.comments}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Bookmark size={15} />
                          Save
                        </span>

                        <span className="ml-auto flex items-center gap-1.5">
                          <Send size={14} />
                          Share
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="hidden p-5 lg:block">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <div className="rounded-lg border border-white/8 bg-white/2.5 py-2.5 pl-9 text-xs text-white/25">
                    Search community
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/8 bg-white/2 p-4">
                  <h3 className="text-sm font-semibold">People to follow</h3>

                  <div className="mt-4 space-y-4">
                    {suggestions.map((person) => (
                      <div
                        key={person.username}
                        className="flex items-center gap-3"
                      >
                        <div className="h-9 w-9 rounded-full bg-white/10" />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">
                            {person.name}
                          </p>

                          <p className="truncate text-[11px] text-white/30">
                            {person.username}
                          </p>
                        </div>

                        <button className="rounded-md border border-white/10 px-2.5 py-1 text-[10px] text-white/50">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/8 bg-white/2 p-4">
                  <p className="text-xs text-white/30">Community</p>
                  <p className="mt-2 text-lg font-semibold">12.4K</p>
                  <p className="mt-1 text-xs text-white/30">
                    freelancers & clients
                  </p>
                </div>
              </aside>
            </div>
          </div>

          {/* Coming soon overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-navy/45 px-5 backdrop-blur-[2px]">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-navy/90 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-9">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10">
                <Users size={25} className="text-brand-green" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                Coming soon
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                The community is coming.
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
                We&apos;re building a space where freelancers and clients can
                connect, share knowledge, showcase their work, and grow
                together.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
              >
                Explore services
                <ArrowLeft size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/2 p-5 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold">
              Something bigger is being built.
            </p>

            <p className="mt-1 text-xs text-white/35">
              The community will be available in a future Orvexa release.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-brand-green transition hover:text-white"
          >
            Browse services
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
