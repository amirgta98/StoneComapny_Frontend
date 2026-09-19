"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createUser } from "../actions";
import { createUserSchema, type CreateUserFormValues } from "../schemas";
import type { Tenant } from "@/types";

type CreateUserFormProps = {
  tenants: Tenant[];
};

export function CreateUserForm({ tenants }: CreateUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "user",
      tenantId: "",
    },
  });

  const selectedRole = watch("role");
  const selectedTenantId = watch("tenantId");
  const isSuperAdmin = selectedRole === "super_admin";

  async function onSubmit(data: CreateUserFormValues) {
    setIsSubmitting(true);
    setSuccess(false);
    try {
      const result = await createUser(data);
      if (result.error) {
        console.error("Error creating user:", result.issues);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">✅ کاربر با موفقیت ایجاد شد</CardTitle>
          <CardDescription>
            کاربر جدید به سیستم اضافه شد.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <a href="/superAdmin/users">بازگشت به لیست کاربران</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>ایجاد کاربر جدید</CardTitle>
        <CardDescription>
          اطلاعات کاربر جدید را وارد کنید.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">نام کاربر</Label>
            <Input
              id="name"
              placeholder="نام کامل را وارد کنید"
              {...register("name")}
              dir="rtl"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">شماره تلفن</Label>
            <Input
              id="phone"
              placeholder="09121234567"
              {...register("phone")}
              dir="ltr"
              className="text-left"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">نقش</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setValue("role", value as "admin" | "user" | "super_admin");
                if (value === "super_admin") {
                  setValue("tenantId", "");
                }
              }}
            >
              <SelectTrigger id="role" dir="rtl">
                <SelectValue placeholder="انتخاب نقش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">سوپر ادمین</SelectItem>
                <SelectItem value="admin">مدیر</SelectItem>
                <SelectItem value="user">کاربر</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Tenant / Company */}
          {!isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="tenantId">شرکت</Label>
              <Select
                value={selectedTenantId}
                onValueChange={(value) => setValue("tenantId", value)}
              >
                <SelectTrigger id="tenantId" dir="rtl">
                  <SelectValue placeholder="انتخاب شرکت" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tenantId && (
                <p className="text-sm text-destructive">{errors.tenantId.message}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" asChild>
            <a href="/superAdmin/users">انصراف</a>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "در حال ایجاد..." : "ایجاد کاربر"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
