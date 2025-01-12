import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="border-b w-full">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/logo.svg"
              height={48}
              width={48}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
            <span className="text-2xl hidden font-bold ml-3 lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
