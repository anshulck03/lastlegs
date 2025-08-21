"use client";

import { useState } from "react";
import { useLocalForm } from "../../lib/client/useLocalForm";
import type { OnboardingBasics } from "../../types/onboarding";

const initialFormData: OnboardingBasics = {
  firstName: "",
  lastName: "",
  email: "",
  experience: "",
  targetRace: "",
};

export default function OnboardingPage() {
  const [formData, setFormData] = useLocalForm<OnboardingBasics>("onboarding-basics", initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual API call when onboarding API is ready
      console.log("Submitting onboarding data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear localStorage after successful submission
      localStorage.removeItem("onboarding-basics");
      
      // TODO: Redirect to next step or dashboard
    } catch (error) {
      console.error("Onboarding submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof OnboardingBasics, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg-0)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--text-1)] mb-2">
            Welcome to Last Legs
          </h1>
          <p className="text-[color:var(--text-2)]">
            Let's get you started with your AI-powered Ironman training
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[color:var(--text-1)] mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] placeholder-[color:var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[color:var(--text-1)] mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] placeholder-[color:var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[color:var(--text-1)] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] placeholder-[color:var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-[color:var(--text-1)] mb-2">
              Training Experience
            </label>
            <select
              id="experience"
              value={formData.experience}
              onChange={(e) => updateField("experience", e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
              required
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner (New to triathlon)</option>
              <option value="intermediate">Intermediate (Some race experience)</option>
              <option value="advanced">Advanced (Multiple Ironman races)</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetRace" className="block text-sm font-medium text-[color:var(--text-1)] mb-2">
              Target Race
            </label>
            <input
              id="targetRace"
              type="text"
              value={formData.targetRace}
              onChange={(e) => updateField("targetRace", e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] placeholder-[color:var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
              placeholder="e.g., Ironman Lake Placid 2025"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary h-12 text-lg font-medium"
          >
            {isSubmitting ? "Getting Started..." : "Continue"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-[color:var(--text-3)]">
            Your progress is automatically saved as you type
          </p>
        </div>
      </div>
    </div>
  );
}