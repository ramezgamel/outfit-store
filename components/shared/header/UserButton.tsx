import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signUserOut } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();
  if (!session)
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-8 w-8 rounded-full ml-2 bg-gray-600 flex items-center justify-center">
          {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="font-normal flex flex-col">
          <span>{session.user?.name}</span>
          <span className="text-muted-foreground">{session.user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem className="p-0 mb-1">
          <form action={signUserOut}>
            <Button
              className="w-full py-4 px-2 h-4 justify-center"
              variant="ghost"
            >
              Sign out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
