"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await axios.get(`https://dummyjson.com/products/${id}`);
                setJob(response.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchJob();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!job) return <p className="text-center text-red-500">Job not found</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full border border-gray-200"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                <p className="text-gray-500 text-lg">{job.brand}</p>
                <p className="text-gray-700 mt-4">📌 Location: Remote</p>
                <p className="text-gray-700">💰 Salary: ${job.price}</p>
                <p className="text-gray-700 mt-4">{job.description}</p>

                <button className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition">
                    Apply Now
                </button>

                <Link href="/" className="block mt-4 text-center text-blue-600 hover:underline">
                    ← Back to Jobs
                </Link>
            </motion.div>
        </div>
    );
}
