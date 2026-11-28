import React from "react";
import { Headdata, Voldata, pastMembers } from "./data";

const TeamMemberCard = ({ member }) => {
  return (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-[3px] border-gray-700/80 hover:border-gray-500 shadow-xl group bg-[#111827] transition-colors">
      <img
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 w-full h-full"
        src={member.image}
        alt={member.name || "Team Member"}
      />
      <div className="absolute inset-0 px-4 py-3 text-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-[#111827]/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
        <p className="mb-1 text-base sm:text-lg font-bold text-white leading-tight break-words">
          {member.name}
        </p>
        <p className="mb-3 text-xs sm:text-sm text-gray-300 break-words">
          {member.role}
        </p>
        <div className="flex items-center justify-center space-x-3">
          {member.github_id && (
            <a
              href={member.github_id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="text-gray-200 hover:text-white transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 30 30" fill="currentColor">
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
              </svg>
            </a>
          )}
          {member.insta_id && (
            <a
              href={member.insta_id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Instagram`}
              className="text-gray-200 hover:text-white transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z" />
              </svg>
            </a>
          )}
          {member.linkedin_id && (
            <a
              href={member.linkedin_id}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="text-gray-200 hover:text-white transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 48 48" fill="currentColor">
                <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamSection = ({ title, members, titleClass = "text-2xl sm:text-3xl" }) => (
  <div className="flex flex-col justify-center items-center pb-14 pt-6">
    <h2 className={`text-emerald-400 text-center mb-8 font-bold tracking-wide ${titleClass}`}>
      {title}
    </h2>
    <div className="flex flex-wrap justify-center items-center w-full max-w-6xl mx-auto gap-8 sm:gap-10 px-4">
      {members.map((member, index) => (
        <TeamMemberCard key={member.name || index} member={member} />
      ))}
    </div>
  </div>
);

export const DevP = () => {
  return (
    <div className="bg-pagebg min-h-screen w-full text-white pb-8">
      <div className="max-w-3xl mx-auto pt-12 pb-6 px-4 text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Meet The Team
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
          Our Team has put in a lot of effort into making this website a
          tribute worthy of the legacy that our seniors leave for us. Here are
          the members who made it happen:
        </p>
      </div>

      <TeamSection title="HEAD" members={Headdata} titleClass="text-3xl sm:text-4xl" />
      <TeamSection title="Members" members={Voldata} />
      <TeamSection title="Past Contributors" members={pastMembers} />
    </div>
  );
};

export default DevP;
