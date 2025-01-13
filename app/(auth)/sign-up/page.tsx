import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./signUpForm";

export const metadata: Metadata = { title: "Sign In" };
const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackURL: string;
  }>;
}) => {
  const { callbackURL } = await props.searchParams;
  const session = await auth();
  if (session) {
    return redirect(callbackURL || "/");
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image src={"/logo.svg"} alt={APP_NAME} height={100} width={100} />
          </Link>
          <CardTitle className="text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Make your new Account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
