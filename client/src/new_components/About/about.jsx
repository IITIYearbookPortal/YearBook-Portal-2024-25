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
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Login using Sign-in with Google.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={img2}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
          
          </div>
        </div>
      ),
    },
    {
      title: "STEP 2",
      content: (
        <div>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Click on the icon at the top left to explore
          </p>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Click on "Search People" to search for your friends' profiles.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={img1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
            
          </div>
        </div>
      ),
    },
    {
      title: "STEP 3",
      content: (
        <div>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-4">
            Search for your friends using their names or roll no.
          </p>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            You can also filter your search by batch or department
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={img3}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
          
          </div>
        </div>
      ),
    },
    {
      title: "STEP 4",
      content: (
        <div>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Write comments on the profiles of your friends
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={img4}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
          </div>
        </div>
      ),
    },
    {
      title: "STEP 5",
      content: (
        <div>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-4">
            "YEARBOOK Awards"
          </p>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            Cast your vote for your favorite candidate in the polls section
          </p>
          <p
            className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
            and help them secure the title.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={img5}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]" />
          
          </div>
        </div>
      ),
    },
  ];
  return (
    (<div className="w-full overflow-hidden">
      <Timeline data={data} />
      <div className='w-full mt-8 px-[10vw] text-xl text-right text-gray-500 font-sans'>
        Still facing issues? Contact: <br />
        +91 6263106823<br />
        Keshvi<br />
        +91 8860271033<br />
        Anshuman
      </div>
    </div>)
  );
}





