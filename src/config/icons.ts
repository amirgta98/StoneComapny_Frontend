import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  ShoppingBag,
  MessageSquareText,
  FolderHeart,
  Heart,
  MapPin,
  Store,
  FileText,
  ShieldCheck,
  Headphones,
  Receipt,
  BarChart3,
  Activity,
  UserCheck,
  Crown,
  Layers,
  FolderTree,
  Tags,
  FileSpreadsheet,
  ShieldAlert,
  Layout,
  Sparkles,
  TrendingUp,
  Package,
  Database,
} from "lucide-react";

export type IconName =
  | "LayoutDashboard"
  | "Building2"
  | "Users"
  | "Settings"
  | "ShoppingBag"
  | "MessageSquareText"
  | "FolderHeart"
  | "Heart"
  | "MapPin"
  | "Store"
  | "FileText"
  | "ShieldCheck"
  | "Headphones"
  | "Receipt"
  | "BarChart3"
  | "Activity"
  | "UserCheck"
  | "Crown"
  | "Layers"
  | "FolderTree"
  | "Tags"
  | "FileSpreadsheet"
  | "ShieldAlert"
  | "Layout"
  | "Sparkles"
  | "TrendingUp"
  | "Package"
  | "Database";

export function getIcon(iconName?: IconName | string) {
  if (!iconName) return null;

  switch (iconName) {
    case "LayoutDashboard":
      return LayoutDashboard;
    case "Building2":
      return Building2;
    case "Users":
      return Users;
    case "Settings":
      return Settings;
    case "ShoppingBag":
      return ShoppingBag;
    case "MessageSquareText":
      return MessageSquareText;
    case "FolderHeart":
      return FolderHeart;
    case "Heart":
      return Heart;
    case "MapPin":
      return MapPin;
    case "Store":
      return Store;
    case "FileText":
      return FileText;
    case "ShieldCheck":
      return ShieldCheck;
    case "Headphones":
      return Headphones;
    case "Receipt":
      return Receipt;
    case "BarChart3":
      return BarChart3;
    case "Activity":
      return Activity;
    case "UserCheck":
      return UserCheck;
    case "Crown":
      return Crown;
    case "Layers":
      return Layers;
    case "FolderTree":
      return FolderTree;
    case "Tags":
      return Tags;
    case "FileSpreadsheet":
      return FileSpreadsheet;
    case "ShieldAlert":
      return ShieldAlert;
    case "Layout":
      return Layout;
    case "Sparkles":
      return Sparkles;
    case "TrendingUp":
      return TrendingUp;
    case "Package":
      return Package;
    case "Database":
      return Database;
    default:
      return null;
  }
}
