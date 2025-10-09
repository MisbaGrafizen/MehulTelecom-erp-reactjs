import React, { useState, useEffect } from "react";
import Header from "../../Component/header/Header";
import SideBar from "../../Component/sidebar/SideBar";
import { ApiGet } from "../../helper/axios"; // ✅ Import your GET helper

export default function CompanyListing() {
  const [activeTab, setActiveTab] = useState(true); // ✅ true = Company tab
  const [companies, setCompanies] = useState([]); // ✅ store API data
  const [loading, setLoading] = useState(false);

  // ✅ Fetch company data from API
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await ApiGet("/admin/info"); 
      console.log("Company Data:", res);

      if (res?.data?.success && Array.isArray(res.data.data)) {
        setCompanies(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setCompanies(res.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch once when Company tab is active
  useEffect(() => {
    if (activeTab) {
      fetchCompanyData();
    }
  }, [activeTab]);

  // ✅ Tab Handlers
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
                  className={`absolute top-0 left-0 h-full w-[130px] rounded-[8px] transition-transform duration-300 ${
                    activeTab
                      ? "translate-x-0 bg-[#28c723]"
                      : "bg-[#ff8000] translate-x-[120px]"
                  }`}
                ></div>
                <button
                  onClick={handleCompanyClick}
                  className={`flex w-[130px] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] ${
                    activeTab ? "text-[#fff]" : "text-[#000]"
                  }`}
                >
                  Company&apos;s
                </button>
                <button
                  onClick={handleBranchClick}
                  className={`flex w-[110px] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] ${
                    activeTab ? "text-[#000]" : "text-[#fff]"
                  }`}
                >
                  Branches
                </button>
              </div>

              {activeTab ? (
                <>
                  <div className="bg-white w-[100%] rounded-[10px] overflow-hidden shadow1-blue flex-shrink-0 p-[20px]">
                    {loading ? (
                      <p className="font-Poppins text-gray-500">
                        Loading companies...
                      </p>
                    ) : companies.length === 0 ? (
                      <p className="font-Poppins text-gray-500">
                        No companies found.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse font-Poppins">
                          <thead>
                            <tr className="bg-[#f5f7ff] text-[#122f97] text-left">
                              <th className="p-3 border-b">Firm Name</th>
                              <th className="p-3 border-b">Firm Type</th>
                              <th className="p-3 border-b">City</th>
                              <th className="p-3 border-b">State</th>
                              <th className="p-3 border-b">GST Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies.map((company, index) => (
                              <tr
                                key={index}
                                className="hover:bg-[#f7faff] border-b text-gray-700"
                              >
                                <td className="p-3">
                                  {company?.firmName || "-"}
                                </td>
                                <td className="p-3">
                                  {company?.firmType || "-"}
                                </td>
                                <td className="p-3">{company?.city || "-"}</td>
                                <td className="p-3">{company?.state || "-"}</td>
                                <td className="p-3">
                                  {company?.gstNumber || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white w-[100%] rounded-[10px] overflow-hidden shadow1-blue flex-shrink-0 p-[20px]">
                    <p className="font-Poppins text-gray-500">
                      Not Found Company
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
