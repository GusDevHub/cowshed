"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";

export function CategoryForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function handleCreateCategory(formData: FormData) {
    const result = await createCategoryAction(formData);
    if (result.success) {
      setOpen(false);
      router.refresh();
      return;
    } else {
      console.log(result.error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="bg-brand-primary hover:bg-brand-primary font-semibold"
          />
        }
      >
        <Plus className="w-5 h-5 md-2" />
        <span>New category</span>
      </DialogTrigger>
      <DialogContent className="p-6 bg-app-card text-white">
        <DialogHeader>
          <DialogTitle className="font-semibold">New category</DialogTitle>
          <DialogDescription className="text-xs">
            Create a new category
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" action={handleCreateCategory}>
          <div>
            <Label htmlFor="category" className="mb-2">
              Category name
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Dessert"
              className="border-app-border bg-app-background text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            Create category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
