"use client";

import { useState } from "react";
import { useTheme } from "@/providers";
import { useThemeEditorStore } from "@/stores";
import { Palette, Upload, X } from "lucide-react";

type CompanyBrandingFormProps = {
  initialData?: {
    name: string;
    logo?: string;
    slogan: string;
  };
  onSave?: (data: { name: string; logo?: string; slogan: string }) => void;
};

export function CompanyBrandingForm({
  initialData = {
    name: "",
    logo: undefined,
    slogan: "",
  },
  onSave,
}: CompanyBrandingFormProps) {
  const { tokens } = useTheme();
  const { draft, setDraft, markSaved } = useThemeEditorStore();
  const [formData, setFormData] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData.logo || null
  );
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const displayTokens = { ...tokens, ...draft };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          logo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave?.(formData);
      markSaved();
      // Show success message
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving:", error);
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen transition-all duration-300"
      dir="rtl"
      style={{
        background: displayTokens.background,
        color: displayTokens.foreground,
        fontFamily: displayTokens.fontSans,
      }}
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"
            style={{ color: displayTokens.primary }}
          >
            برندینگ شرکت
          </h1>
          <p
            className="text-lg"
            style={{ color: displayTokens.mutedForeground }}
          >
            نام، لوگو، شعار و تم شرکت خود را سفارشی کنید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            {/* Logo Section */}
            <div
              className="rounded-xl p-8 border transition-all duration-300"
              style={{
                background: displayTokens.secondary,
                borderColor: displayTokens.border,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: displayTokens.foreground }}
              >
                لوگوی شرکت
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Preview */}
                <div className="flex-1">
                  <div
                    className="rounded-lg border-2 border-dashed p-8 min-h-64 flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: displayTokens.border,
                      background: displayTokens.background,
                    }}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center group">
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          className="max-h-56 max-w-56 object-contain rounded-lg"
                        />
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload
                          size={40}
                          className="mx-auto mb-3"
                          style={{ color: displayTokens.mutedForeground }}
                        />
                        <p
                          style={{ color: displayTokens.mutedForeground }}
                          className="text-sm"
                        >
                          لوگو بارگذاری نشده است
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex flex-col justify-center gap-4">
                  <label
                    className="px-6 py-3 rounded-lg font-semibold cursor-pointer text-center transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: displayTokens.primary,
                      color: displayTokens.primaryForeground,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    بارگذاری لوگو
                  </label>
                  {logoPreview && (
                    <button
                      onClick={handleRemoveLogo}
                      className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      style={{
                        background: displayTokens.muted,
                        color: displayTokens.mutedForeground,
                        border: `1px solid ${displayTokens.border}`,
                      }}
                    >
                      حذف لوگو
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Company Info Section */}
            <div
              className="rounded-xl p-8 border transition-all duration-300 space-y-6"
              style={{
                background: displayTokens.secondary,
                borderColor: displayTokens.border,
              }}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: displayTokens.foreground }}
              >
                اطلاعات شرکت
              </h2>

              {/* Company Name */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: displayTokens.foreground }}
                >
                  نام شرکت
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام شرکت خود را وارد کنید"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-base text-right"
                  style={{
                    borderColor: displayTokens.border,
                    backgroundColor: displayTokens.background,
                    color: displayTokens.foreground,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${displayTokens.primary}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Company Slogan */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: displayTokens.foreground }}
                >
                  شعار شرکت
                </label>
                <textarea
                  value={formData.slogan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slogan: e.target.value,
                    }))
                  }
                  placeholder="شعار یا فرمول شرکت خود را وارد کنید"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-base resize-none text-right"
                  rows={4}
                  style={{
                    borderColor: displayTokens.border,
                    backgroundColor: displayTokens.background,
                    color: displayTokens.foreground,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${displayTokens.primary}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: displayTokens.primary,
                  color: displayTokens.primaryForeground,
                }}
              >
                {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>

          {/* Preview & Theme Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            {/* Preview Section */}
            <div
              className="rounded-xl p-8 border sticky top-6 transition-all duration-300"
              style={{
                background: displayTokens.secondary,
                borderColor: displayTokens.border,
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{ color: displayTokens.foreground }}
              >
                پیش‌نمایش
              </h3>

              <div
                className="rounded-lg p-6 space-y-4 text-center"
                style={{
                  background: displayTokens.background,
                  border: `1px solid ${displayTokens.border}`,
                }}
              >
                {/* Logo Preview in Sidebar */}
                {logoPreview && (
                  <div className="mb-4">
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="h-20 mx-auto object-contain"
                    />
                  </div>
                )}

                {/* Name Preview */}
                <h4
                  className="text-2xl font-bold truncate"
                  style={{ color: displayTokens.primary }}
                >
                  {formData.name || "نام شرکت"}
                </h4>

                {/* Slogan Preview */}
                <p
                  className="text-sm line-clamp-3"
                  style={{ color: displayTokens.accent }}
                >
                  {formData.slogan || "شعار شرکت شما"}
                </p>
              </div>

              {/* Theme Editor Toggle */}
              <button
                onClick={() => setShowThemeEditor(!showThemeEditor)}
                className="w-full mt-6 px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: displayTokens.primary,
                  color: displayTokens.primaryForeground,
                }}
              >
                <Palette size={16} />
                {showThemeEditor ? "پنهان کردن تم" : "سفارشی کردن تم"}
              </button>

              {/* Theme Editor */}
              {showThemeEditor && (
                <div className="mt-6 space-y-4 p-4 rounded-lg border" style={{ borderColor: displayTokens.border }}>
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block" style={{ color: displayTokens.mutedForeground }}>
                      رنگ اصلی
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={displayTokens.primary || "#8b5e34"}
                        onChange={(e) => setDraft({ primary: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border"
                        style={{ borderColor: displayTokens.border }}
                      />
                      <input
                        type="text"
                        value={displayTokens.primary || "#8b5e34"}
                        onChange={(e) => setDraft({ primary: e.target.value })}
                        className="flex-1 px-2 py-1 rounded text-xs border"
                        style={{ borderColor: displayTokens.border, backgroundColor: displayTokens.background }}
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block" style={{ color: displayTokens.mutedForeground }}>
                      رنگ لهجه
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={displayTokens.accent || "#e7dccb"}
                        onChange={(e) => setDraft({ accent: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border"
                        style={{ borderColor: displayTokens.border }}
                      />
                      <input
                        type="text"
                        value={displayTokens.accent || "#e7dccb"}
                        onChange={(e) => setDraft({ accent: e.target.value })}
                        className="flex-1 px-2 py-1 rounded text-xs border"
                        style={{ borderColor: displayTokens.border, backgroundColor: displayTokens.background }}
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block" style={{ color: displayTokens.mutedForeground }}>
                      رنگ ثانویه
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={displayTokens.secondary || "#f5f0ea"}
                        onChange={(e) => setDraft({ secondary: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border"
                        style={{ borderColor: displayTokens.border }}
                      />
                      <input
                        type="text"
                        value={displayTokens.secondary || "#f5f0ea"}
                        onChange={(e) => setDraft({ secondary: e.target.value })}
                        className="flex-1 px-2 py-1 rounded text-xs border"
                        style={{ borderColor: displayTokens.border, backgroundColor: displayTokens.background }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
