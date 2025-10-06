import React, { useEffect, useRef, useState } from "react";
import backArrow from "../../../public/imges/main/back-arrow.png";
import flag from "../../../public/imges/main/headerIndia.png";
import avter from "../../../public/imges/main/avter.jpeg";
import { useNavigate } from "react-router-dom";
import {
  Modal as NextUIModal,
  ModalContent,
} from "@nextui-org/react";


export default function Header({ pageName = "" }) {






  return (
    <>
      <section className=" flex  w-[100%] ">
        <div className=" w-[100%]  gap-[10px] flex items-center  justify-between px-[0px] border-b-[1.5px] pb-[25px] pt-[20px] bg h-[42px]">
          <div className=" flex  w-fit  cursor-pointer items-center gap-[5px]  ">
            <img
              className=" flex w-[27px] h-[27px]"
              src={backArrow}
              // onClick={handleBack}
            />
            <div className=" flex w-[4px] bg-[#ff8000] h-[30px]"></div>
            <h1
              className=" pl-[6px] text-[#3d3d3d] flex  font-Poppins text-[20px] font-[600]"
              // onClick={handleBack}
            >
              {pageName}
            </h1>


          </div>


  
        </div>
      </section>


    </>
  );
}