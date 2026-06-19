import { useState } from "react";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

import Chart1 from "./Charts/Chart1";
import Chart2 from "./Charts/Chart2";
import Chart3 from "./Charts/Chart3";
import Chart4 from "./Charts/Chart4";
import Chart5 from "./Charts/Chart5";
import Chart6 from "./Charts/Chart6";
import Chart7 from "./Charts/Chart7";
import Chart8 from "./Charts/Chart8";
import Chart9 from "./Charts/Chart9";
import EmployeeAdvance from "./EmployeeAdvance";

export default function Dashboard({ setIsAuth }) {

  return (
     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
          <SideNav />
    
           <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <TopBar setIsAuth={setIsAuth} />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Chart4 />
          <Chart1 />
          <Chart2 /> 

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">        
         
          <Chart9 />
          <Chart8 />
          <Chart6 />
          
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Chart5 />
          <Chart7 />
          <Chart3 />
        </div>
        {/* Charts */}

        <EmployeeAdvance/>



      </div>
    </div>
  );
}