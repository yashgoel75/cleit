import logo from "../../../public/cleit.png";
import Image from "next/image";
import "./page.css";
function Dashboard() {
  return (
    <div>
      <div className="flex flex-col items-center mt-10">
        <Image src={logo} alt="Cleit" width={200} />
      </div>
      <div className="flex flex-col items-center w-5/6 h-3/5 m-auto border-1 border-gray-300 rounded-lg p-6 mt-20">
        <div className="text-2xl font-bold mb-4">
          Convert from ETH to any other token/currency
        </div>
        <div className="flex flex-col">ETH</div>
        <input className="w-97/100 border-1 border-gray-400 rounded-md p-1"></input>
        <br></br>
        <div className="flex flex-col">ETH</div>
        <input type="option" className="w-97/100 border-1 border-gray-400 rounded-md p-1"></input>
        <div className="convert-button">
        Convert
      </div>
      </div>
    </div>
  );
}
export default Dashboard;
