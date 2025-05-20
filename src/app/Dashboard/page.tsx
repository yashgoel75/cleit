import logo from "../../../public/cleit.png";
import Image from "next/image";
function Dashboard() {
  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="Cleit" width={200} />
      </div>
      <div className="flex flex-col items-center w-90 m-auto border-2 border-gray-300 rounded-lg shadow-lg p-6 mt-20"></div>
    </div>
  );
}
export default Dashboard;
