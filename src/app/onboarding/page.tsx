"use client";

import { useState } from "react";
import Link from "next/link";

const onboardingSteps = [
  { id: "invitation", title: "Accept Invitation", description: "Review and accept your invitation" },
  { id: "account", title: "Create Account", description: "Set up your login credentials" },
  { id: "profile", title: "Complete Profile", description: "Add your company information" },
  { id: "video", title: "Upload Video", description: "Record your introduction video" },
  { id: "verification", title: "Verification", description: "Submit documents for verification" },
];

const invitationDetails = {
  invitedBy: "Sarah Johnson",
  company: "Growth Advisors",
  message: "We're excited to invite TechFlow Systems to join our matching platform. Your innovative approach to fintech solutions would be a great addition to our community.",
  deadline: "2024-05-01",
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [invitationResponse, setInvitationResponse] = useState<"pending" | "accepted" | "declined">("pending");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    website: "",
    description: "",
    videoUrl: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAcceptInvitation = () => {
    setInvitationResponse("accepted");
    handleNext();
  };

  const handleDeclineInvitation = () => {
    setInvitationResponse("declined");
  };

  const handleResetInvitation = () => {
    setInvitationResponse("pending");
  };

  const handleCreateAccount = () => {
    // Validate form
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      alert("Please fill in all fields and ensure passwords match");
      return;
    }
    handleNext();
  };

  const handleCompleteProfile = () => {
    // Validate form
    if (!formData.companyName || !formData.industry || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }
    handleNext();
  };

  const handleFileChange = (file: File | null) => {
    setVideoFile(file);
    setFormData(prev => ({
      ...prev,
      videoUrl: file ? file.name : "",
    }));
  };

  const handleUploadVideo = () => {
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    // Simulate file upload by storing the selected filename.
    setFormData(prev => ({ ...prev, videoUrl: videoFile.name }));
    handleNext();
  };

  const handleSubmitVerification = () => {
    console.log("submit-verification", formData);
    // Redirect to dashboard or success page
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Accept Invitation
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h3 className="font-600 text-[var(--color-ink)]">
                Invitation from {invitationDetails.invitedBy}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {invitationDetails.company}
              </p>
              <div className="mt-4 rounded-lg bg-[var(--color-surface-soft)] p-4">
                <p className="text-[var(--color-body)]">
                  {invitationDetails.message}
                </p>
              </div>
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                Please respond by {invitationDetails.deadline}
              </p>
            </div>

            {invitationResponse === "declined" ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                <p className="font-semibold">Invitation declined.</p>
                <p className="mt-2">
                  If you changed your mind, you can review the invitation again.
                </p>
                <button
                  type="button"
                  onClick={handleResetInvitation}
                  className="mt-4 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  Review Invitation Again
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAcceptInvitation}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  Accept Invitation
                </button>
                <button
                  type="button"
                  onClick={handleDeclineInvitation}
                  className="flex-1 rounded-lg border border-[var(--color-hairline)] py-3 font-500 text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        );

      case 1: // Create Account
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Create a strong password"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <button
              onClick={handleCreateAccount}
              className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
            >
              Create Account
            </button>
          </div>
        );

      case 2: // Complete Profile
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-600 text-[var(--color-ink)]">
                  Industry *
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="">Select your industry</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthtech">Healthtech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-[var(--color-ink)]">
                  Company Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Tell us about your company, what you do, and what you're looking for..."
                />
              </div>
            </div>
            <button
              onClick={handleCompleteProfile}
              className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
            >
              Continue
            </button>
          </div>
        );

      case 3: // Upload Video
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 text-center">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="font-600 text-[var(--color-ink)]">
                Upload Your Introduction Video
              </h3>
              <p className="mt-2 text-[var(--color-body)]">
                Help other members get to know your company better. Keep it under 2 minutes.
              </p>
              <div className="mt-6 space-y-3 text-sm text-[var(--color-muted)]">
                <p>• Introduce your company and what you do</p>
                <p>• Share your goals and what you're looking for</p>
                <p>• Be authentic and engaging</p>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="videoUpload" className="block text-sm font-600 text-[var(--color-ink)]">
                Select a video file
              </label>
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3 focus:border-[var(--color-primary)] focus:outline-none"
              />
              {videoFile && (
                <p className="text-sm text-[var(--color-muted)]">
                  Selected file: <strong>{videoFile.name}</strong>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleUploadVideo}
              className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
            >
              Upload Video
            </button>
          </div>
        );

      case 4: // Verification
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h3 className="font-600 text-[var(--color-ink)]">
                Almost there! Submit for verification
              </h3>
              <p className="mt-2 text-[var(--color-body)]">
                Your profile will be reviewed by our Growth Advisors. Once approved, you'll gain access to the full platform.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-[var(--color-body)]">Account created</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-[var(--color-body)]">Profile completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-[var(--color-body)]">Video uploaded</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-600">⏳</span>
                  <span className="text-sm text-[var(--color-body)]">Verification pending</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmitVerification}
              className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-500 text-white hover:bg-[var(--color-primary-active)]"
            >
              Submit for Verification
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Header */}
      <section className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/"
            className="text-sm font-500 text-[var(--color-primary)] hover:underline"
          >
            ← Back to home
          </Link>
          <h1 className="mt-4 text-3xl font-700 text-[var(--color-ink)]">
            Join the Platform
          </h1>
          <p className="mt-2 text-[var(--color-body)]">
            Complete your onboarding to get started
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] px-[5%] py-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-600 ${
                  index <= currentStep
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-soft)] text-[var(--color-muted)]'
                }`}>
                  {index + 1}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`h-1 w-16 ${
                    index < currentStep ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-hairline)]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="font-600 text-[var(--color-ink)]">
              {onboardingSteps[currentStep].title}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-body)]">
              {onboardingSteps[currentStep].description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[5%] py-12">
        <div className="mx-auto max-w-[640px]">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-6 inline-flex items-center gap-2 text-sm font-600 text-[var(--color-primary)] hover:text-[var(--color-primary-active)]"
            >
              ← Back
            </button>
          )}
          {renderStepContent()}
        </div>
      </div>

    </div>
  );
}
