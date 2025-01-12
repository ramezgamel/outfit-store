import Image from "next/image";
import loading from "@/public/loader.gif";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image src={loading} alt="Loading..." height={100} width={100} />
        <span className="animate-pulse">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingPage;
