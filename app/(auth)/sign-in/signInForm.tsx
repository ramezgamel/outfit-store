"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import Form from "../Form";

const CredentialsSignInForm = () => {
  const { pending } = useFormStatus();

  return (
    <Form formAction={signInWithCredentials}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="focus-visible:ring-offset-0 focus-visible:ring-2"
          required
          autoComplete="email"
          name="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          autoComplete="password"
          name="password"
          className="focus-visible:ring-offset-0 focus-visible:ring-2"
        />
      </div>
      <div>
        <Button disabled={pending} className="w-full" variant={"default"}>
          {pending ? "Sign In..." : "Sign In"}
        </Button>
      </div>

      <div className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" target="_self" className="text-primary">
          Sign Up
        </Link>
      </div>
    </Form>
  );
};

export default CredentialsSignInForm;
