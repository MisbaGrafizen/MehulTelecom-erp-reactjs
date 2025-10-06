
import React, { useState } from "react";
import arrow from "../../../public/imges/arrow.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState("login");
  const navigate = useNavigate();
  
  const handleCreateAccount =()=>{
    navigate("/create-account")
  }

  const handleNextStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <>
      <section className="flex w-[100%]">
        <div className="flex w-[100%] justify-center items-center h-[100vh] bg-white">
          {currentStep === "login" && (
            <div className="flex flex-col mx-auto max-w-[430px] justify-between h-[550px] min-w-[430px] rounded-[10px] items-center">
              <div className="flex w-[100%] border-[1px] p-[20px] border-[#122f97] flex-col h-[470px] rounded-[10px]">
                <h1 className="flex justify-center mt-[5px] text-[40px] w-fit mx-auto jersey-25-regular ">
                  LOGIN
                </h1>
                <div className="mt-[30px] flex w-[100%]">
                  <div className="flex flex-col gap-[60px] w-[100%]">
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="text"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="jersey-25-regular  text-[1px]" style={{}}>Name</span>
                      </div>
                    </div>
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="password"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">Password</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <label className="flex cursor-pointer items-center gap-[10px]">
                        <input
                          type="radio"
                          className="w-5 h-5 accent-[#009dd1]"
                        />
                        <h2 className="flex text-[20px] font-Jersy">
                          Remember me
                        </h2>
                      </label>
                    </div>
                    <div
                      className="flex font-Jersy text-[14px] underline font-[100] cursor-pointer"
                      onClick={() => handleNextStep("register")}
                    >
                      Register Now
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[100%]">
                <button className="flex w-[100%] font-Jersy bg-[#009dd1]  items-center  gap-[8px] font-[500] text-white justify-center rounded-[10px] py-[10px] text-[26px]" onClick={handleCreateAccount}>
                  Go AHEAD
                  <i className="text-white fa-regular fa-arrow-up-to-arc fa-rotate-90"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === "register" && (
            <div className="flex flex-col mx-auto max-w-[430px] justify-between h-[550px] min-w-[430px] rounded-[10px] items-center">
              <div className="flex w-[100%] border-[1px] p-[20px] border-[#122f97] flex-col h-[470px] rounded-[10px]">
                <h1 className="flex justify-center mt-[5px] text-[40px] w-fit mx-auto font-Jersy font-[500]">
                  REGISTER NOW
                </h1>
                <div className="mt-[30px] flex w-[100%]">
                  <div className="flex flex-col gap-[60px] w-[100%]">
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="text"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">Name</span>
                      </div>
                    </div>
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="email"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">E-mail</span>
                      </div>
                    </div>
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="text"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">
                          Phone number
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[100%]">
                <button
                  className="flex w-[100%] font-Jersy bg-[#009dd1]  items-center  gap-[8px] font-[500] text-white justify-center rounded-[10px] py-[10px] text-[26px]"
                  onClick={() => handleNextStep("verification")}
                >
                  GO AHEAD
                  <i className="text-white fa-regular fa-arrow-up-to-arc fa-rotate-90"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === "verification" && (
            <div className="flex flex-col mx-auto max-w-[430px] justify-between h-[550px] min-w-[430px] rounded-[10px] items-center">
              <div className="flex w-[100%] border-[1px] p-[20px] border-[#122f97] flex-col h-[470px] rounded-[10px]">
                <h1 className="flex justify-center mt-[5px] text-[40px] w-fit mx-auto font-Jersy font-[500]">
             VERIFICATION
                </h1>
                <h1 className="flex justify-center text-[#a2a2a2] text-[40px] w-fit mx-auto font-Jersy font-[500]">
                OTP
                </h1>
                <div className="mt-[15px] flex w-[100%]">
                  <div className="flex flex-col gap-[60px] w-[100%]">
                    <div className="w-[100%] flex justify-between">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex w-[50px] border-b-[1px] border-[#122f97] pb-[8px]"
                          >
                            <input
                              className="flex justify-center h-[100%] text-[19px] w-[100%] outline-none text-center"
                              type="number"
                            />
                          </div>
                        ))}
                    </div>
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="password"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">
                          Create Password
                        </span>
                      </div>
                    </div>
                    <div className="w-[100%]">
                      <div className="input-box1">
                        <input
                          type="password"
                          className="font-Roboto h-[40px] pl-[10px] rounded-[0px]"
                          required
                        />
                        <span className="font-Jersy text-[1px]">
                          Confirm Password
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[100%]">
                <button className="flex w-[100%] font-Jersy bg-[#009dd1]  items-center  gap-[8px] font-[500] text-white justify-center rounded-[10px] py-[10px] text-[26px]" onClick={handleCreateAccount}>
          GO AHEAD
                  <i className="text-white fa-regular fa-arrow-up-to-arc fa-rotate-90"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
