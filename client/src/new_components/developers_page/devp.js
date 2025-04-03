import React from "react";
import { useState } from "react";
import { Headdata, Coredata, Voldata,pastMembers, responsive } from "./data";
import img from "./images/bgimg.jpg";
import img2 from "./images/lo.jpeg";

export const DevP = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div class="bg-[#222831]">
      <div>
        {/* <div class="pt-16 pb-4 pl-4 pr-4 mx-auto ml-auto mr-auto bg-top bg-cover max-w-7xl md:px-24 lg:px-12 lg:pt-20">
                <div class="mb-10 ml-auto mr-auto bg-top bg-cover max-w-7xl md:mx-auto sm:text-center lg:max-w-2xl md:mb-16">
                    <div class="flex justify-center items-center mb-6 ml-auto mr-auto tracking-tight text-gray-900 bg-top  bg-cover  max-w-7xl md:mx-auto">
                        <p class={`inline max-w-lg text-3xl font-bold leading-none tracking-tight sm:text-5xl md:mx-auto ${isDarkMode?'text-white':'text-black'}`}>Meet The Team</p>
                    </div>
                    <p class="text-darkgray-700 md:text-xl text-center">Our Team has put in a lot of effort into making this website a tribute worthy of the legacy that our seniors leave for us. Here are the members who made it happen:</p>
                </div>
                </div>
         */}
        <div>
          <div class="relative text-black min-h-48 w-full md:block m-auto md:40 ">
            <img
              class="object-cover w-full h-full transition-transform duration-500 ease-in-out transform "
              src={img}
              style={{ borderRadius: "0", width: "100%", height: "100%" }}
            />

            <div class="absolute inset-0 bg-black opacity-60"></div>

            <div
              class="absolute inset-0 flex flex-col items-center gap-6 text-white"
              style={{
                top: "10%",
                animation: "3s ease-out 0s 1 normal forwards running slideUp",
              }}
            >
              <img
                src={img2}
                alt="Logo"
                class="h-24 w-auto relative"
                style={{
                  borderRadius: "50%",
                  width: "10%",
                  height: "12%",
                }}
              />

              <p className="inline max-w-lg text-base font-bold sm:text-3xl md:text-5xl md:mx-auto text-center">
                Meet The Team
              </p>
              <p className="inline max-w-lg text-xs font-medium sm:text-lg md:text-xl md:mx-auto text-center mt-4">
                Our Team has put in a lot of effort into making this website a
                tribute worthy of the legacy that our seniors leave for us. Here
                are the members who made it happen:
              </p>

              <style>
                {`
      @keyframes slideUp {
        0% {
          transform: translateY(100%);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `}
              </style>
            </div>
          </div>
          <div class="flex flex-col justify-center items-center pb-12 mb-16 z-10 pt-10">
            <h1 className="flex text-[#76ABAE] justify-center items-center text-5xl mb-6 font-bold">
              HEAD
            </h1>

            {/* Head Data */}
            <div class="flex flex-row flex-wrap justify-center items-center w-full  px-1">
              {Headdata.map((val) => {
                return (
                  <div class="scale-125 border-[10px] border-[#76ABAE] rounded-full relative w-[340px] overflow-hidden  shadow-lg group bg-white m-8">
                    {/* <img class="object-cover w-full h-72 xl:h-80" src={val.image}  alt="Team Member Name"/> */}

                    <img
                      class="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110  w-full h-60 sm:h-56 md:h-64 lg:h-72 xl:h-80 transition-transform duration-500 ease-in-out transform hover:scale-130"
                      src={val.image}
                      alt="Team Member"
                    />

                    <div class="absolute inset-0  px-6 py-4 text-center duration-300 opacity-0 group-hover:opacity-100 ">
                      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-white opacity-60 to-gray-700 rounded-md "></div>
                      <div class="relative flex flex-col items-center justify-center w-full h-full ">
                        <p class="mb-1 text-xl font-bold text-black">
                          {val.name}
                        </p>
                        <p class="mb-4 text-lg text-black">{val.role}</p>
                        <div class="flex items-center justify-center space-x-3 bg-top bg-cover">
                          <a
                            href={val.github_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                            >
                              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                            </svg>
                          </a>

                          <a
                            href={val.insta_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                            >
                              <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                            </svg>
                          </a>

                          <a
                            href={val.linkedin_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 48 48"
                            >
                              <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div class="flex flex-col justify-center items-center pb-12 mb-16">
            <h1 className="flex text-[#76ABAE] justify-center items-center text-3xl mb-6 font-bold">
              Core Team
            </h1>
            <div class="flex flex-row flex-wrap justify-center items-center w-full  px-1">
              {Coredata.map((val) => {
                return (
                  <div class="scale-110 border-[10px] border-[#76ABAE] rounded-full relative w-[330px] sm:w-[300px] md:w-[330px] lg:w-[350px] overflow-hidden rounded-3xl shadow-lg group bg-white m-8">
                    <img
                      class="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110 w-full h-60 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                      src={val.image}
                      alt="Team Member Name"
                    />
                    <div class="absolute inset-0 px-6 py-4 text-center duration-300 opacity-0 group-hover:opacity-100">
                      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-white opacity-60 to-gray-700"></div>
                      <div class="relative flex flex-col items-center justify-center w-full h-full">
                        <p class="mb-1 text-xl font-bold text-black">
                          {val.name}
                        </p>
                        <p class="mb-4 text-lg text-black">{val.role}</p>
                        <div class="flex items-center justify-center space-x-3 bg-top bg-cover">
                          <a
                            href={val.github_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                            >
                              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                            </svg>
                          </a>
                          <a
                            href={val.insta_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                            >
                              <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                            </svg>
                          </a>

                          <a
                            href={val.linkedin_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 48 48"
                            >
                              <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div class="flex flex-col justify-center items-center pb-12">
            <h1 className="flex text-[#76ABAE] justify-center items-center text-3xl mb-6 font-bold">
              Members
            </h1>
            <div class="flex flex-row flex-wrap justify-center items-center w-full  px-1">
              {Voldata.map((val) => {
                return (
                  <div class="scale-95 border-[10px] border-[#76ABAE] rounded-full relative w-[250px] sm:w-[250px] md:w-[330px] lg:w-[350px] overflow-hidden shadow-lg group bg-white m-8">
                    <img
                      class="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110 w-full h-60 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                      src={val.image}
                      alt="Team Member Name"
                    />
                    <div class="absolute inset-0 px-6 py-4 text-center duration-300 opacity-0 group-hover:opacity-100">
                      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-white opacity-60 to-gray-700"></div>
                      <div class="relative flex flex-col items-center justify-center w-full h-full">
                        <p class="mb-1 text-xl font-bold text-black">
                          {val.name}
                        </p>
                        <p class="mb-4 text-lg text-black">{val.role}</p>
                        <div class="flex items-center justify-center space-x-3 bg-top bg-cover">
                          <a
                            href={val.github_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                            >
                              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                            </svg>
                          </a>
                          <a
                            href={val.insta_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                            >
                              <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                            </svg>
                          </a>

                          <a
                            href={val.linkedin_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 48 48"
                            >
                              <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div class="flex flex-col justify-center items-center pb-12">
            <h1 className="flex text-[#76ABAE] justify-center items-center text-3xl mb-6 font-bold">
              Past Contributors
            </h1>
            <div class="flex flex-row flex-wrap justify-center items-center w-full  px-1">
              {pastMembers.map((val) => {
                return (
                  <div class="scale-95 border-[10px] border-[#76ABAE] rounded-full relative w-[250px] sm:w-[250px] md:w-[330px] lg:w-[350px] overflow-hidden shadow-lg group bg-white m-8">
                    <img
                      class="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110 w-full h-60 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                      src={val.image}
                      alt="Team Member Name"
                    />
                    <div class="absolute inset-0 px-6 py-4 text-center duration-300 opacity-0 group-hover:opacity-100">
                      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-white opacity-60 to-gray-700"></div>
                      <div class="relative flex flex-col items-center justify-center w-full h-full">
                        <p class="mb-1 text-xl font-bold text-black">
                          {val.name}
                        </p>
                        <p class="mb-4 text-lg text-black">{val.role}</p>
                        <div class="flex items-center justify-center space-x-3 bg-top bg-cover">
                          <a
                            href={val.github_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                            >
                              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                            </svg>
                          </a>
                          <a
                            href={val.insta_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              color="black"
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                            >
                              <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                            </svg>
                          </a>

                          <a
                            href={val.linkedin_id}
                            target="_blank"
                            class="transition-colors duration-300 bg-top bg-cover cursor-pointer hover:text-white text-blue-50"
                          >
                            <svg
                              x="0px"
                              y="0px"
                              width="30"
                              height="30"
                              viewBox="0 0 48 48"
                            >
                              <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevP;
