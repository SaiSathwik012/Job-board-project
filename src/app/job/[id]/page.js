"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiBriefcase, FiDollarSign, FiMapPin } from "react-icons/fi";

export default function JobApplication({ params }) {
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: ""
    });
    const router = useRouter();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data.job);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formPayload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formPayload.append(key, value);
            });

            const response = await fetch(`/api/jobs/${params.id}/apply`, {
                method: 'POST',
                body: formPayload
            });

            if (response.ok) {
                alert('Application submitted successfully!');
                router.push('/');
            } else {
                throw new Error('Application failed');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job not found</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    The job you&apos;re looking for doesn t exist or may have been removed.
                </p>
                <Link href="/" className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FiArrowLeft className="mr-2" />
                    Back to Job Board
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <Link href={`/job/${params.id}`} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
                    <FiArrowLeft className="mr-2" />
                    Back to Job Details
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.jobTitle}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{job.companyName}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiBriefcase className="mr-2" />
                            <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiDollarSign className="mr-2" />
                            <span>{job.salary || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiMapPin className="mr-2" />
                            <span>{job.location}</span>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Description</h3>
                        <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Apply for this Position</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Resume (PDF)
                                </label>
                                <input
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    required
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 dark:hover:file:bg-blue-800/30"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cover Letter (Optional)
                            </label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                rows="4"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}