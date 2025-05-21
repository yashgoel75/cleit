import logo from "../../../public/cleit.png";
import Image from "next/image";
function Dashboard() {
  return (
    <div>
      <div className="flex flex-col items-center mt-5">
        <Image src={logo} alt="Cleit" width={200} />
      </div>
      <div className="flex flex-col items-center w-5/6 h-3/5 m-auto border-1 border-gray-300 rounded-lg p-6 mt-20">
        Convert from ETH to any other token/currency
      </div>
    </div>
  );
}
export default Dashboard;
