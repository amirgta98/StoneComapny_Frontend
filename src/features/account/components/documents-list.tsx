"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layouts";
import { toast } from "sonner";
import { mockCustomerDocuments } from "../data/mock-documents";
import type { TechnicalDocument } from "../types/document";
import { DocumentStats } from "./documents/document-stats";
import {
  DocumentFilterBar,
  type DocumentCategoryFilter,
} from "./documents/document-filter-bar";
import { DocumentCard } from "./documents/document-card";
import { DocumentPreviewModal } from "./documents/document-preview-modal";
import { DocumentsEmptyState } from "./documents/documents-empty-state";

/**
 * Customer Documents Feature Component.
 *
 * Displays quality certificates (QC) and technical spec sheets (TDS)
 * exclusively for products purchased by the customer.
 *
 * Designed with stone commerce domain fidelity:
 * - Laboratory physical test metrics (water absorption, compressive strength, abrasion)
 * - ASTM & ISIRI standards compliance
 * - Order & batch verification
 * - PDF download & official preview
 * - Zero multi-tenant leakage
 */
export function DocumentsList() {
  const [documents] = useState<TechnicalDocument[]>(mockCustomerDocuments);
  const [activeCategory, setActiveCategory] =
    useState<DocumentCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  // Modal preview state
  const [previewDoc, setPreviewDoc] = useState<TechnicalDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Unique purchased product options for filter dropdown
  const productOptions = useMemo(() => {
    const map = new Map<string, string>();
    documents.forEach((d) => {
      if (!map.has(d.productId)) {
        map.set(d.productId, d.productName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [documents]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: documents.length,
      quality_certificate: documents.filter(
        (d) => d.type === "quality_certificate"
      ).length,
      spec_sheet: documents.filter((d) => d.type === "spec_sheet").length,
      lab_analysis: documents.filter((d) => d.type === "lab_analysis").length,
    };
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (activeCategory !== "all" && doc.type !== activeCategory) {
        return false;
      }

      // Product filter
      if (selectedProductId !== "all" && doc.productId !== selectedProductId) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          doc.title.toLowerCase().includes(q) ||
          doc.docNumber.toLowerCase().includes(q) ||
          doc.productName.toLowerCase().includes(q) ||
          doc.stoneType.toLowerCase().includes(q) ||
          doc.orderNumber.toLowerCase().includes(q) ||
          doc.batchNumber.toLowerCase().includes(q) ||
          doc.quarryOrigin.toLowerCase().includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [documents, activeCategory, selectedProductId, searchQuery]);

  const isFiltered =
    activeCategory !== "all" ||
    selectedProductId !== "all" ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSelectedProductId("all");
    setSearchQuery("");
  };

  const handleOpenPreview = (doc: TechnicalDocument) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleDownload = (doc: TechnicalDocument) => {
    toast.success(`دانلود فایل ${doc.docNumber} آغاز شد`, {
      description: `${doc.title} (${doc.fileSize})`,
    });

    // Create a mock client download trigger
    const element = document.createElement("a");
    const file = new Blob([`Official Stone Certificate: ${doc.docNumber} - ${doc.title}`], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.docNumber}-${doc.productId}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="اسناد فنی و گواهینامه‌ها"
        description="گواهی کیفیت، آنالیز آزمایشگاهی و برگه مشخصات فنی (TDS) سنگ‌های خریداری‌شده"
      />

      {/* KPI Stats Overview */}
      <DocumentStats documents={documents} />

      {/* Filter and Search Bar */}
      <DocumentFilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProductId={selectedProductId}
        onProductChange={setSelectedProductId}
        productOptions={productOptions}
        counts={counts}
      />

      {/* Documents Grid / List */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-3.5">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPreview={handleOpenPreview}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <DocumentsEmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Official Certificate Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onDownload={handleDownload}
      />
    </div>
  );
}
