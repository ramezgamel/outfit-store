"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src={logo}
        alt={`${APP_NAME} logo`}
        priority
        height={56}
        width={56}
      />
      <div className="p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
