"use client";

import Link from "next/link";
import { DOCUMENT_TYPES } from "@/types/constants";

const documents = [
  {
    id: "doc-1",
    type: "sec-certificate" as const,
    status: "approved" as const,
    fileName: "TechFlow_Systems_SEC_Certificate.pdf",
    uploadedAt: "2024-04-15",
    reviewedAt: "2024-04-16",
    reviewedBy: "Advisor Sarah",
  },
  {
    id: "doc-2",
    type: "dti-registration" as const,
    status: "approved" as const,
    fileName: "TechFlow_Systems_DTI_Registration.pdf",
    uploadedAt: "2024-04-15",
    reviewedAt: "2024-04-16",
    reviewedBy: "Advisor Sarah",
  },
];

const requiredDocuments = [
  {
    type: "sec-certificate" as const,
    required: true,
    status: "approved" as const,
  },
  {
    type: "dti-registration" as const,
    required: true,
    status: "approved" as const,
  },
];

export default function DocumentsPage() {
  const handleUploadDocument = (documentType: string) => {
    console.log("upload-document", documentType);
  };

  const handleViewDocument = (documentId: string) => {
    console.log("view-document", documentId);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "submitted": "bg-yellow-100 text-yellow-700",
      "under-review": "bg-blue-100 text-blue-700",
      "approved": "bg-green-100 text-green-700",
      "rejected": "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Header */}
      <section className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/dashboard"
            className="text-sm font-500 text-[var(--color-primary)] hover:underline"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-700 text-[var(--color-ink)]">
            Documents
          </h1>
          <p className="mt-2 text-[var(--color-body)]">
            Stage 2 verification requires SEC and DTI documents
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          {/* Stage 2 Requirements */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-600 text-[var(--color-ink)]">
              Stage 2 Requirements
            </h2>
            <div className="space-y-4">
              {requiredDocuments.map((req) => (
                <div
                  key={req.type}
                  className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-600 text-[var(--color-ink)]">
                        {DOCUMENT_TYPES[req.type]}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-body)]">
                        Required for Stage 2 verification
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-600 ${getStatusColor(req.status)}`}>
                      {req.status === 'approved' ? '✓ Approved' : req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Uploaded Documents */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-600 text-[var(--color-ink)]">
              Your documents
            </h2>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-600 text-[var(--color-ink)]">
                        {DOCUMENT_TYPES[doc.type]}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {doc.fileName}
                      </p>
                      <div className="mt-2 flex gap-4 text-xs text-[var(--color-muted)]">
                        <span>📤 Uploaded: {doc.uploadedAt}</span>
                        {doc.reviewedAt && (
                          <span>✅ Reviewed: {doc.reviewedAt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-600 ${getStatusColor(doc.status)}`}>
                        {doc.status === 'approved' ? '✓ Approved' :
                         doc.status === 'under-review' ? '⏳ Under Review' :
                         doc.status === 'submitted' ? '📤 Submitted' : '✗ Rejected'}
                      </span>
                      <button
                        onClick={() => handleViewDocument(doc.id)}
                        className="text-sm font-500 text-[var(--color-primary)] hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upload Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-600 text-[var(--color-ink)]">
              Upload documents
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(DOCUMENT_TYPES).map(([type, label]) => (
                <div
                  key={type}
                  className="rounded-lg border-2 border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-8 text-center"
                >
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="font-600 text-[var(--color-ink)]">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    PDF format, max 10MB
                  </p>
                  <button
                    onClick={() => handleUploadDocument(type)}
                    className="mt-4 rounded-lg bg-[var(--color-primary)] px-6 py-2 font-500 text-white hover:bg-[var(--color-primary-active)]"
                  >
                    Upload
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Info Box */}
          <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6">
            <p className="text-sm font-600 text-[var(--color-muted)] uppercase">
              Document verification process
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-body)]">
              <li>• Documents are reviewed within 24-48 hours by Growth Advisors</li>
              <li>• Once approved, your profile automatically upgrades to Stage 2</li>
              <li>• Stage 2 unlocks full matching visibility and deal flow</li>
              <li>• All documents are stored securely and encrypted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
