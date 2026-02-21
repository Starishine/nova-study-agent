"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PlannerPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const name = searchParams.get("name")?.trim() || "Anonymous";

    const [assignment, setAssignment] = useState("");
    const [deadline, setDeadline] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async () => {
        if (!assignment || !deadline) return;
        if (deadline < today) return;

        setLoading(true);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assignment, deadline }),
            });

            const data = await response.json();

            setResult(data.result);
            setSubmitted(true);
        } catch (error) {
            console.error("Error generating plan:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ scale: 1.05, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative flex flex-col items-center justify-center min-h-screen bg-[#111114] text-white overflow-hidden"
                    >
                        <div className="absolute w-[500px] h-[500px] bg-purple-400 rounded-full blur-[180px] opacity-20 top-[-150px] left-[-150px]" />
                        <div className="absolute w-[400px] h-[400px] bg-blue-300 rounded-full blur-[150px] opacity-20 bottom-[-120px] right-[-120px]" />
                        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:50px_50px] opacity-10" />

                        <h1 className="text-5xl font-semibold text-center mb-8 tracking-tight z-10">
                            Hello {name}, how can I help you today?
                        </h1>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-lg z-10">
                            <textarea
                                placeholder="Paste your assignment description..."
                                className="w-full p-4 mb-4 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-gray-400"
                                rows={4}
                                value={assignment}
                                onChange={(e) => setAssignment(e.target.value)}
                            />

                            <input
                                type="date"
                                className="w-full p-4 mb-6 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={deadline}
                                min={today}
                                onChange={(e) => setDeadline(e.target.value)}
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 text-black font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {loading ? "Generating..." : "Generate Plan ✨"}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-10"
                    >
                        <h2 className="text-4xl font-semibold mb-4 text-gray-800">
                            Your Study Plan
                        </h2>

                        <p className="mb-10 text-gray-500 italic">
                            Structured, realistic, and stress-balanced.
                        </p>

                        <div className="max-w-2xl w-full bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="whitespace-pre-wrap text-gray-700">
                                {result}
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            ← Back
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
