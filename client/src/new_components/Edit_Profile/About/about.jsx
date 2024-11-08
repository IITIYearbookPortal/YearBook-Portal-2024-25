import { DiscFull } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";

const About = () => {
    return (  
  

            <div className=" min-h-screen p-10">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">
                  Connecting With Your Friends Has Never Been More Easy Before!
                </h1>
                
                <div className="flex flex-row justify-between items-start">
                  {/* Step instructions container */}
                  <div className="flex flex-col items-start w-1/2">
                    <div className="flex items-center mb-4">
                     
                      <h2 className="text-2xl font-semibold">
                        STEP 1
                      </h2>
                    </div>
                    <p>
                      Log in using your institute ID, and upon the first login, you will be asked to complete your information details. Following this, you will have created your profile for the Yearbook!
                    </p>
                  </div>
        
                  {/* Image container */}
                  <div className="w-1/2 flex justify-center">
                    <div className=" p-4 rounded-lg shadow-lg">
                      {/* Placeholder for image/screenshot */}
                      <div className=" p-20 rounded-lg">
                <img src=""></img>
            
                      </div>
                      <p className="text-sm text-center mt-2">
                       
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
        


    );
}
 
export default About;