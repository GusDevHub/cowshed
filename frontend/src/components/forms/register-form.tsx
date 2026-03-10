"use client";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { registerAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const router = useRouter();
  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);
  return (
    <Card className="bg-app-card border-app-border w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="rounded-full w-24 mx-auto"
          />
        </CardTitle>
        <CardDescription className="text-center text-xs">
          Create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="John Smith"
              required
              minLength={3}
              className="text-white bg-app-card border-app-border"
            ></Input>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
              placeholder="john@smith.com"
              required
              className="text-white bg-app-card border-app-border"
            ></Input>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
              required
              className="text-white bg-app-card border-app-border"
            ></Input>
          </div>
          <Button
            type="submit"
            className="w-full text-white bg-brand-primary hover:bg-brand-primary font-semibold"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-gray-100">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-primary font-semibold">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
