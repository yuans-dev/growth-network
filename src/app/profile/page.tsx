"use client";

import { useState } from "react";
import Link from "next/link";
import { AskOfferStatus } from "@/types";

const memberProfile = {
  id: "member-001",
  fullName: "Sarah Chen",
  businessName: "TechFlow Systems",
  entityType: "Corporation",
  registrationNumber: "SEC CS201912345",
  tin: "009-123-456-000",
  sector: "SaaS / Developer Tools",
  employeeBand: "51-200",
  estimatedAnnualRevenue: "PHP 120M",
  role: "Founder & CEO",
  city: "Manila, Philippines",
  shortBio: "Building supply chain optimization software for SMEs across Southeast Asia.",
  introVideoUrl: "https://example.com/video.mp4",
  profileImageUrl: null,
};

const principalContacts = {
  authorizedSignatory: "Sarah Chen",
  authorizedSignatoryEmail: "sarah@techflow.ph",
  uboAbove25: [
    { name: "Sarah Chen", ownership: "52%" },
    { name: "Marco Dela Cruz", ownership: "28%" },
  ],
};

const complianceConsents = {
  pdpaPh: true,
  ndaLight: true,
  nonCircumvention: true,
};

type AskOfferItem = {
  id: string;
  title: string;
  description: string;
  status: AskOfferStatus;
};

const initialAsks: AskOfferItem[] = [
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

const initialOffers: AskOfferItem[] = [
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
  const [asks, setAsks] = useState<AskOfferItem[]>(initialAsks);
  const [offers, setOffers] = useState<AskOfferItem[]>(initialOffers);
  const [showAskForm, setShowAskForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [askForm, setAskForm] = useState({
    title: "",
    description: "",
    status: "Open" as AskOfferStatus,
  });
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    status: "Available" as AskOfferStatus,
  });

  const handleEditProfile = () => {
    console.log("edit-profile");
  };

  const handleAddAsk = () => {
    if (!askForm.title.trim() || !askForm.description.trim()) {
      return;
    }
    const newAsk: AskOfferItem = {
      id: `ask-${Date.now()}`,
      title: askForm.title.trim(),
      description: askForm.description.trim(),
      status: askForm.status,
    };
    setAsks((prev) => [newAsk, ...prev].slice(0, 3));
    setAskForm({ title: "", description: "", status: "Open" });
    setShowAskForm(false);
  };

  const handleAddOffer = () => {
    if (!offerForm.title.trim() || !offerForm.description.trim()) {
      return;
    }
    const newOffer: AskOfferItem = {
      id: `offer-${Date.now()}`,
      title: offerForm.title.trim(),
      description: offerForm.description.trim(),
      status: offerForm.status,
    };
    setOffers((prev) => [newOffer, ...prev].slice(0, 3));
    setOfferForm({ title: "", description: "", status: "Available" });
    setShowOfferForm(false);
  };

  const handleUpdateAskOffer = (id: string, type: "ask" | "offer") => {
    console.log(`update-${type}`, id);
  };

  const handleDeleteAskOffer = (id: string, type: "ask" | "offer") => {
    if (type === "ask") {
      setAsks((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setOffers((prev) => prev.filter((item) => item.id !== id));
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
          <section className="mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h2 className="font-600 text-[var(--color-ink)]">Business identity</h2>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                <p><span className="font-600 text-[var(--color-ink)]">Entity:</span> {memberProfile.entityType}</p>
                <p><span className="font-600 text-[var(--color-ink)]">Registration:</span> {memberProfile.registrationNumber}</p>
                <p><span className="font-600 text-[var(--color-ink)]">TIN:</span> {memberProfile.tin}</p>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h2 className="font-600 text-[var(--color-ink)]">Strategic positioning</h2>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                <p><span className="font-600 text-[var(--color-ink)]">Industry:</span> {memberProfile.sector}</p>
                <p><span className="font-600 text-[var(--color-ink)]">Employee band:</span> {memberProfile.employeeBand}</p>
                <p><span className="font-600 text-[var(--color-ink)]">Estimated annual revenue:</span> {memberProfile.estimatedAnnualRevenue}</p>
              </div>
            </div>
          </section>

          <section className="mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h2 className="font-600 text-[var(--color-ink)]">Principal contacts</h2>
              <p className="mt-4 text-sm text-[var(--color-body)]">
                <span className="font-600 text-[var(--color-ink)]">Authorized signatory:</span>{" "}
                {principalContacts.authorizedSignatory} ({principalContacts.authorizedSignatoryEmail})
              </p>
              <p className="mt-3 text-xs font-600 uppercase text-[var(--color-muted)]">UBOs above 25%</p>
              <ul className="mt-2 space-y-2 text-sm text-[var(--color-body)]">
                {principalContacts.uboAbove25.map((ubo) => (
                  <li key={ubo.name}>- {ubo.name} ({ubo.ownership})</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
              <h2 className="font-600 text-[var(--color-ink)]">Compliance consents</h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                <li>{complianceConsents.pdpaPh ? "✓" : "✗"} PDPA-PH consent</li>
                <li>{complianceConsents.ndaLight ? "✓" : "✗"} NDA-light acceptance</li>
                <li>{complianceConsents.nonCircumvention ? "✓" : "✗"} Non-circumvention agreement</li>
              </ul>
            </div>
          </section>

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
                  onClick={() => setShowAskForm((prev) => !prev)}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  + Add ASK
                </button>
              </div>
              {showAskForm && (
                <div className="mb-6 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
                  <div className="space-y-3">
                    <input
                      value={askForm.title}
                      onChange={(event) => setAskForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="ASK title"
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    />
                    <textarea
                      value={askForm.description}
                      onChange={(event) => setAskForm((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Describe your ASK"
                      rows={3}
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    />
                    <select
                      value={askForm.status}
                      onChange={(event) => setAskForm((prev) => ({ ...prev, status: event.target.value as AskOfferStatus }))}
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button
                      onClick={handleAddAsk}
                      className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                    >
                      Save ASK
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {asks.map((ask) => (
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
                      <button
                        onClick={() => handleDeleteAskOffer(ask.id, "ask")}
                        className="text-sm font-500 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      >
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
                  onClick={() => setShowOfferForm((prev) => !prev)}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                >
                  + Add OFFER
                </button>
              </div>
              {showOfferForm && (
                <div className="mb-6 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
                  <div className="space-y-3">
                    <input
                      value={offerForm.title}
                      onChange={(event) => setOfferForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="OFFER title"
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    />
                    <textarea
                      value={offerForm.description}
                      onChange={(event) => setOfferForm((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Describe your OFFER"
                      rows={3}
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    />
                    <select
                      value={offerForm.status}
                      onChange={(event) => setOfferForm((prev) => ({ ...prev, status: event.target.value as AskOfferStatus }))}
                      className="w-full rounded-lg border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm"
                    >
                      <option value="Available">Available</option>
                      <option value="Matched">Matched</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button
                      onClick={handleAddOffer}
                      className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-500 text-white hover:bg-[var(--color-primary-active)]"
                    >
                      Save OFFER
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {offers.map((offer) => (
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
                      <button
                        onClick={() => handleDeleteAskOffer(offer.id, "offer")}
                        className="text-sm font-500 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      >
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
