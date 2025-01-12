"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4 mr-2">
      <Image
        src={images[current]}
        width={1000}
        height={1000}
        alt="Product Image"
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-500",
              current === i && "border-orange-500"
            )}
          >
            <Image src={img} width={100} height={100} alt="Product Image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
