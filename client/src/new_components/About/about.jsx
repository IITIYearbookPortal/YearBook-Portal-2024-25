import React from 'react';
import img1 from './Navbar.png';
import img2 from './Login.png';
import img3 from './Login2.png';
import img4 from './Login3.png';

const About = () => {
  return (
    <div className='flex flex-col  items-center justify-center text-base md:text-3xl'>
      <div className='w-full text-center text-5xl capitalize mt-4 underline'>About</div>
      <div className='w-full mt-8 px-[10vw] text-2xl text-gray-500 font-sans'>This is a website where you can create your profile that will be shown on the Yearbook'24, comment on your friends, choose which comments you wish to show on your handle in the yearbook, and much more! Feeling lost? Here's what you can do:</div>
      <div className='flex flex-col gap-y-4 md:flex-row items-stretch justify-between w-full px-[20vw] mt-2 md:mt-10 text-base md:text-3xl'>
        <h4 className='mb-2'>STEP 1 :<br />
          <span className='font-sans text-2xl text-gray-500'>Login using Sign-in with Google</span></h4>
        <img src={img2} alt="" className='w-full md:w-72 md:ml-[380px] h-48 md:h-56 object-cover rounded-lg mb-2' />
      </div>
      <div className='flex flex-col gap-y-4  md:flex-row items-stretch justify-between w-full px-[20vw] mb-[20px]  md:mt-10 text-base md:text-3xl'>

        <h4 className='mb-2'>STEP 2 :<br />
          <span className='font-sans text-2xl text-gray-500'>Click on the icon at the top left to explore various. <br /> Click on "Search People" to search for your friends' profiles.</span></h4>
        <img src={img1} alt="" className='w-full mt-[20px] md:w-72 md:ml-20 h-48 md:h-56 object-cover rounded-lg mb-2' />
      </div>
      <div className='flex flex-col gap-y-4 md:flex-row items-stretch justify-between w-full px-[20vw] mt-[20px] md:mt-10 text-base md:text-3xl'>
        <h4 className='mb-2'>STEP 3 :<br />
          <span className='font-sans text-2xl text-gray-500'>Search for your friends using their names or institute . <br /> You can also filter your search by batch or department</span>
        </h4>
        <img src={img3} alt="" className='w-full md:w-72  md:ml-20 h-48 md:h-56 object-cover rounded-lg mb-2' />
      </div>
      <div className='flex flex-col gap-y-4 md:flex-row items-stretch justify-between w-full px-[20vw] mt-2 md:mt-10 text-base md:text-3xl'>

        <h4 className='mb-2'>STEP 4 :<br />
          <span className='font-sans text-2xl text-gray-500'>Write comments on the profiles of your friends</span>
        </h4>
        <img src={img4} alt="" className='w-full md:w-72 md:ml-[160px] h-48  md:h-56 object-cover rounded-lg mb-2' />
      </div>
      <div className='w-full mt-8 px-[10vw] text-xl text-right text-gray-500 font-sans'>
        Still facing issues? Contact: <br />
        +91 99677 21357<br />
        Varad Pendse<br />
        +91 83919 73739<br />
        Ansh Kyal
      </div>

    </div>
  );
};

export default About;





