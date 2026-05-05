"use client";

import Link from "next/link";
import { AskOfferStatus } from "@/types";

const memberProfile = {
  id: "member-001",
  fullName: "Sarah Chen",
  businessName: "TechFlow Systems",
  sector: "SaaS / Developer Tools",
  role: "Founder & CEO",
  city: "Manila, Philippines",
  shortBio: "Building supply chain optimization software for SMEs across Southeast Asia.",
  introVideoUrl: "https://example.com/video.mp4",
  profileImageUrl: null,
};

const topAsks = [
  {
    id: "ask-1",
    title: "Growth capital",
    description: "₱10-20M Series A for product development and GTM",
    status: "Open" as AskOfferStatus,
  },
  {
    id: "ask-2",
    title: "SEA distribution partner",
    description: "Strategic partner to expand to Vietnam and Thailand",
    status: "In Progress" as AskOfferStatus,
  },
  {
    id: "ask-3",
    title: "Board advisor",
    description: "Governance and operational scaling support",
    status: "Open" as AskOfferStatus,
  },
];

const topOffers = [
  {
    id: "offer-1",
    title: "Product roadmap consultation",
    description: "Guidance on enterprise feature prioritization",
    status: "Available" as AskOfferStatus,
  },
  {
    id: "offer-2",
    title: "Customer introductions",
    description: "Access to 50+ logistics companies in our network",
    status: "Matched" as AskOfferStatus,
  },
  {
    id: "offer-3",
    title: "Engineering team partnership",
    description: "Technical integration support for enterprise clients",
    status: "Available" as AskOfferStatus,
  },
];

export default function ProfilePage() {
  const handleEditProfile = () => {
    console.log("edit-profile");
  };

  const handleAddAsk = () => {
    console.log("add-ask");
  };

  const handleAddOffer = () => {
    console.log("add-offer");
  };

  const handleUpdateAskOffer = (id: string, type: "ask" | "offer") => {
    console.log(`update-${type}`, id);
  };

  const getStatusColor = (status: AskOfferStatus) => {
    const colors: Record<AskOfferStatus, string> = {
      "Open": "bg-blue-100 text-blue-700",
      "In Progress": "bg-yellow-100 text-yellow-700",
      "Resolved": "bg-green-100 text-green-700",
      "Available": "bg-blue-100 text-blue-700",
      "Matched": "bg-green-100 text-green-700",
      "Closed": "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Profile Header */}
      <section className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[var(--color-primary)] text-4xl font-700 text-white">
                  {memberProfile.fullName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-700 text-[var(--color-ink)]">
                    {memberProfile.fullName}
                  </h1>
                  <p className="mt-1 text-lg font-500 text-[var(--color-body)]">
                    {memberProfile.businessName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {memberProfile.role} • {memberProfile.city}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-[var(--color-body)]">
                {memberProfile.shortBio}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEditProfile}
                className="rounded-lg border border-[var(--color-ink)] bg-[var(--color-canvas)] px-6 py-2 font-500 text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
              >
                Edit profile
              </button>
              <Link
                href="/documents"
                className="text-center rounded-lg border border-[var(--color-ink)] bg-[var(--color-canvas)] px-6 py-2 font-500 text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
              >
                Documents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          {/* Intro Video Section */}
          {memberProfile.introVideoUrl && (
            <section className="mb-16">
              <h2 className="mb-6 font-600 text-[var(--color-ink)]">
                1-minute intro video
              </h2>
              <div className="aspect-video rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                <iframe
                  width="100%"
                  height="100%"
                  src={memberProfile.introVideoUrl}
                  title="Intro video"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </section>
          )}

          {/* ASK and OFFER Grid */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* ASKs Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-600 text-[var(--color-ink)]">
                    What you're asking for
                  </h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    Top 3 needs and opportunities
                  </p>
                </div>
                <button
                  onClick={handleAddAsk}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  + Add ASK
                </button>
              </div>
              <div className="space-y-4">
                {topAsks.map((ask) => (
                  <div
                    key={ask.id}
                    className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-600 text-[var(--color-ink)]">
                          {ask.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-body)]">
                          {ask.description}
                        </p>
                      </div>
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-600 ml-4 ${getStatusColor(ask.status)}`}>
                        {ask.status}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleUpdateAskOffer(ask.id, "ask")}
                        className="text-sm font-500 text-[var(--color-primary)] hover:underline"
                      >
                        Edit
                      </button>
                      <button className="text-sm font-500 text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* OFFERs Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-600 text-[var(--color-ink)]">
                    What you're offering
                  </h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    Top 3 capabilities and expertise
                  </p>
                </div>
                <button
                  onClick={handleAddOffer}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  + Add OFFER
                </button>
              </div>
              <div className="space-y-4">
                {topOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-600 text-[var(--color-ink)]">
                          {offer.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-body)]">
                          {offer.description}
                        </p>
                      </div>
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-600 ml-4 ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleUpdateAskOffer(offer.id, "offer")}
                        className="text-sm font-500 text-[var(--color-primary)] hover:underline"
                      >
                        Edit
                      </button>
                      <button className="text-sm font-500 text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
