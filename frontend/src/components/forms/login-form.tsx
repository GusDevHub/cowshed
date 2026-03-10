"use client";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { loginAction, registerAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
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
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
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
            {isPending ? "Logging in..." : "Log in"}
          </Button>
          {state?.error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {state.error}
            </div>
          )}
          <p className="text-center text-gray-100">
            Don’t have an account?{" "}
            <Link href="/register" className="text-brand-primary font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
