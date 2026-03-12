import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccessDenied() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-app-background">
      <Card className="bg-app-card border-app-border text-white max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="w-16 h-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-gray-300 text-center">
            You do not have permission to access the admin panel.
          </CardDescription>
          <p className="text-sm text-gray-400 text-center">
            If you believe this is a mistake, please contact the system
            administrator.
          </p>
          <form action={logoutAction} className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="destructive"
              className="w-full border-app-border text-white"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
