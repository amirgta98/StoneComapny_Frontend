import type { CategoryNode } from "../types";
import { MAX_CATEGORY_DEPTH } from "../types";

export const mockHierarchicalCategories: CategoryNode[] = [
  // ================= Level 1: سنگ مرمریت =================
  {
    id: "cat-1",
    tenantId: "tenant-001",
    name: "سنگ مرمریت",
    slug: "marble",
    description: "انواع سنگ‌های مرمریت ساختمانی، اسلب‌های دکوراتیو و تایل‌های کف و نما",
    image: "/test_images/stones/test_1.jpg",
    parentId: null,
    depth: 1,
    order: 1,
    isActive: true,
    productCount: 14,
    createdAt: "۱۴۰۳/۰۱/۱۵",
  },
  // Level 2: مرمریت دهبید
  {
    id: "cat-1-1",
    tenantId: "tenant-001",
    name: "مرمریت دهبید",
    slug: "dehbid-marble",
    description: "سنگ کرم استخوانی و بژ با ساب‌پذیری بالا از معادن صفاشهر",
    image: "/test_images/stones/test_7.jpg",
    parentId: "cat-1",
    depth: 2,
    order: 1,
    isActive: true,
    productCount: 8,
    createdAt: "۱۴۰۳/۰۱/۲۰",
  },
  // Level 3: اسلب دهبید
  {
    id: "cat-1-1-1",
    tenantId: "tenant-001",
    name: "اسلب مرمریت دهبید",
    slug: "dehbid-slab",
    description: "اسلب‌های سایز بزرگ صادراتی با ضخامت ۲ سانتی‌متر",
    image: "/test_images/stones/test_1.jpg",
    parentId: "cat-1-1",
    depth: 3,
    order: 1,
    isActive: true,
    productCount: 5,
    createdAt: "۱۴۰۳/۰۲/۰۱",
  },
  // Level 4 (FINAL LEAF): ساب صیقلی نانو
  {
    id: "cat-1-1-1-1",
    tenantId: "tenant-001",
    name: "ساب صیقلی نانو کریستال",
    slug: "dehbid-slab-nano-polished",
    description: "فرآوری براق آینه‌ای با رزین اپوکسی و نانو کریستالیزه",
    image: "/test_images/stones/test_1.jpg",
    parentId: "cat-1-1-1",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 3,
    createdAt: "۱۴۰۳/۰۲/۰۵",
  },
  // Level 4 (FINAL LEAF): ساب مات ابریشمی
  {
    id: "cat-1-1-1-2",
    tenantId: "tenant-001",
    name: "ساب مات ابریشمی (Honed)",
    slug: "dehbid-slab-honed",
    description: "سطح مخملی و مات بدون بازتاب نور مناسب برای فضاهای مدرن",
    image: "/test_images/stones/test_2.jpg",
    parentId: "cat-1-1-1",
    depth: 4,
    order: 2,
    isActive: true,
    productCount: 2,
    createdAt: "۱۴۰۳/۰۲/۰۶",
  },
  // Level 3: تایل دهبید
  {
    id: "cat-1-1-2",
    tenantId: "tenant-001",
    name: "تایل مرمریت دهبید کف",
    slug: "dehbid-tiles",
    description: "تایل‌های کالیبره شده با لبه‌ابزار دقیق",
    image: "/test_images/stones/test_7.jpg",
    parentId: "cat-1-1",
    depth: 3,
    order: 2,
    isActive: true,
    productCount: 3,
    createdAt: "۱۴۰۳/۰۲/۰۳",
  },
  // Level 4 (FINAL LEAF): ابعاد ۸۰×۸۰
  {
    id: "cat-1-1-2-1",
    tenantId: "tenant-001",
    name: "تایل کالیبره ۸۰ × ۸۰",
    slug: "dehbid-tile-80x80",
    description: "تایل‌های استاندارد کف سالن و پذیرایی",
    image: "/test_images/stones/test_7.jpg",
    parentId: "cat-1-1-2",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 2,
    createdAt: "۱۴۰۳/۰۲/۰۸",
  },

  // Level 2: مرمریت لاشتر
  {
    id: "cat-1-2",
    tenantId: "tenant-001",
    name: "مرمریت لاشتر (پیترا گری)",
    slug: "lashtor-marble",
    description: "سنگ طوسی و دودی اصیل با رگه‌های سفید نامنظم",
    image: "/test_images/stones/test_3.jpg",
    parentId: "cat-1",
    depth: 2,
    order: 2,
    isActive: true,
    productCount: 6,
    createdAt: "۱۴۰۳/۰۱/۲۵",
  },
  // Level 3: فرآوری بوش‌همر چرمی
  {
    id: "cat-1-2-1",
    tenantId: "tenant-001",
    name: "پلاک و تایل لاشتر",
    slug: "lashtor-slabs-tiles",
    description: "قواره‌های متنوع طولی و تایل محوطه و نما",
    image: "/test_images/stones/test_3.jpg",
    parentId: "cat-1-2",
    depth: 3,
    order: 1,
    isActive: true,
    productCount: 4,
    createdAt: "۱۴۰۳/۰۲/۱۰",
  },
  // Level 4 (FINAL LEAF): بوش‌همر چرمی
  {
    id: "cat-1-2-1-1",
    tenantId: "tenant-001",
    name: "بوش‌همر چرمی ضد لغزش",
    slug: "lashtor-bushhammered-leather",
    description: "فرآوری مکانیکی برجسته با لمس مخملی چرمی",
    image: "/test_images/stones/test_3.jpg",
    parentId: "cat-1-2-1",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 4,
    createdAt: "۱۴۰۳/۰۲/۱۲",
  },

  // ================= Level 1: سنگ تراورتن =================
  {
    id: "cat-2",
    tenantId: "tenant-001",
    name: "سنگ تراورتن",
    slug: "travertine",
    description: "سنگ‌های متخلخل طبیعی با چسبندگی فوق‌العاده ویژه نماهای رومی و مدرن",
    image: "/test_images/stones/test_5.jpg",
    parentId: null,
    depth: 1,
    order: 2,
    isActive: true,
    productCount: 12,
    createdAt: "۱۴۰۳/۰۱/۱۶",
  },
  // Level 2: تراورتن دره بخاری
  {
    id: "cat-2-1",
    tenantId: "tenant-001",
    name: "تراورتن دره بخاری",
    slug: "dare-bokhari-travertine",
    description: "سنگ کرم روشن مایل به سفید سوپر صادراتی",
    image: "/test_images/stones/test_5.jpg",
    parentId: "cat-2",
    depth: 2,
    order: 1,
    isActive: true,
    productCount: 7,
    createdAt: "۱۴۰۳/۰۱/۲۸",
  },
  // Level 3: سنگ نمای ۴۰ طولی
  {
    id: "cat-2-1-1",
    tenantId: "tenant-001",
    name: "تایل ۴۰ طولی نما",
    slug: "dare-bokhari-40-length",
    description: "عرض ۴۰ سانتی‌متر با طول آزاد",
    image: "/test_images/stones/test_5.jpg",
    parentId: "cat-2-1",
    depth: 3,
    order: 1,
    isActive: true,
    productCount: 5,
    createdAt: "۱۴۰۳/۰۲/۱۵",
  },
  // Level 4 (FINAL LEAF): رزین اپوکسی براق بی‌موج
  {
    id: "cat-2-1-1-1",
    tenantId: "tenant-001",
    name: "بی‌موج ساب پولیش اپوکسی",
    slug: "dare-bokhari-vein-cut-resin",
    description: "برش بی‌موج (Cross-cut) با فیلر ماستیک اپوکسی همرنگ",
    image: "/test_images/stones/test_5.jpg",
    parentId: "cat-2-1-1",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 3,
    createdAt: "۱۴۰۳/۰۲/۱۸",
  },

  // ================= Level 1: سنگ گرانیت =================
  {
    id: "cat-3",
    tenantId: "tenant-001",
    name: "سنگ گرانیت",
    slug: "granite",
    description: "سنگ‌های آذرین مستحکم با مقاومت فشاری و فرسایشی بالا",
    image: "/test_images/stones/test_4.jpg",
    parentId: null,
    depth: 1,
    order: 3,
    isActive: true,
    productCount: 9,
    createdAt: "۱۴۰۳/۰۱/۱۸",
  },
  // Level 2: گرانیت مشکی نطنز
  {
    id: "cat-3-1",
    tenantId: "tenant-001",
    name: "گرانیت مشکی نطنز",
    slug: "natanz-black-granite",
    description: "مشکی دانه ریز و دانه درشت با استحکام مثال‌زدنی",
    image: "/test_images/stones/test_4.jpg",
    parentId: "cat-3",
    depth: 2,
    order: 1,
    isActive: true,
    productCount: 5,
    createdAt: "۱۴۰۳/۰۲/۰۲",
  },
  // Level 3: پله و زیرپله
  {
    id: "cat-3-1-1",
    tenantId: "tenant-001",
    name: "سنگ پله ضخامت ۳ سانت",
    slug: "natanz-steps-3cm",
    description: "پله‌های ۳ سانتی با ابزار لبه دوبل و فارسی",
    image: "/test_images/stones/test_4.jpg",
    parentId: "cat-3-1",
    depth: 3,
    order: 1,
    isActive: true,
    productCount: 3,
    createdAt: "۱۴۰۳/۰۲/۲۰",
  },
  // Level 4 (FINAL LEAF): ابزار لبه دوبل ساب‌خورده
  {
    id: "cat-3-1-1-1",
    tenantId: "tenant-001",
    name: "ابزار لبه دوبل نیم‌گرد",
    slug: "natanz-step-bullnose",
    description: "ابزارزنی لبه پله با دستگاه CNC و پولیش براق",
    image: "/test_images/stones/test_4.jpg",
    parentId: "cat-3-1-1",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 2,
    createdAt: "۱۴۰۳/۰۲/۲۲",
  },

  // ================= Level 1: سنگ مرمر و آنیکس =================
  {
    id: "cat-4",
    tenantId: "tenant-001",
    name: "سنگ مرمر و آنیکس لوکس",
    slug: "onyx-marble",
    description: "سنگ‌های دگرگونی تراورتنی با قابلیت عبور نور و بلورهای شفاف",
    image: "/test_images/stones/test_6.jpg",
    parentId: null,
    depth: 1,
    order: 4,
    isActive: true,
    productCount: 5,
    createdAt: "۱۴۰۳/۰۱/۲۲",
  },
  // Level 2: آنیکس سبز زمردی
  {
    id: "cat-4-1",
    tenantId: "tenant-001",
    name: "آنیکس سبز زمردی",
    slug: "emerald-green-onyx",
    description: "سنگ مرمر سبز یشمی با رگه‌های کهربایی و طلایی",
    image: "/test_images/stones/test_6.jpg",
    parentId: "cat-4",
    depth: 2,
    order: 1,
    isActive: true,
    productCount: 3,
    createdAt: "۱۴۰۳/۰۲/۰۵",
  },
  // Level 3: اسلب بوک‌مچ
  {
    id: "cat-4-1-1",
    tenantId: "tenant-001",
    name: "اسلب بوک‌مچ و فورمچ",
    slug: "green-onyx-bookmatch",
    description: "طرح‌های متقارن آینه‌ای جفت و چهارتایی",
    image: "/test_images/stones/test_6.jpg",
    parentId: "cat-4-1",
    depth: 3,
    order: 1,
    isActive: true,
    productCount: 2,
    createdAt: "۱۴۰3/۰۲/۲۴",
  },
  // Level 4 (FINAL LEAF): فرآوری نورگذر پشت توری
  {
    id: "cat-4-1-1-1",
    tenantId: "tenant-001",
    name: "پشت توری رزین اپوکسی نورگذر",
    slug: "green-onyx-backlit-mesh",
    description: "تقویت توری فیبر با رزین کریستالی شفاف ویژه لایت‌باکس و کانتر",
    image: "/test_images/stones/test_6.jpg",
    parentId: "cat-4-1-1",
    depth: 4,
    order: 1,
    isActive: true,
    productCount: 2,
    createdAt: "۱۴۰۳/۰۲/۲۵",
  },
];

/**
 * Builds nested tree from flat list of category nodes.
 */
export function buildCategoryTree(flatList: CategoryNode[]): CategoryNode[] {
  const nodeMap = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  // Deep clone items to avoid mutation side-effects
  for (const item of flatList) {
    nodeMap.set(item.id, { ...item, children: [] });
  }

  for (const item of flatList) {
    const node = nodeMap.get(item.id);
    if (!node) continue;

    if (item.parentId && nodeMap.has(item.parentId)) {
      const parent = nodeMap.get(item.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(node);
      // Sort children by order
      parent.children.sort((a, b) => a.order - b.order);
    } else {
      roots.push(node);
    }
  }

  roots.sort((a, b) => a.order - b.order);
  return roots;
}

/**
 * Traverses a node's descendants recursively.
 */
export function getDescendantIds(nodeId: string, flatList: CategoryNode[]): Set<string> {
  const descendants = new Set<string>();

  function collect(id: string) {
    for (const item of flatList) {
      if (item.parentId === id) {
        descendants.add(item.id);
        collect(item.id);
      }
    }
  }

  collect(nodeId);
  return descendants;
}

/**
 * Computes maximum subtree depth relative to a node.
 * For a leaf node, returns 0.
 */
export function getSubtreeHeight(nodeId: string, flatList: CategoryNode[]): number {
  const children = flatList.filter((item) => item.parentId === nodeId);
  if (children.length === 0) return 0;

  let maxHeight = 0;
  for (const child of children) {
    const h = 1 + getSubtreeHeight(child.id, flatList);
    if (h > maxHeight) maxHeight = h;
  }
  return maxHeight;
}

/**
 * Checks if a category can become the parent of another category without violating:
 * 1. Self-parenting
 * 2. Circular reference (descendant becoming parent)
 * 3. MAX_CATEGORY_DEPTH = 4 constraint!
 */
export function canCategoryBeParent(
  childId: string | null,
  potentialParentId: string | null,
  flatList: CategoryNode[],
  maxDepth = MAX_CATEGORY_DEPTH
): { allowed: boolean; reason?: string; resultingDepth: 1 | 2 | 3 | 4 } {
  // If no parent (becoming root)
  if (!potentialParentId) {
    const subtreeHeight = childId ? getSubtreeHeight(childId, flatList) : 0;
    if (1 + subtreeHeight > maxDepth) {
      return {
        allowed: false,
        reason: `این دسته‌بندی دارای زیرشاخه‌های عمیق است و نمی‌تواند ریشه شود (سقف ${maxDepth} سطح نقض می‌شود).`,
        resultingDepth: 1,
      };
    }
    return { allowed: true, resultingDepth: 1 };
  }

  // Cannot be own parent
  if (childId && childId === potentialParentId) {
    return {
      allowed: false,
      reason: "یک دسته‌بندی نمی‌تواند والد خودش باشد.",
      resultingDepth: 1,
    };
  }

  // Cannot select a descendant (prevents cycle)
  if (childId) {
    const descendants = getDescendantIds(childId, flatList);
    if (descendants.has(potentialParentId)) {
      return {
        allowed: false,
        reason: "نمی‌توانید یکی از زیرمجموعه‌های این دسته را به عنوان والد آن انتخاب کنید (ایجاد حلقه).",
        resultingDepth: 1,
      };
    }
  }

  const parentNode = flatList.find((c) => c.id === potentialParentId);
  if (!parentNode) {
    return { allowed: false, reason: "دسته‌بندی والد یافت نشد.", resultingDepth: 1 };
  }

  const targetDepth = (parentNode.depth + 1) as number;
  if (targetDepth > maxDepth) {
    return {
      allowed: false,
      reason: `حداکثر سقف مجاز ${maxDepth} سطح است. والد انتخابی در سطح ${parentNode.depth} قرار دارد و نمی‌تواند زیرمجموعه جدید بپذیرد.`,
      resultingDepth: 4,
    };
  }

  // Check if moving this node would cause its descendants to exceed maxDepth
  const subtreeHeight = childId ? getSubtreeHeight(childId, flatList) : 0;
  if (targetDepth + subtreeHeight > maxDepth) {
    return {
      allowed: false,
      reason: `با انتقال این دسته به والد جدید، عمیق‌ترین زیرشاخه آن از سقف ${maxDepth} لایه فراتر خواهد رفت.`,
      resultingDepth: targetDepth as any,
    };
  }

  return {
    allowed: true,
    resultingDepth: targetDepth as 1 | 2 | 3 | 4,
  };
}
