"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiMoon,
  FiSun,
  FiSearch,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
  FiChevronDown,
  FiClock
} from "react-icons/fi";
import "./globals.css";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [],
    location: []
  });

  const sampleJobs = [
    {
      _id: "1",
      jobTitle: "Frontend Developer",
      companyName: "TechCorp",
      description: "We are looking for an experienced frontend developer to join our team building modern web applications with React and Next.js.",
      salary: "$80K - $120K",
      location: "San Francisco",
      jobType: "Full-Time",
      isFeatured: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "2",
      jobTitle: "UX Designer",
      companyName: "DesignHub",
      description: "Join our design team to create beautiful and intuitive user experiences for our products. Experience with Figma required.",
      salary: "$70K - $100K",
      location: "Remote",
      jobType: "Full-Time",
      isFeatured: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "3",
      jobTitle: "Backend Engineer",
      companyName: "DataSystems",
      description: "Looking for a backend engineer to develop and maintain our server infrastructure and APIs using Node.js and MongoDB.",
      salary: "$90K - $130K",
      location: "New York",
      jobType: "Full-Time",
      isFeatured: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "4",
      jobTitle: "Marketing Intern",
      companyName: "GrowthMarketing",
      description: "Summer internship opportunity for marketing students to learn digital marketing strategies and campaign management.",
      salary: "$20K - $25K",
      location: "London",
      jobType: "Internship",
      isFeatured: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "5",
      jobTitle: "DevOps Specialist",
      companyName: "CloudSolutions",
      description: "Seeking a DevOps engineer to streamline our deployment processes and cloud infrastructure using AWS and Kubernetes.",
      salary: "$110K - $150K",
      location: "Remote",
      jobType: "Contract",
      isFeatured: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "6",
      jobTitle: "Product Manager",
      companyName: "InnovateTech",
      description: "Lead product development from conception to launch, working with engineering, design, and marketing teams.",
      salary: "$100K - $140K",
      location: "San Francisco",
      jobType: "Full-Time",
      isFeatured: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.jobs?.length > 0 ? data.jobs : sampleJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs(sampleJobs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode || (!('darkMode' in localStorage) && systemPrefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch =
        job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = (
        (selectedFilters.jobType.length === 0 || selectedFilters.jobType.includes(job.jobType)) &&
        (selectedFilters.location.length === 0 || selectedFilters.location.includes(job.location))
      );

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "salary-high-low": {
          const salaryA = parseInt(a.salary?.match(/\d+/)?.[0] || 0);
          const salaryB = parseInt(b.salary?.match(/\d+/)?.[0] || 0);
          return salaryB - salaryA;
        }
        case "salary-low-high": {
          const salaryA = parseInt(a.salary?.match(/\d+/)?.[0] || 0);
          const salaryB = parseInt(b.salary?.match(/\d+/)?.[0] || 0);
          return salaryA - salaryB;
        }
        case "title-asc":
          return (a.jobTitle || "").localeCompare(b.jobTitle || "");
        case "title-desc":
          return (b.jobTitle || "").localeCompare(a.jobTitle || "");
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const getDaysAgo = (date) => {
    if (!date) return "Recently";
    const diffInDays = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    return diffInDays === 0 ? "Today" : `${diffInDays}d ago`;
  };

  const getSalaryRange = (salary) => {
    if (!salary) return "Not specified";
    if (salary === "Negotiable") return salary;
    const range = salary.match(/\$(\d+K).*\$(\d+K)/);
    return range ? `${range[1]} - ${range[2]}` : salary;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <div className="h-12 w-40 relative">
                    <Image
                      src="/Images/logo.webp"
                      alt="Company Logo"
                      width={160}
                      height={40}
                      className="h-12 w-auto object-contain dark:filter-none"
                      priority
                    />
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/company-dashboard">
                <motion.div
                  className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/30 dark:text-blue-400 transition"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Post a Job
                </motion.div>
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Browse through thousands of full-time and part-time jobs near you
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(search)}
              />
              <button
                className="px-6 py-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition flex items-center"
                onClick={() => setSearchQuery(search)}
              >
                <FiSearch className="mr-2" />
                Search
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {["Full-Time", "Part-Time", "Contract", "Internship", "Temporary"].map(type => (
                <button
                  key={type}
                  onClick={() => toggleFilter('jobType', type)}
                  className={`flex items-center px-4 py-2 rounded-full transition ${selectedFilters.jobType.includes(type)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                  <FiBriefcase className="mr-2" />
                  <span>{type}</span>
                </button>
              ))}

              {["Remote", "New York", "San Francisco", "London"].map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleFilter('location', loc)}
                  className={`flex items-center px-4 py-2 rounded-full transition ${selectedFilters.location.includes(loc)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                  <FiMapPin className="mr-2" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-high-low">Salary: High to Low</option>
                  <option value="salary-low-high">Salary: Low to High</option>
                  <option value="title-asc">Title: A-Z</option>
                  <option value="title-desc">Title: Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 ${job.isFeatured ? 'border-blue-500' : 'border-transparent'
                      }`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <FiBriefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.jobTitle}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{job.companyName}</p>
                          </div>
                        </div>
                        {job.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiDollarSign className="mr-1" />
                        <span>{getSalaryRange(job.salary)}</span>
                        <span className="mx-2">•</span>
                        <FiClock className="mr-1" />
                        <span>{getDaysAgo(job.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <FiMapPin className="mr-1" />
                        <span>{job.location}</span>
                      </div>

                      <div className="mt-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.jobType === 'Full-Time' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          job.jobType === 'Part-Time' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                          {job.jobType}
                        </span>
                      </div>

                      <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-6 flex space-x-3">
                        <Link href={`/job/${job._id}`}>
                          <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition">
                            View Details
                          </button>
                        </Link>
                        <Link href={`/job/${job._id}/apply`}>
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                            Apply Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
                    <FiSearch className="w-full h-full" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter to find what you &apos;re looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilters({
                        jobType: [],
                        location: []
                      });
                    }}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Zithara Technologies Pvt Ltd. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}