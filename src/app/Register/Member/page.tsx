"use client";

export default function Member() {
  return (
    <>
      <div className="w-98/100 md:w-1/2 m-auto">
        <div className="border-1 px-3 border-gray-400 rounded-md mb-5">
          <div className="flex justify-center text-lg font-bold mt-2">
            Member's Registration
          </div>
          <div className="py-5">
            <form>
              <div className="flex flex-col mb-2 py">
                <label>Name</label>
                <input
                  className="border-1 px-3 rounded p-[2px]"
                  placeholder="Enter your name"
                ></input>
              </div>
              <div className="flex flex-col mb-2 py">
                <label>Username</label>
                <div className="border-1 rounded pr-[2px]">
                  <button className="w-[5%] px-2 text-lg">@</button>
                  <input
                    className="px-3 rounded w-[70%]"
                    placeholder=""
                  ></input>
                  <button className="w-[25%] px-3 rounded bg-gray-900 text-white my-[2px] hover:cursor-pointer hover:bg-gray-800">
                    Check Availability
                  </button>
                </div>
              </div>
              <div className="flex flex-col mb-2 py">
                <label>Email</label>
                <div className="border-1 rounded pr-[2px]">
                  <input
                    className="px-3 rounded w-[80%]"
                    placeholder="name@example.com"
                  ></input>
                  <button className="w-[20%] px-3 rounded bg-gray-900 text-white my-[2px] hover:cursor-pointer hover:bg-gray-800">
                    Send OTP
                  </button>
                </div>
              </div>
              <div className="flex flex-col mb-2 py">
                <label>Enter OTP</label>
                <div className="border-1 rounded pr-[2px]">
                  <input
                    className="px-3 rounded w-[80%]"
                    placeholder="123456"
                  ></input>
                  <button className="w-[20%] px-3 rounded bg-gray-900 text-white my-[2px] hover:cursor-pointer hover:bg-gray-800">
                    Verify OTP
                  </button>
                </div>
              </div>
              <div className="flex flex-col mb-2">
                <label>Mobile</label>
                <input
                  className="border-1 px-3 rounded py-[2px]"
                  placeholder="9876543210"
                ></input>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-col mb-2 w-[300px]">
                  <label>Start Year</label>
                  <input
                    className="border-1 px-3 rounded py-[2px]"
                    placeholder="2023"
                  ></input>
                </div>
                <div className="flex flex-col mb-2">
                  <label></label>
                  <br></br>
                  <label>-</label>
                </div>
                <div className="flex flex-col mb-2 w-[300px]">
                  <label>End Year</label>
                  <input
                    className="border-1 px-3 rounded py-[2px]"
                    placeholder="2027"
                  ></input>
                </div>
              </div>
              <div className="flex flex-col mb-2 py">
                <label>Department & Branch</label>
                <select className="border-1 rounded">
                  <option>BALLB (H)</option>
                  <option>BBALLB (H)</option>
                  <option>LL.M (CL)</option>
                  <option>LL.M (ADR)</option>
                  <option>BBA - 1st Shift</option>
                  <option>BBA - 2nd Shift</option>
                  <option>B.Com (H)- 1st shift</option>
                  <option>B.Com (H)- 2nd shift</option>
                  <option>BA(JMC)- 1st shift</option>
                  <option>BA(JMC)- 2nd shift</option>
                  <option>MAMC</option>
                  <option>BCA- 1st shift</option>
                  <option>BCA- 2nd shift</option>
                  <option>MCA</option>
                  <option>BA ECO (H)- 1st shift</option>
                  <option>BA ECO (H)- 2nd shift</option>
                  <option>MA (ECONOMICS)</option>
                  <option>BA ENGLISH (H)</option>
                  <option>MA (ENGLISH)</option>
                  <option>B.Tech CSE</option>
                  <option>B.Tech AI&ML</option>
                  <option>B.Tech AI&DS</option>
                  <option>B.Tech IIOT</option>
                  <option>B.Tech EE (VLSI Design & Technology)</option>
                  <option>B.Tech CSE (Cyber Security)</option>
                  <option>B.Tech CS(Applied Mathematics)</option>
                  <option>B.Tech (LE)- Diploma Holders</option>
                  <option>B.Tech (LE)- Bsc. Grdautaes</option>
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-gray-900 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
