"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { FiBriefcase, FiDollarSign, FiMapPin, FiClock, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample data (would normally come from API)
const sampleJobs = [
    {
        _id: "1",
        jobTitle: "Frontend Developer",
        companyName: "TechCorp",
        description: `We are looking for an experienced frontend developer to join our team building modern web applications with React and Next.js. You will work closely with our design and backend teams to create responsive, accessible, and performant user interfaces.

Responsibilities:
- Develop new user-facing features
- Build reusable components and front-end libraries
- Optimize applications for maximum performance
- Collaborate with team members on technical design
- Participate in code reviews

Requirements:
- 3+ years experience with React
- Proficient in JavaScript, HTML5, CSS3
- Experience with Redux or similar state management
- Familiarity with RESTful APIs
- Knowledge of modern authorization mechanisms`,
        salary: "$80K - $120K",
        location: "San Francisco",
        jobType: "Full-Time",
        isFeatured: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        requirements: [
            "3+ years experience with React",
            "Proficient in JavaScript, HTML5, CSS3",
            "Experience with Redux or similar state management",
            "Familiarity with RESTful APIs",
            "Knowledge of modern authorization mechanisms"
        ],
        benefits: [
            "Competitive salary and equity",
            "Health, dental, and vision insurance",
            "401(k) matching",
            "Flexible work hours",
            "Professional development budget"
        ]
    },
    {
        _id: "2",
        jobTitle: "UX Designer",
        companyName: "DesignHub",
        description: `Join our design team to create beautiful and intuitive user experiences for our products. You'll be involved in the entire design process from concept to implementation.

Responsibilities:
- Create user flows, wireframes, and prototypes
- Conduct user research and usability testing
- Collaborate with product managers and engineers
- Develop and maintain design systems
- Present designs to stakeholders

Requirements:
- 2+ years of UX design experience
- Portfolio demonstrating strong UX skills
- Proficiency with Figma or similar tools
- Understanding of user-centered design principles
- Excellent communication skills`,
        salary: "$70K - $100K",
        location: "Remote",
        jobType: "Full-Time",
        isFeatured: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        requirements: [
            "2+ years of UX design experience",
            "Portfolio demonstrating strong UX skills",
            "Proficiency with Figma or similar tools",
            "Understanding of user-centered design principles",
            "Excellent communication skills"
        ],
        benefits: [
            "Remote work flexibility",
            "Annual design conference budget",
            "Latest hardware and software",
            "Wellness program",
            "Generous vacation policy"
        ]
    }
];

async function fetchJobData(id) {
    try {
        // First try to fetch from API
        const response = await fetch(`/api/jobs/${id}`);
        if (response.ok) {
            const data = await response.json();
            return data.job;
        }
    } catch (error) {
        console.error("Error fetching job:", error);
    }

    // Fallback to sample data if API fails
    return sampleJobs.find(job => job._id === id) || null;
}

export default function JobDetails({ params }) {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Properly unwrap the params promise
    const unwrappedParams = use(params);
    const jobId = unwrappedParams.id;

    useEffect(() => {
        const loadJob = async () => {
            const jobData = await fetchJobData(jobId);
            setJob(jobData);
            setLoading(false);
        };

        loadJob();
    }, [jobId]);

    const getDaysAgo = (date) => {
        if (!date) return "Recently";
        const diffInDays = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        return diffInDays === 0 ? "Today" : `${diffInDays}d ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        The job you&apos;re looking for doesn&apos;t exist or may have been removed.
                    </p>
                    <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <FiChevronLeft className="mr-2" />
                        Back to Job Board
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <FiChevronLeft className="mr-2" />
                        Back to all jobs
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {job.jobTitle}
                                </h1>
                                <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                                    {job.companyName}
                                </h2>
                            </div>
                            {job.isFeatured && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    Featured
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <FiBriefcase className="mr-2" />
                                <span>{job.jobType}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <FiDollarSign className="mr-2" />
                                <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <FiMapPin className="mr-2" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <FiClock className="mr-2" />
                                <span>{getDaysAgo(job.createdAt)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Description</h3>
                            <div className="prose dark:prose-invert max-w-none">
                                {job.description.split('\n').map((paragraph, i) => (
                                    <p key={i} className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {job.requirements && job.requirements.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                    {job.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.benefits && job.benefits.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Benefits</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                    {job.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                href={`/job/${job._id}/apply`}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-center font-medium transition"
                            >
                                Apply Now
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-lg font-medium transition"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}