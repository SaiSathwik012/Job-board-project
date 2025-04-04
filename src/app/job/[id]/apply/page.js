"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiFileText, FiLinkedin, FiGithub, FiChevronLeft, FiCheck } from "react-icons/fi";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

export default function JobApplication({ params }) {
    const router = useRouter();
    const { width, height } = useWindowSize();
    const unwrappedParams = use(params);
    const jobId = unwrappedParams.id;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: "",
        linkedin: "",
        github: "",
        portfolio: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (submitSuccess) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitSuccess]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.resume) newErrors.resume = "Resume is required";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    formPayload.append(key, formData[key]);
                }
            }
            formPayload.append('jobId', jobId);

            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitSuccess(true);
        } catch (error) {
            console.error("Submission error:", error);
            setErrors({ submit: "Failed to submit application. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
                {showConfetti && (
                    <>
                        <Confetti
                            width={width}
                            height={height}
                            recycle={false}
                            numberOfPieces={500}
                            gravity={0.2}
                            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute balloon"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        bottom: '-50px',
                                        width: `${30 + Math.random() * 30}px`,
                                        height: `${40 + Math.random() * 40}px`,
                                        background: `hsl(${Math.random() * 360}, 100%, 75%)`,
                                        borderRadius: '50%',
                                        animation: `floatUp ${3 + Math.random() * 4}s linear forwards`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        opacity: 0
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md w-full text-center relative z-10">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                        <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Application Submitted!</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Thank you for applying. We&apos;ve received your application and will review it shortly.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Job Board
                        </button>
                    </div>
                </div>

                <style jsx global>{`
                    @keyframes floatUp {
                        0% {
                            transform: translateY(0) rotate(0deg);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                    .balloon {
                        position: absolute;
                        border-radius: 50%;
                    }
                    .balloon:before {
                        content: '';
                        position: absolute;
                        width: 2px;
                        height: 50px;
                        background: rgba(0,0,0,0.1);
                        bottom: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
                >
                    <FiChevronLeft className="mr-2" />
                    Back to Job
                </button>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Application</h2>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Please fill out the form below to apply for this position.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name *
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address *
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Materials</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Resume (PDF, DOC, DOCX) *
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiFileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="file"
                                                name="resume"
                                                id="resume"
                                                accept=".pdf,.doc,.docx"
                                                className={`block w-full pl-10 border ${errors.resume ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white file:border-0 file:bg-gray-100 dark:file:bg-gray-600 file:text-gray-700 dark:file:text-gray-200 file:py-2 file:px-4 file:rounded-l-md file:mr-4`}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Cover Letter
                                        </label>
                                        <textarea
                                            name="coverLetter"
                                            id="coverLetter"
                                            rows={5}
                                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Tell us why you're a good fit for this position..."
                                            value={formData.coverLetter}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Online Profiles (Optional)</h3>
                                <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            LinkedIn Profile
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLinkedin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                id="linkedin"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="https://linkedin.com/in/your-profile"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            GitHub Profile
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiGithub className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="url"
                                                name="github"
                                                id="github"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="https://github.com/your-username"
                                                value={formData.github}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-6">
                                        <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Portfolio Website
                                        </label>
                                        <input
                                            type="url"
                                            name="portfolio"
                                            id="portfolio"
                                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="https://yourportfolio.com"
                                            value={formData.portfolio}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-md">
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                            </div>
                        )}

                        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : "Submit Application"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}