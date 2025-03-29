"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiDollarSign, FiMapPin, FiMail, FiPhone, FiHome, FiFileText, FiMoon, FiSun } from "react-icons/fi";
import { useJobFormStore } from '../../store/useJobStore';
import { toast } from 'react-hot-toast';
import '../globals.css';

const jobFormSchema = z.object({
    jobType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship", "Temporary"]),
    jobTitle: z.string().min(5, "Job title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    salary: z.enum(["Under $50K", "$50K - $100K", "$100K - $150K", "Above $150K", "Negotiable"]),
    location: z.string().min(3, "Location must be at least 3 characters"),
    companyName: z.string().min(3, "Company name must be at least 3 characters"),
    companyDescription: z.string().optional(),
    contactEmail: z.string().email("Please enter a valid email address"),
    contactPhone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number").optional(),
});

export default function CompanyDashboard() {
    const router = useRouter();
    const {
        darkMode,
        formData,
        isSubmitting,
        toggleDarkMode,
        setFormData,
        setIsSubmitting,
        resetForm
    } = useJobFormStore();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(jobFormSchema),
        defaultValues: formData
    });

    useEffect(() => {
        reset(formData);
    }, [formData, reset]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setFormData(data);

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to post job');
            }

            toast.success('Job posted successfully! It will be visible after approval.');
            resetForm();
            reset();
            router.push('/');

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error.message || 'Failed to post job');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={toggleDarkMode}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Post a New Job Opportunity
                    </h1>
                    <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
                        Attract top talent with a compelling job listing
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <FiBriefcase className="mr-2 text-blue-500 dark:text-blue-400" />
                                        Job Type
                                    </label>
                                    <select
                                        id="jobType"
                                        {...register("jobType")}
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Temporary">Temporary</option>
                                    </select>
                                    {errors.jobType && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobType.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <FiDollarSign className="mr-2 text-blue-500 dark:text-blue-400" />
                                        Salary Range
                                    </label>
                                    <select
                                        id="salary"
                                        {...register("salary")}
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="Under $50K">Under $50K</option>
                                        <option value="$50K - $100K">$50K - $100K</option>
                                        <option value="$100K - $150K">$100K - $150K</option>
                                        <option value="Above $150K">Above $150K</option>
                                        <option value="Negotiable">Negotiable</option>
                                    </select>
                                    {errors.salary && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salary.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    <FiFileText className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    id="jobTitle"
                                    {...register("jobTitle")}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. Senior Frontend Developer"
                                />
                                {errors.jobTitle && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobTitle.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    <FiMapPin className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    {...register("location")}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. New York, NY or Remote"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                    <FiFileText className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Job Description
                                </label>
                                <textarea
                                    id="description"
                                    {...register("description")}
                                    rows={5}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use bullet points for better readability</p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <FiHome className="mr-2 text-blue-500 dark:text-blue-400" />
                                    Company Information
                                </h3>
                            </div>

                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    {...register("companyName")}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Your company name"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    About Your Company
                                </label>
                                <textarea
                                    id="companyDescription"
                                    {...register("companyDescription")}
                                    rows={4}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="What does your company do? Culture, mission, etc."
                                />
                                {errors.companyDescription && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyDescription.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <FiMail className="mr-2 text-blue-500 dark:text-blue-400" />
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        {...register("contactEmail")}
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="applications@yourcompany.com"
                                    />
                                    {errors.contactEmail && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                                        <FiPhone className="mr-2 text-blue-500 dark:text-blue-400" />
                                        Contact Phone (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        id="contactPhone"
                                        {...register("contactPhone")}
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="(123) 456-7890"
                                    />
                                    {errors.contactPhone && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPhone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Posting Job...
                                        </>
                                    ) : (
                                        'Post Job Opportunity'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Your job will be reviewed and typically goes live within 24 hours.</p>
                </div>
            </div>
        </div>
    );
}