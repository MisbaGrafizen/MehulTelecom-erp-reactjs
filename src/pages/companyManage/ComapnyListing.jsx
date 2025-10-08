import React, { useState } from 'react'
import Header from '../../Component/header/Header'
import SideBar from '../../Component/sidebar/SideBar'

export default function ComapnyListing() {
        const [activeTab, setActiveTab] = useState("day");




    const handleCompanyClick = () => {
        setActiveTab(true);
    };

    const handleBranchClick = () => {
        setActiveTab(false);
    };

  return (
<>

 <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName="Day Book" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex flex-col w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">
                    
              

                                    <div className="relative flex shadow1-blue rounded-[10px] border-[#122f97] w-fit p-1 bg-gray-200">
                                        <div
                                            className={`absolute top-0 left-0 h-full w-[130px]  rounded-[8px] transition-transform duration-300 ${activeTab ? "translate-x-0 bg-[#28c723]  " : "  bg-[#ff8000] translate-x-[120px]"
                                                }`}
                                        ></div>
                                        <button
                                            onClick={handleCompanyClick}
                                            className={`flex w-[130px] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] text-${activeTab ? "[#fff]" : "[#000]"
                                                }`}
                                        >
                         Company's

                                        </button>
                                        <button
                                            onClick={handleBranchClick}
                                            className={`flex w-[110px] pl-[] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] text-${activeTab ? "[#000]" : "[#fff]"
                                                }`}
                                        >
                                          Branches
                                        </button>
                                    </div>
                                    {activeTab ? (
                                        <>

                                            <div
                                                className="    bg-white w-[100%] rounded-[10px] overflow-hidden shadow1-blue flex-shrink-0">
                                       
                                            </div>
                                        </>

                                    ) : (
                                        <>
                                            <div
                                                className="    bg-white w-[100%] rounded-[10px] overflow-hidden shadow1-blue flex-shrink-0">
                                
                                            </div>

                                        </>
                                    )}

                               
                 
                        </div>

                    </div>
                </div>
            </section>






</>
  )
}
