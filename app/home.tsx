"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";

export default function HomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim() || "Anonymous";
    router.push(`/planner?name=${encodeURIComponent(normalizedName)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111114] text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-semibold mb-3">Welcome</h1>
        <p className="text-gray-300 mb-6">Enter your name to continue.</p>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 mb-4 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 text-black font-semibold hover:opacity-90 transition-all"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
