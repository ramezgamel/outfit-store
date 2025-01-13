import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggler from "./ModeToggler";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import UserButton from "./UserButton";

const Menu = () => {
  const menuItems = (
    <>
      <ModeToggler />
      <Button asChild variant={"ghost"}>
        <Link href="/cart">
          <ShoppingCart />
          Cart
        </Link>
      </Button>
      <UserButton />
    </>
  );
  return (
    <div className="flex justify-end gap-2">
      {/* w-full max-w-xs */}
      <nav className="hidden md:flex gap-1">{menuItems}</nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-2">
            <SheetTitle className="text-center">Menu</SheetTitle>
            {menuItems}
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
