import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useJobFormStore = create(
    persist(
        (set) => ({
            darkMode: false,
            formData: {
                jobType: "Full-Time",
                jobTitle: "",
                description: "",
                salary: "Under $50K",
                location: "",
                companyName: "",
                companyDescription: "",
                contactEmail: "",
                contactPhone: "",
            },
            submitSuccess: false,
            isSubmitting: false,

            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setFormData: (data) => set({ formData: data }),
            setSubmitSuccess: (value) => set({ submitSuccess: value }),
            setIsSubmitting: (value) => set({ isSubmitting: value }),
            resetForm: () => set({
                formData: {
                    jobType: "Full-Time",
                    jobTitle: "",
                    description: "",
                    salary: "Under $50K",
                    location: "",
                    companyName: "",
                    companyDescription: "",
                    contactEmail: "",
                    contactPhone: "",
                },
                submitSuccess: false,
                isSubmitting: false
            })
        }),
        {
            name: 'job-form-store',
        }
    )
);