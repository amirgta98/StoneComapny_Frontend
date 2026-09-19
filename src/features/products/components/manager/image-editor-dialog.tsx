"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Sparkles,
  RefreshCw,
  Check,
  X,
  Crop,
  Sliders,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ImageEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageTitle?: string;
  onSave: (editedImageUrl: string) => void;
}

type AspectRatioPreset = "original" | "16:9" | "4:3" | "1:1" | "3:4";

export function ImageEditorDialog({
  open,
  onOpenChange,
  imageUrl,
  imageTitle = "ویرایش تصویر سنگ",
  onSave,
}: ImageEditorDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Transformations
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>("original");
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Color adjustments
  const [brightness, setBrightness] = useState<number>(100); // 50 - 150
  const [contrast, setContrast] = useState<number>(100); // 50 - 150
  const [saturation, setSaturation] = useState<number>(100); // 0 - 200

  // Active Tool Tab
  const [activeTool, setActiveTool] = useState<"crop" | "transform" | "filters">(
    "transform"
  );

  // Dragging / panning state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset all settings
  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio("original");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  // Load image when imageUrl changes or dialog opens
  useEffect(() => {
    if (!open || !imageUrl) return;

    handleReset();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
    img.src = imageUrl;
  }, [open, imageUrl]);

  // Render canvas with current transformations
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Determine target canvas aspect ratio
    let targetRatio = img.width / img.height;
    if (aspectRatio === "16:9") targetRatio = 16 / 9;
    if (aspectRatio === "4:3") targetRatio = 4 / 3;
    if (aspectRatio === "1:1") targetRatio = 1;
    if (aspectRatio === "3:4") targetRatio = 3 / 4;

    // Viewport preview width/height
    const maxViewWidth = 720;
    const maxViewHeight = 440;

    let canvasWidth = maxViewWidth;
    let canvasHeight = canvasWidth / targetRatio;

    if (canvasHeight > maxViewHeight) {
      canvasHeight = maxViewHeight;
      canvasWidth = canvasHeight * targetRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear background
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Apply color filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    ctx.save();

    // Move origin to canvas center
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Flip
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Zoom & Pan
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Calculate source and draw dimensions to cover canvas
    const isRotated90or270 = rotation % 180 !== 0;
    const effectiveImgWidth = isRotated90or270 ? img.height : img.width;
    const effectiveImgHeight = isRotated90or270 ? img.width : img.height;

    const scaleToCover = Math.max(
      canvasWidth / effectiveImgWidth,
      canvasHeight / effectiveImgHeight
    );

    const drawW = img.width * scaleToCover;
    const drawH = img.height * scaleToCover;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    // Draw subtle grid overlay if in crop mode
    if (activeTool === "crop") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      // Vertical thirds
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 3, 0);
      ctx.lineTo(canvasWidth / 3, canvasHeight);
      ctx.moveTo((canvasWidth * 2) / 3, 0);
      ctx.lineTo((canvasWidth * 2) / 3, canvasHeight);
      // Horizontal thirds
      ctx.moveTo(0, canvasHeight / 3);
      ctx.lineTo(canvasWidth, canvasHeight / 3);
      ctx.moveTo(0, (canvasHeight * 2) / 3);
      ctx.lineTo(canvasWidth, (canvasHeight * 2) / 3);
      ctx.stroke();
    }
  }, [
    aspectRatio,
    rotation,
    flipH,
    flipV,
    zoom,
    pan,
    brightness,
    contrast,
    saturation,
    activeTool,
  ]);

  // Re-render whenever parameters update
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pan handlers for dragging zoomed image
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export high-resolution edited image
  const handleSave = () => {
    const img = imageObjRef.current;
    if (!img) return;

    // High quality export canvas
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    let targetRatio = img.width / img.height;
    if (aspectRatio === "16:9") targetRatio = 16 / 9;
    if (aspectRatio === "4:3") targetRatio = 4 / 3;
    if (aspectRatio === "1:1") targetRatio = 1;
    if (aspectRatio === "3:4") targetRatio = 3 / 4;

    // High definition output
    const exportWidth = Math.min(1920, Math.max(1200, img.width));
    const exportHeight = Math.round(exportWidth / targetRatio);

    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    exportCtx.fillStyle = "#ffffff";
    exportCtx.fillRect(0, 0, exportWidth, exportHeight);

    exportCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    exportCtx.save();
    exportCtx.translate(exportWidth / 2, exportHeight / 2);
    exportCtx.rotate((rotation * Math.PI) / 180);
    exportCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    exportCtx.scale(zoom, zoom);
    // Scale pan relative to export canvas
    const previewWidth = canvasRef.current?.width || 600;
    const panScale = exportWidth / previewWidth;
    exportCtx.translate(pan.x * panScale, pan.y * panScale);

    const isRotated90or270 = rotation % 180 !== 0;
    const effectiveImgWidth = isRotated90or270 ? img.height : img.width;
    const effectiveImgHeight = isRotated90or270 ? img.width : img.height;

    const scaleToCover = Math.max(
      exportWidth / effectiveImgWidth,
      exportHeight / effectiveImgHeight
    );

    const drawW = img.width * scaleToCover;
    const drawH = img.height * scaleToCover;

    exportCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    exportCtx.restore();

    try {
      const dataUrl = exportCanvas.toDataURL("image/jpeg", 0.92);
      onSave(dataUrl);
      onOpenChange(false);
      toast.success("تصویر با موفقیت ویرایش و اعمال گردید.");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ذخیره‌سازی تصویر ویرایش‌شده.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 gap-0 overflow-hidden bg-card border-border/80 rounded-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-secondary/30">
          <div>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>{imageTitle}</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              امکان برش، چرخش، قرینه‌سازی بوک‌مچ و اصلاح روشنایی و کنتراست اسلب سنگ
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs gap-1 h-8 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>بازنشانی</span>
          </Button>
        </div>

        {/* Workspace: Preview Canvas + Control Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Canvas Preview Area */}
          <div className="md:col-span-8 flex flex-col items-center justify-center p-4 bg-zinc-950/90 relative select-none">
            <div className="relative max-w-full max-h-[440px] flex items-center justify-center rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`max-w-full max-h-[440px] object-contain ${
                  zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                }`}
              />
            </div>

            {/* Quick Canvas Zoom Indicator */}
            {zoom > 1 && (
              <div className="absolute bottom-6 start-6 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
                <span>بزرگ‌نمایی: {Math.round(zoom * 100)}%</span>
                <span className="text-zinc-400">| برای جابجایی کلیک و درگ کنید</span>
              </div>
            )}
          </div>

          {/* Tools Panel */}
          <div className="md:col-span-4 p-5 flex flex-col justify-between border-s border-border/70 bg-card space-y-4">
            {/* Tool Tabs */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-1 bg-secondary/50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTool("transform")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTool === "transform"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>چرخش و تقارن</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTool("crop")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTool === "crop"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Crop className="h-3.5 w-3.5" />
                  <span>برش و کادر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTool("filters")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTool === "filters"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>نور و رنگ</span>
                </button>
              </div>

              {/* Tool 1: Transform & Orientation */}
              {activeTool === "transform" && (
                <div className="space-y-4 pt-1">
                  <div>
                    <Label className="text-xs font-semibold block mb-2">
                      چرخش ۹۰ درجه
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRotation((prev) => (prev + 90) % 360)
                        }
                        className="text-xs h-9 gap-1.5"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>ساعت‌گرد</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRotation((prev) => (prev - 90 + 360) % 360)
                        }
                        className="text-xs h-9 gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>پادساعت‌گرد</span>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <Label className="text-xs font-semibold block mb-2">
                      قرینه‌سازی (بوک‌مچ / فورمچ سنگ)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={flipH ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFlipH((prev) => !prev)}
                        className="text-xs h-9 gap-1.5"
                      >
                        <FlipHorizontal className="h-3.5 w-3.5" />
                        <span>قرینه افقی (بوک‌مچ)</span>
                      </Button>
                      <Button
                        type="button"
                        variant={flipV ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFlipV((prev) => !prev)}
                        className="text-xs h-9 gap-1.5"
                      >
                        <FlipVertical className="h-3.5 w-3.5" />
                        <span>قرینه عمودی (فور‌مچ)</span>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs font-semibold">بزرگ‌نمایی و زوم</Label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg accent-primary cursor-pointer"
                      />
                      <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                </div>
              )}

              {/* Tool 2: Crop & Aspect Ratio */}
              {activeTool === "crop" && (
                <div className="space-y-4 pt-1">
                  <div>
                    <Label className="text-xs font-semibold block mb-2">
                      نسبت ابعاد کادر سنگ
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={aspectRatio === "original" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspectRatio("original")}
                        className="text-xs h-8"
                      >
                        ابعاد اصلی تصویر
                      </Button>
                      <Button
                        type="button"
                        variant={aspectRatio === "16:9" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspectRatio("16:9")}
                        className="text-xs h-8"
                      >
                        ۱۶:۹ (اسلب عریض)
                      </Button>
                      <Button
                        type="button"
                        variant={aspectRatio === "4:3" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspectRatio("4:3")}
                        className="text-xs h-8"
                      >
                        ۴:۳ (استاندارد کاتالوگ)
                      </Button>
                      <Button
                        type="button"
                        variant={aspectRatio === "1:1" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspectRatio("1:1")}
                        className="text-xs h-8"
                      >
                        ۱:۱ (تایل مربعی)
                      </Button>
                      <Button
                        type="button"
                        variant={aspectRatio === "3:4" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspectRatio("3:4")}
                        className="text-xs h-8 col-span-2"
                      >
                        ۳:۴ (عمودی بوک‌مچ و ستون)
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
                    نسبت کادر انتخابی به صورت خودکار اندازه تصویر را برای نمایش ایده‌آل در فروشگاه و کاتالوگ‌های چاپی تنظیم می‌کند.
                  </div>
                </div>
              )}

              {/* Tool 3: Lighting & Color Filters */}
              {activeTool === "filters" && (
                <div className="space-y-3 pt-1">
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-amber-500" />
                        <span>روشنایی و نور اسلب</span>
                      </Label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {brightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="2"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <Contrast className="h-3.5 w-3.5 text-blue-500" />
                        <span>کنتراست و شفافیت رگه‌ها</span>
                      </Label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {contrast}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="2"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        <span>اشباع رنگ زمینه</span>
                      </Label>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {saturation}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="2"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs flex-1"
              >
                انصراف
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                className="text-xs flex-1 gap-1.5 font-semibold"
              >
                <Check className="h-4 w-4" />
                <span>اعمال و ذخیره</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
