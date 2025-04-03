import React from 'react';
import { Timeline } from "./timeline";
import img1 from './Navbar.png';
import img2 from './Login.png';
import img3 from './Login2.png';
import img4 from './Login3.png';
import img5 from './poll.jpg';

export default function About() {
  const data = [
    {
      title: "STEP 1",
      content: (
        <div>
          <p className="text-gray-200 text-sm md:text-lg font-normal mb-4">
            Login using Sign-in with Google.
          </p>
          <div className="flex justify-center">
            <img src={img2} alt="Login with Google" className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg" />
          </div>
        </div>
      ),
    },
    {
      title: "STEP 2",
      content: (
        <div>

          <p className="text-neutral-200 text-sm md:text-lg font-normal mb-4">
            Click on the icon at the top left to explore various options.

          </p>
          <div className="flex justify-center">
            <img src={img1} alt="Navigation menu" className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg" />
          </div>
        </div>
      ),
    },
    {
      title: "STEP 3",
      content: (
        <div>

          <p
            className="text-neutral-200 text-sm md:text-lg font-normal mb-4">
            Search for your friends using their names or roll no.
          </p>
          <p
            className="text-neutral-200 text-sm md:text-lg font-normal mb-8">
            You can also filter your search by department

          </p>
          <div className="flex justify-center">
            <img src={img3} alt="Search functionality" className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg" />
          </div>
        </div>
      ),
    },
    {
      title: "STEP 4",
      content: (
        <div>
          <p className="text-gray-200 text-sm md:text-lg font-normal mb-4">
            Write comments on the profiles of your friends.
          </p>
          <div className="flex justify-center">
            <img src={img4} alt="Profile comments" className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg" />
          </div>
        </div>
      ),
    },
    {
      title: "STEP 5",
      content: (
        <div>
          <p className="text-gray-200 text-sm md:text-lg font-semibold mb-4">
            "YEARBOOK Awards"
          </p>

          <p
            className="text-neutral-200 text-sm md:text-lg font-normal mb-4">
            Cast your vote for your favorite candidate in the polls section
          </p>
          <p
            className="text-neutral-200 text-sm md:text-lg font-normal mb-4">
            and help them secure the title.

          </p>
          <div className="flex justify-center">
            <img src={img5} alt="Yearbook awards" className="rounded-lg object-cover w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Timeline data={data} />

      <div className="mt-8 px-4 sm:px-6 md:px-8 lg:px-[10vw] text-sm md:text-lg text-right text-gray-500">
        <p className="font-medium mb-2">Still facing issues? Contact:</p>
        <div className="space-y-2">
          <div>
            <p className="font-semibold">Keshvi</p>
            <p>+91 6263106823</p>
          </div>
          <div>
            <p className="font-semibold">Anshuman</p>
            <p>+91 8860271033</p>
          </div>
        </div>

      </div>
    </div>
  );
}