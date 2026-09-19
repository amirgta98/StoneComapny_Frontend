"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Package,
  Upload,
  Crop,
  Pencil,
  Star,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { useAdminProductsStore } from "../../stores/admin-products-store";
import { useCategoriesStore, CategoryAutocomplete } from "@/features/categories";
import { ImageEditorDialog } from "./image-editor-dialog";
import { StoneFinishPicker } from "./stone-finish-picker";
import { StoneAttributesBuilder, type LabCertificate } from "./stone-attributes-builder";
import type { Product, ProductImage, ProductAttribute } from "@/types";
import {
  STONE_TYPES,
  STONE_FINISHES,
  STONE_FORMS,
  STONE_APPLICATIONS,
  STONE_COLORS,
  PRICING_UNITS,
  INVENTORY_UNITS,
  type StoneType,
  type StoneFinish,
  type StoneForm,
  type StoneApplication,
  type StoneColor,
  type PricingUnit,
  type InventoryUnit,
} from "@/constants";
import {
  STONE_TYPE_LABELS,
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_APPLICATION_LABELS,
  PRICING_UNIT_LABELS,
} from "../../constants";

interface ProductFormProps {
  productId?: string; // If editing existing
}

const SAMPLE_GALLERY_PRESETS = [
  "/test_images/stones/test_1.jpg",
  "/test_images/stones/test_2.jpg",
  "/test_images/stones/test_3.jpg",
  "/test_images/stones/test_4.jpg",
  "/test_images/stones/test_5.jpg",
  "/test_images/stones/test_6.jpg",
  "/test_images/stones/test_7.jpg",
  "/test_images/stones/test_8.jpg",
];

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const { getProductById, addProduct, updateProduct } = useAdminProductsStore();
  const { categories } = useCategoriesStore();

  const isEditing = Boolean(productId);
  const existingProduct = productId ? getProductById(productId) : undefined;

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");

  // Geology & Classification
  const [stoneType, setStoneType] = useState<StoneType>("marble");
  const [color, setColor] = useState<StoneColor>("white");
  const [origin, setOrigin] = useState("");
  const [quarry, setQuarry] = useState("");
  const [grade, setGrade] = useState("سوپر صادراتی");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Dimensions & Processing
  const [form, setForm] = useState<StoneForm>("slab");
  const [dimensions, setDimensions] = useState("۲۸۰ × ۱۶۰ سانتی‌متر");
  const [thickness, setThickness] = useState<number>(2);
  const [finish, setFinish] = useState<StoneFinish>("polished");
  const [selectedApplications, setSelectedApplications] = useState<StoneApplication[]>(["facade", "flooring"]);

  // Pricing & Stock
  const [pricingUnit, setPricingUnit] = useState<PricingUnit>("per-sqm");
  const [inventoryUnit, setInventoryUnit] = useState<InventoryUnit>("sqm");
  const [price, setPrice] = useState<number>(2_500_000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [inventory, setInventory] = useState<number>(500);
  const [sku, setSku] = useState("");

  // Images
  const [primaryImageUrl, setPrimaryImageUrl] = useState("/test_images/stones/test_1.jpg");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // Tab & Wizard State
  const [activeTab, setActiveTab] = useState<string>("general");

  // Local File Uploads & Image Editing State
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [isPrimaryDragging, setIsPrimaryDragging] = useState(false);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);

  const [editingImage, setEditingImage] = useState<{
    target: "primary" | { type: "gallery"; index: number };
    url: string;
    title: string;
  } | null>(null);

  // Technical Specs & Dynamic Attributes
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    { id: "att-1", name: "درصد جذب آب", value: "۰.۱۵", unit: "درصد" },
    { id: "att-2", name: "مقاومت فشاری", value: "۱۲۵۰", unit: "kg/cm²" },
    { id: "att-3", name: "وزن مخصوص", value: "۲.۶۸", unit: "gr/cm³" },
  ]);
  const [availableFinishes, setAvailableFinishes] = useState<StoneFinish[]>(["honed", "leathered"]);
  const [labCertificate, setLabCertificate] = useState<LabCertificate | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSlug(existingProduct.slug);
      setDescription(existingProduct.description || "");
      setStatus(existingProduct.status);
      if (existingProduct.stoneType) setStoneType(existingProduct.stoneType);
      if (existingProduct.color) setColor(existingProduct.color);
      setOrigin(existingProduct.origin || "");
      setQuarry(existingProduct.quarry || "");
      setGrade(existingProduct.grade || "سوپر صادراتی");
      setSelectedCategories(existingProduct.categories || []);

      if (existingProduct.form) setForm(existingProduct.form);
      setDimensions(existingProduct.dimensions || "");
      if (existingProduct.thickness) setThickness(existingProduct.thickness);
      if (existingProduct.finish) setFinish(existingProduct.finish);

      if (existingProduct.pricingUnit) setPricingUnit(existingProduct.pricingUnit);
      if (existingProduct.inventoryUnit) setInventoryUnit(existingProduct.inventoryUnit);
      setPrice(existingProduct.price || 0);
      setCompareAtPrice(existingProduct.compareAtPrice);

      const mainVariant = existingProduct.variants[0];
      if (mainVariant) {
        setInventory(mainVariant.inventory || 0);
        setSku(mainVariant.sku || "");
      }

      const primary = existingProduct.images.find((img) => img.isPrimary);
      if (primary) setPrimaryImageUrl(primary.url);
      const others = existingProduct.images.filter((img) => !img.isPrimary).map((img) => img.url);
      setGalleryImages(others);

      if (existingProduct.attributes && existingProduct.attributes.length > 0) {
        setAttributes(existingProduct.attributes);
      }
    } else {
      setSku(`ST-${Date.now().toString().slice(-5)}`);
    }
  }, [existingProduct]);

  // Handle auto-generating slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\u0600-\u06FF\w-]/g, "");
      setSlug(generated);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    if (!galleryImages.includes(url.trim())) {
      setGalleryImages([...galleryImages, url.trim()]);
    }
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Handle local image upload for Primary Image
  const handlePrimaryFileSelect = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("فایل انتخابی باید از نوع تصویر (JPG, PNG, WebP) باشد.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPrimaryImageUrl(result);
      toast.success("تصویر شاخص بارگذاری شد. جهت تنظیم کادر یا نور می‌توانید ویرایش کنید.");
      setEditingImage({
        target: "primary",
        url: result,
        title: "ویرایش و تنظیم تصویر شاخص سنگ",
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle local files upload for Gallery
  const handleGalleryFilesSelect = (files?: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const validFiles = fileList.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`فایل «${file.name}» فرمت تصویری مجاز ندارد.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`حجم فایل «${file.name}» بیشتر از ۱۰ مگابایت است.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${validFiles.length} تصویر به گالری سنگ افزوده شد.`);
  };

  // Save edited image from ImageEditorDialog
  const handleSaveEditedImage = (editedUrl: string) => {
    if (!editingImage) return;
    if (editingImage.target === "primary") {
      setPrimaryImageUrl(editedUrl);
    } else if (editingImage.target.type === "gallery") {
      const idx = editingImage.target.index;
      setGalleryImages((prev) => {
        const updated = [...prev];
        updated[idx] = editedUrl;
        return updated;
      });
    }
    setEditingImage(null);
  };

  // Navigation handlers between tabs
  const handleNextTab = (nextTabId: string) => {
    if (activeTab === "general" && !name.trim()) {
      setErrorMessage("لطفاً ابتدا عنوان و نام سنگ را در مشخصات عمومی وارد فرمایید.");
      toast.error("لطفاً نام سنگ را وارد نمایید.");
      return;
    }
    setErrorMessage(null);
    setActiveTab(nextTabId);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handlePrevTab = (prevTabId: string) => {
    setErrorMessage(null);
    setActiveTab(prevTabId);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const renderTabFooter = (
    prevTabId: string | null,
    nextTabId: string | null,
    nextLabel: string,
    stepNumber: number
  ) => (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-4 border-t border-border/70">
      <div>
        {prevTabId ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePrevTab(prevTabId)}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground w-full sm:w-auto"
          >
            <ChevronRight className="h-4 w-4" />
            <span>مرحله قبل</span>
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-[11px] text-muted-foreground font-medium">
          گام {stepNumber} از ۵
        </span>

        {nextTabId ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => handleNextTab(nextTabId)}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <span>{nextLabel}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="h-4 w-4" />
            <span>{isEditing ? "ذخیره نهایی تغییرات" : "ثبت و انتشار نهایی سنگ"}</span>
          </Button>
        )}
      </div>
    </div>
  );

  const toggleApplication = (app: StoneApplication) => {
    if (selectedApplications.includes(app)) {
      setSelectedApplications(selectedApplications.filter((a) => a !== app));
    } else {
      setSelectedApplications([...selectedApplications, app]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("لطفاً عنوان و نام سنگ را وارد نمایید.");
      return;
    }

    setIsSubmitting(true);

    const images: ProductImage[] = [
      {
        id: `img-prim-${Date.now()}`,
        url: primaryImageUrl || "/test_images/stones/test_1.jpg",
        alt: name,
        sortOrder: 0,
        isPrimary: true,
      },
      ...galleryImages.map((url, i) => ({
        id: `img-gal-${i}-${Date.now()}`,
        url,
        alt: `${name} تصویر ${i + 1}`,
        sortOrder: i + 1,
      })),
    ];

    const finalAttributes = attributes.filter((a) => a.name.trim() !== "");

    const productPayload: Partial<Product> = {
      name: name.trim(),
      slug: slug.trim() || `stone-${Date.now()}`,
      description: description.trim(),
      status,
      stoneType,
      color,
      finish,
      form,
      origin: origin.trim(),
      quarry: quarry.trim(),
      grade,
      thickness,
      dimensions: dimensions.trim(),
      pricingUnit,
      inventoryUnit,
      price,
      compareAtPrice,
      images,
      attributes,
      variants: [
        {
          id: existingProduct?.variants[0]?.id || `var-${Date.now()}`,
          sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
          inventory,
          price,
          compareAtPrice,
          attributes: [],
        },
      ],
      categories: selectedCategories,
    };

    if (isEditing && productId) {
      const res = updateProduct(productId, productPayload);
      if (!res.success) {
        setErrorMessage(res.error || "خطا در ویرایش محصول.");
        setIsSubmitting(false);
        return;
      }
    } else {
      const res = addProduct(productPayload, activeTenantId);
      if (!res.success) {
        setErrorMessage(res.error || "خطا در ایجاد محصول.");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-950/10 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isEditing ? `ویرایش سنگ «${name || existingProduct?.name}»` : "ثبت محصول و اسلب جدید"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              مشخصات زمین‌شناسی، هندسی، انبارداری و گالری اسلب را با دقت ثبت فرمایید.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Link href="/dashboard/products">انصراف</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>{isEditing ? "ذخیره تغییرات" : "ثبت و انتشار سنگ"}</span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-secondary/60 rounded-xl">
          <TabsTrigger value="general" className="text-xs py-2 rounded-lg font-medium">
            ۱. مشخصات عمومی و معدن
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="text-xs py-2 rounded-lg font-medium">
            ۲. ابعاد و فرآوری
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs py-2 rounded-lg font-medium">
            ۳. قیمت و انبارداری
          </TabsTrigger>
          <TabsTrigger value="gallery" className="text-xs py-2 rounded-lg font-medium">
            ۴. گالری و تصاویر
          </TabsTrigger>
          <TabsTrigger value="specs" className="text-xs py-2 rounded-lg font-medium">
            ۵. آنالیز فنی و انتشار
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: اطلاعات عمومی و معدن ================= */}
        <TabsContent value="general" className="mt-4">
          <Card className="border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-name" className="text-xs font-semibold">
                  عنوان و نام تجاری سنگ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prod-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="مثال: سنگ مرمریت کالاتا گلد، تراورتن آتشکوه..."
                  className="text-xs h-9"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-slug" className="text-xs font-semibold">
                  نامک لاتین در آدرس وب (Slug)
                </Label>
                <Input
                  id="prod-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="calacatta-gold-marble"
                  className="text-xs h-9 font-mono text-start"
                  dir="ltr"
                />
              </div>

              {/* Stone Type */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-stone-type" className="text-xs font-semibold">
                  جنس و دسته‌بندی سنگ
                </Label>
                <select
                  id="prod-stone-type"
                  value={stoneType}
                  onChange={(e) => setStoneType(e.target.value as StoneType)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {STONE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {STONE_TYPE_LABELS[type]} ({type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-color" className="text-xs font-semibold">
                  رنگ و زمینه اصلی
                </Label>
                <select
                  id="prod-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value as StoneColor)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {STONE_COLORS.map((c) => (
                    <option key={c} value={c}>
                      {STONE_COLOR_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin City / Province */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-origin" className="text-xs font-semibold">
                  خاستگاه و منطقه جغرافیایی
                </Label>
                <Input
                  id="prod-origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="مثال: معادن صفاشهر، شیراز یا محلات"
                  className="text-xs h-9"
                />
              </div>

              {/* Quarry */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-quarry" className="text-xs font-semibold">
                  نام سینه کار یا معدن
                </Label>
                <Input
                  id="prod-quarry"
                  value={quarry}
                  onChange={(e) => setQuarry(e.target.value)}
                  placeholder="مثال: معدن دره بخاری سوپر، چاه مرغی"
                  className="text-xs h-9"
                />
              </div>

              {/* Grade / Sort */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-grade" className="text-xs font-semibold">
                  سورت و درجه کیفی سنگ
                </Label>
                <select
                  id="prod-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="سوپر صادراتی">سوپر صادراتی (Super Export)</option>
                  <option value="سوپر ممتاز">سوپر ممتاز (Premium)</option>
                  <option value="ممتاز درجه ۱">ممتاز درجه ۱</option>
                  <option value="درجه ۲ تجاری">درجه ۲ تجاری</option>
                </select>
              </div>

              {/* Category Assignment with Autocomplete */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <Label className="text-xs font-semibold block">
                  اتصال به دسته‌بندی درختی سنگ
                </Label>
                <CategoryAutocomplete
                  value={selectedCategories[0] || ""}
                  onChange={(slug) => setSelectedCategories(slug ? [slug] : [])}
                  placeholder="جستجو و انتخاب دسته‌بندی درختی سنگ (مرمریت، تراورتن، اسلب...)"
                />
              </div>
            </div>

            {renderTabFooter(null, "dimensions", "مرحله بعد: ابعاد و فرآوری", 1)}
          </Card>
        </TabsContent>

        {/* ================= TAB 2: ابعاد و فرآوری ================= */}
        <TabsContent value="dimensions" className="mt-4">
          <Card className="border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Form / Stone Shape */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-form" className="text-xs font-semibold">
                  فرم و قواره سنگ
                </Label>
                <select
                  id="prod-form"
                  value={form}
                  onChange={(e) => setForm(e.target.value as StoneForm)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {STONE_FORMS.map((f) => (
                    <option key={f} value={f}>
                      {STONE_FORM_LABELS[f]} ({f})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-dimensions" className="text-xs font-semibold">
                  ابعاد و سایز قواره
                </Label>
                <Input
                  id="prod-dimensions"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="مثال: ۲۸۰ × ۱۶۰ سانتی‌متر یا ۴۰ طولی"
                  className="text-xs h-9"
                />
              </div>

              {/* Thickness */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-thickness" className="text-xs font-semibold">
                  ضخامت سنگ (سانتی‌متر)
                </Label>
                <Input
                  id="prod-thickness"
                  type="number"
                  step="0.1"
                  min="1"
                  max="15"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value) || 2)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Visual Finishing Studio */}
            <div className="pt-4 border-t border-border/60">
              <StoneFinishPicker
                value={finish}
                onChange={setFinish}
                availableFinishes={availableFinishes}
                onAvailableFinishesChange={setAvailableFinishes}
                selectedApplications={selectedApplications}
              />
            </div>

            {/* Applications checkboxes */}
            <div className="pt-3 border-t border-border/60">
              <Label className="text-xs font-semibold block mb-2">
                کاربردهای مناسب این سنگ
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {STONE_APPLICATIONS.map((app) => {
                  const isChecked = selectedApplications.includes(app);
                  return (
                    <button
                      type="button"
                      key={app}
                      onClick={() => toggleApplication(app)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-xs text-start transition-colors ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "bg-card border-border/70 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isChecked ? "bg-primary" : "bg-border"}`} />
                      <span>{STONE_APPLICATION_LABELS[app]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {renderTabFooter("general", "pricing", "مرحله بعد: قیمت و انبارداری", 2)}
          </Card>
        </TabsContent>

        {/* ================= TAB 3: قیمت و انبارداری ================= */}
        <TabsContent value="pricing" className="mt-4">
          <Card className="border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pricing Unit */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-pricing-unit" className="text-xs font-semibold">
                  واحد قیمت‌گذاری و فروش
                </Label>
                <select
                  id="prod-pricing-unit"
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value as PricingUnit)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {PRICING_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      به ازای هر {PRICING_UNIT_LABELS[unit]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-price" className="text-xs font-semibold">
                  قیمت فروش پایه (تومان) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  step="1000"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                  className="text-xs h-9 font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  معادل: {(price || 0).toLocaleString("fa-IR")} تومان
                </p>
              </div>

              {/* Compare at Price */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-compare-price" className="text-xs font-semibold">
                  قیمت قبل از تخفیف (تومان - اختیاری)
                </Label>
                <Input
                  id="prod-compare-price"
                  type="number"
                  step="1000"
                  min="0"
                  value={compareAtPrice ?? ""}
                  onChange={(e) => setCompareAtPrice(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  placeholder="در صورت وجود تخفیف پر شود"
                  className="text-xs h-9 font-mono"
                />
              </div>

              {/* Inventory Unit */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-inv-unit" className="text-xs font-semibold">
                  واحد شمارش موجودی انبار
                </Label>
                <select
                  id="prod-inv-unit"
                  value={inventoryUnit}
                  onChange={(e) => setInventoryUnit(e.target.value as InventoryUnit)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="sqm">متر مربع (sqm)</option>
                  <option value="slab">عدد اسلب (slab)</option>
                  <option value="ton">تن (ton)</option>
                  <option value="piece">عدد / تایل (piece)</option>
                </select>
              </div>

              {/* Inventory Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-inventory" className="text-xs font-semibold">
                  موجودی آماده بارگیری در انبار دپو
                </Label>
                <Input
                  id="prod-inventory"
                  type="number"
                  min="0"
                  value={inventory}
                  onChange={(e) => setInventory(parseInt(e.target.value, 10) || 0)}
                  className="text-xs h-9 font-mono"
                />
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  ارزش ریالی دپو: {((inventory || 0) * (price || 0)).toLocaleString("fa-IR")} تومان
                </p>
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-sku" className="text-xs font-semibold">
                  شناسه انبارداری کالا (SKU)
                </Label>
                <Input
                  id="prod-sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="CAL-SL-280"
                  className="text-xs h-9 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {renderTabFooter("dimensions", "gallery", "مرحله بعد: گالری و تصاویر", 3)}
          </Card>
        </TabsContent>

        {/* ================= TAB 4: تصاویر و گالری ================= */}
        <TabsContent value="gallery" className="mt-4">
          <Card className="border border-border/80 bg-card p-5 shadow-2xs space-y-5">
            {/* Hidden File Inputs */}
            <input
              ref={primaryFileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handlePrimaryFileSelect(e.target.files?.[0])}
              className="hidden"
            />
            <input
              ref={galleryFileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleGalleryFilesSelect(e.target.files)}
              className="hidden"
            />

            {/* Primary Image Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold block">
                    تصویر شاخص اسلب / سنگ <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    این تصویر به عنوان نمای اصلی محصول در کاتالوگ، جستجو و پیش‌نمایش کارت‌ها نمایش داده می‌شود.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {primaryImageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingImage({
                          target: "primary",
                          url: primaryImageUrl,
                          title: "ویرایش و تنظیم تصویر شاخص سنگ",
                        })
                      }
                      className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                    >
                      <Crop className="h-3.5 w-3.5" />
                      <span>ویرایش تصویر</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => primaryFileInputRef.current?.click()}
                    className="text-xs h-8 gap-1.5 font-semibold"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>آپلود از سیستم</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Image Dropzone Preview */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsPrimaryDragging(true);
                  }}
                  onDragLeave={() => setIsPrimaryDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsPrimaryDragging(false);
                    handlePrimaryFileSelect(e.dataTransfer.files?.[0]);
                  }}
                  className={`group relative h-36 w-full sm:w-56 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    isPrimaryDragging
                      ? "border-primary bg-primary/10"
                      : "border-border/90 bg-secondary/30"
                  }`}
                >
                  {primaryImageUrl ? (
                    <>
                      <img
                        src={primaryImageUrl}
                        alt="تصویر اصلی"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingImage({
                              target: "primary",
                              url: primaryImageUrl,
                              title: "ویرایش و تنظیم تصویر شاخص سنگ",
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                          title="ویرایش، برش و نور سنگ"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => primaryFileInputRef.current?.click()}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                          title="تغییر عکس از سیستم"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrimaryImageUrl("")}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                          title="حذف تصویر"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="flex flex-col h-full items-center justify-center p-3 text-center cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <Upload className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-xs font-semibold">کلیک یا رهاسازی عکس</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        فرمت‌های JPG، PNG، WebP تا ۱۰ مگابایت
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5 w-full">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">نشانی مستقیم اینترنتی تصویر:</span>
                    <Input
                      value={primaryImageUrl}
                      onChange={(e) => setPrimaryImageUrl(e.target.value)}
                      placeholder="https://example.com/stone-slab.jpg"
                      className="text-xs h-8 font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1">
                      یا انتخاب سریع از اسلب‌های نمونه:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {SAMPLE_GALLERY_PRESETS.slice(0, 6).map((presetUrl, idx) => (
                        <button
                          type="button"
                          key={presetUrl}
                          onClick={() => setPrimaryImageUrl(presetUrl)}
                          className={`h-8 w-8 rounded-lg border overflow-hidden transition-all hover:scale-110 ${
                            primaryImageUrl === presetUrl
                              ? "border-primary ring-2 ring-primary/30 scale-105"
                              : "border-border/80"
                          }`}
                        >
                          <img
                            src={presetUrl}
                            alt={`نمونه ${idx}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Gallery Section */}
            <div className="pt-5 border-t border-border/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold block">
                    گالری تصاویر تکمیلی (اسلب‌های بوک‌مچ، زوایای نورگذر یا اجرا شده در پروژه)
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    تعداد تصاویر افزوده شده: {galleryImages.length} تصویر
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/10 self-start sm:self-auto"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>آپلود عکس‌های گالری از سیستم</span>
                </Button>
              </div>

              {/* Drag & drop dropzone banner */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsGalleryDragging(true);
                }}
                onDragLeave={() => setIsGalleryDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsGalleryDragging(false);
                  handleGalleryFilesSelect(e.dataTransfer.files);
                }}
                onClick={() => galleryFileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                  isGalleryDragging
                    ? "border-primary bg-primary/10"
                    : "border-border/80 hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    عکس‌های تکمیلی سنگ را اینجا بکشید یا برای انتخاب کلیک نمایید
                  </span>
                  <span className="text-[10px]">
                    می‌توانید چندین تصویر را به طور همزمان انتخاب فرمایید.
                  </span>
                </div>
              </div>

              {/* URL Input Fallback */}
              <div className="flex items-center gap-2">
                <Input
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="یا درج لینک تصویر اینترنتی جهت افزودن به گالری..."
                  className="text-xs h-8.5 font-mono"
                  dir="ltr"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddGalleryImage(newGalleryUrl)}
                  className="text-xs shrink-0 h-8.5"
                >
                  <Plus className="h-3.5 w-3.5 me-1" />
                  افزودن لینک
                </Button>
              </div>

              {/* Gallery Grid */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                  {galleryImages.map((url, i) => (
                    <div
                      key={i}
                      className="group relative aspect-[4/3] rounded-xl border border-border/80 overflow-hidden bg-secondary/30 shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`گالری ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Pill Badge */}
                      <span className="absolute top-1.5 start-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs">
                        {i + 1}
                      </span>

                      {/* Hover Overlay with Edit, Star, Delete */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingImage({
                              target: { type: "gallery", index: i },
                              url,
                              title: `ویرایش تصویر گالری شماره ${i + 1}`,
                            })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                          title="ویرایش، برش و نور تصویر"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPrimaryImageUrl(url);
                            toast.success("این تصویر به عنوان تصویر شاخص سنگ برگزیده شد.");
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/80 hover:bg-amber-500 text-white transition-colors"
                          title="تنظیم به عنوان تصویر شاخص"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                          title="حذف از گالری"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {renderTabFooter("pricing", "specs", "مرحله بعد: آنالیز فنی و انتشار", 4)}
          </Card>
        </TabsContent>

        {/* ================= TAB 5: آنالیز فنی و انتشار ================= */}
        <TabsContent value="specs" className="mt-4">
          <Card className="border border-border/80 bg-card p-5 shadow-2xs space-y-4">
            {/* Laboratory Technical Analysis & Dynamic Attributes Builder */}
            <StoneAttributesBuilder
              attributes={attributes}
              onChange={setAttributes}
              stoneType={stoneType}
              labCertificate={labCertificate}
              onLabCertificateChange={setLabCertificate}
            />

            {/* Description */}
            <div className="space-y-1.5 pt-3 border-t border-border/60">
              <Label htmlFor="prod-desc" className="text-xs font-semibold">
                توضیحات تشریحی، کاربرد معماری و شرایط فرآوری
              </Label>
              <Textarea
                id="prod-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات کامل درباره خطوط و رگه‌های سنگ، سازگاری با سیستم‌های گرمایش از کف یا شرایط جوی نما..."
                className="text-xs min-h-24"
              />
            </div>

            {/* Status Selector */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <Label htmlFor="prod-status" className="text-xs font-semibold block">
                  وضعیت انتشار در پلتفرم و شوروم کارخانه
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  سنگ‌های در وضعیت پیش‌نویس تنها برای مدیریت قابل مشاهده هستند.
                </p>
              </div>

              <select
                id="prod-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold"
              >
                <option value="published">منتشرشده (آماده سفارش)</option>
                <option value="draft">پیش‌نویس (عدم نمایش)</option>
                <option value="archived">بایگانی شده</option>
              </select>
            </div>

            {renderTabFooter("gallery", null, "", 5)}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interactive Image Editor Dialog */}
      {editingImage && (
        <ImageEditorDialog
          open={Boolean(editingImage)}
          onOpenChange={(open) => {
            if (!open) setEditingImage(null);
          }}
          imageUrl={editingImage.url}
          imageTitle={editingImage.title}
          onSave={handleSaveEditedImage}
        />
      )}
    </form>
  );
}
