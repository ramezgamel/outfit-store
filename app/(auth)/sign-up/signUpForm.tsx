"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import Form from "../Form";

const SignUpForm = () => {
  const { pending } = useFormStatus();

  return (
    <Form formAction={signUpAction}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          className="focus-visible:ring-offset-0 focus-visible:ring-2"
          required
          autoComplete="name"
          name="name"
        />
      </div>
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
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          autoComplete="password"
          name="confirmPassword"
          className="focus-visible:ring-offset-0 focus-visible:ring-2"
        />
      </div>
      <div>
        <Button disabled={pending} className="w-full" variant={"default"}>
          {pending ? "Submitting..." : "Sign Up"}
        </Button>
      </div>

      <div className="text-sm text-center text-muted-foreground">
        Already have an Account?{" "}
        <Link href="/sign-in" target="_self" className="text-primary">
          Sign In
        </Link>
      </div>
    </Form>
  );
};

export default SignUpForm;
