import logo from "@/assets/cleitLogo.png"
import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="flex justify-between px-8 pr-12">
        <Image src={logo} width={300} alt="Cleit"></Image>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-gray-900 text-white border-gray-900 border -1 border-gray-900 rounded-md hover:cursor-pointer hover:bg-gray-700">
            Login
          </div>
          <div className="px-3 py-1 mr-3 rounded-md border-1 border-gray-300 hover:bg-zinc-100 hover:cursor-pointer">
            Register
          </div>
        </div>
      </div>
    </>
  );
}
