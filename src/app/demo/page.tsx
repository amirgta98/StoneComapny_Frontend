"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { Product } from "@/types";
import { Download, Heart, Mail, MoreHorizontal, Palette, Plus, Search, Settings, Share2, Star, Trash2, Upload, User } from "lucide-react";

const mockProducts: Product[] = [
  {
    id: "1",
    tenantId: "tenant-1",
    name: "Calacatta Gold Marble",
    slug: "calacatta-gold-marble",
    description: "Luxurious Italian marble with dramatic veining.",
    status: "published",
    stoneType: "marble",
    color: "white",
    finish: "polished",
    form: "slab",
    application: "countertop",
    origin: "Italy",
    quarry: "Carrara",
    grade: "Premium",
    thickness: 20,
    dimensions: "3050x1520x20 mm",
    pricingUnit: "per-slab",
    inventoryUnit: "slab",
    price: 1200,
    compareAtPrice: 1500,
    images: [
      { id: "img-1", url: "https://placehold.co/400x400/f1f5f9/475569?text=Calacatta+Gold", alt: "Calacatta Gold Marble slab", sortOrder: 1, isPrimary: true },
      { id: "img-2", url: "https://placehold.co/400x400/f1f5f9/475569?text=Detail", alt: "Detail view", sortOrder: 2 },
    ],
    attributes: [{ id: "attr-1", name: "Thickness", value: "20", unit: "mm" }],
    variants: [{ id: "var-1", sku: "MAR-CAL-001", name: "Standard", attributes: [], price: 1200, inventory: 5 }],
    categories: ["marble", "luxury"],
    collections: ["italian-collection"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    tenantId: "tenant-1",
    name: "Nero Marquina Marble",
    slug: "nero-marquina-marble",
    description: "Deep black marble with crisp white veins.",
    status: "published",
    stoneType: "marble",
    color: "black",
    finish: "polished",
    form: "slab",
    application: "feature-wall",
    origin: "Spain",
    quarry: "Marquina",
    grade: "Premium",
    thickness: 20,
    dimensions: "3050x1520x20 mm",
    pricingUnit: "per-slab",
    inventoryUnit: "slab",
    price: 950,
    compareAtPrice: 1100,
    images: [
      { id: "img-3", url: "https://placehold.co/400x400/1e293b/f8fafc?text=Nero+Marquina", alt: "Nero Marquina Marble", sortOrder: 1, isPrimary: true },
    ],
    attributes: [],
    variants: [],
    categories: ["marble", "dark"],
    collections: ["spanish-collection"],
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "3",
    tenantId: "tenant-1",
    name: "Travertine Classic",
    slug: "travertine-classic",
    description: "Warm beige travertine with natural voids.",
    status: "published",
    stoneType: "travertine",
    color: "beige",
    finish: "honed",
    form: "tile",
    application: "flooring",
    origin: "Turkey",
    quarry: "Denizli",
    grade: "Grade A",
    thickness: 12,
    dimensions: "600x600x12 mm",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 45,
    images: [
      { id: "img-4", url: "https://placehold.co/400x400/d6d3d1/44403c?text=Travertine", alt: "Travertine Classic tile", sortOrder: 1, isPrimary: true },
    ],
    attributes: [],
    variants: [],
    categories: ["travertine"],
    collections: ["classic-collection"],
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-03-05T00:00:00Z",
  },
  {
    id: "4",
    tenantId: "tenant-1",
    name: "Black Galaxy Granite",
    slug: "black-galaxy-granite",
    description: "Deep black granite with golden speckles.",
    status: "published",
    stoneType: "granite",
    color: "black",
    finish: "polished",
    form: "slab",
    application: "countertop",
    origin: "India",
    quarry: "Andhra Pradesh",
    grade: "Premium",
    thickness: 20,
    dimensions: "3050x1520x20 mm",
    pricingUnit: "per-slab",
    inventoryUnit: "slab",
    price: 800,
    compareAtPrice: 900,
    images: [
      { id: "img-5", url: "https://placehold.co/400x400/0f172a/fbbf24?text=Black+Galaxy", alt: "Black Galaxy Granite", sortOrder: 1, isPrimary: true },
    ],
    attributes: [],
    variants: [],
    categories: ["granite", "dark"],
    collections: ["indian-collection"],
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
  },
];

export default function ComponentsDemoPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("default");
  const [checkboxValues, setCheckboxValues] = useState({
    notifications: true,
    marketing: false,
    updates: true,
  });
  const [selectValue, setSelectValue] = useState("");
  const [tabsValue, setTabsValue] = useState("account");

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Component Showcase</h1>
        <p className="text-muted-foreground">All UI components and feature components with test data in one page.</p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Heart className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a card description text.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Card content goes here. You can put any content inside a Card.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="grid w-full max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Search products..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" placeholder="Disabled input" disabled />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Select</h2>
        <div className="w-full max-w-sm">
          <Label>Choose a stone type</Label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select a stone type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Natural Stone</SelectLabel>
                <SelectItem value="marble">Marble</SelectItem>
                <SelectItem value="granite">Granite</SelectItem>
                <SelectItem value="travertine">Travertine</SelectItem>
                <SelectItem value="limestone">Limestone</SelectItem>
                <SelectItem value="onyx">Onyx</SelectItem>
                <SelectItem value="quartzite">Quartzite</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Engineered</SelectLabel>
                <SelectItem value="porcelain">Porcelain</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {selectValue && <p className="mt-2 text-sm text-muted-foreground">Selected: {selectValue}</p>}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@johndoe" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("Saved successfully"); }}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dropdown Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu <MoreHorizontal className="ml-2 h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Palette className="mr-2 h-4 w-4" />
              Themes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={checkboxValues.notifications}
              onCheckedChange={(checked) => setCheckboxValues({ ...checkboxValues, notifications: checked })}
            >
              Notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={checkboxValues.marketing}
              onCheckedChange={(checked) => setCheckboxValues({ ...checkboxValues, marketing: checked })}
            >
              Marketing emails
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={checkboxValues.updates}
              onCheckedChange={(checked) => setCheckboxValues({ ...checkboxValues, updates: checked })}
            >
              Product updates
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioItem value="online">Online</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="away">Away</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="busy">Busy</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs value={tabsValue} onValueChange={setTabsValue} className="w-full max-w-2xl">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Make changes to your account here. Click save when you are done.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input defaultValue="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="john@example.com" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Current password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-1">
                  <Label>New password</Label>
                  <Input type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your application settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Settings content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Reset</Button>
                <Button>Save settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Separator</h2>
        <div>
          <p className="text-sm text-muted-foreground">Above separator</p>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">Below separator</p>
        </div>
        <div className="flex h-20 items-center">
          <span className="text-sm text-muted-foreground">Left</span>
          <Separator orientation="vertical" className="mx-4 h-full" />
          <span className="text-sm text-muted-foreground">Right</span>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeleton</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toasts (Sonner)</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success("Operation completed successfully")}>
            Success Toast
          </Button>
          <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
            Error Toast
          </Button>
          <Button variant="outline" onClick={() => toast.warning("Warning message")}>
            Warning Toast
          </Button>
          <Button variant="outline" onClick={() => toast.message("Hello from the other side")}>
            Message Toast
          </Button>
          <Button variant="outline" onClick={() => toast("Default toast")}>
            Default Toast
          </Button>
        </div>
        <Toaster />
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Product Cards & Grid</h2>
        <ProductGrid products={mockProducts} columns={4} />
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Product Card Variants</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="space-y-2">
              <p className="text-sm font-medium">Default Variant</p>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={`featured-${product.id}`} className="space-y-2">
              <p className="text-sm font-medium">Featured Variant</p>
              <ProductCard product={product} variant="featured" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={`compact-${product.id}`} className="space-y-2">
              <p className="text-sm font-medium">Compact Variant</p>
              <ProductCard product={product} variant="compact" showPrice={false} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
