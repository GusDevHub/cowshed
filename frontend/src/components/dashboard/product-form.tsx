"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceValue, setPriceValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function convertGBPToPennies(value: string): number {
    const cleanValue = value.replace(/[£,\s]/g, "");
    const pounds = parseFloat(cleanValue);

    if (isNaN(pounds)) return 0;

    return Math.round(pounds * 100);
  }

  async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (!imageFile) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    const formElement = e.currentTarget;

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)
      ?.value;
    const description = (
      formElement.elements.namedItem("description") as HTMLInputElement
    )?.value;
    const priceInCents = convertGBPToPennies(priceValue);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceInCents.toString());
    formData.append("category_id", selectedCategory);
    formData.append("file", imageFile);

    const result = await createProductAction(formData);

    setIsLoading(false);

    if (result.success) {
      setOpen(false);
      setSelectedCategory("");
      clearImage();
      setPriceValue("");
      router.refresh();
      return;
    } else {
      console.log(result.error);
      alert(result.error);
    }
  }

  function formatToGBP(value: string) {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    const amount = parseInt(numbers) / 100;

    return amount.toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP",
    });
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatToGBP(e.target.value);
    setPriceValue(formatted);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  const selectedCategoryName = categories.find(
    (category) => category.id === selectedCategory,
  )?.name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="bg-brand-primary hover:bg-brand-primary font-semibold max-w-40"
          >
            New product
          </Button>
        }
      >
        <Plus className="h-5 w-5 mr-2" />
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New product</DialogTitle>
          <DialogDescription>Create a new product</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Product name
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Cheesecake"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="1.50"
              className="border-app-border bg-app-background text-white"
              value={priceValue}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Add a brief product description..."
              className="border-app-border bg-app-background text-white min-h-25"
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger className="border-app-border bg-app-background text-white">
                <SelectValue placeholder="Select category">
                  {selectedCategoryName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="bg-app-card border-app-border">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-white hover:bg-transparent cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Product image
            </Label>
            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="product image preview"
                  fill
                  className="object-cover z-10"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={clearImage}
                  className="absolute top-2 right-2 z-20"
                >
                  Remove image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <Label htmlFor="file" className="cursor-pointer underline">
                  Click here to select an image
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedCategory}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary disabled:opacity-50"
          >
            {isLoading ? "Creating product..." : "Create product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
