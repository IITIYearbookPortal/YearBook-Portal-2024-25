import "../new_components/MakeComment2/makecomment.css";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../helpers/Context";
import Avatar from "../components/Avatar";
import CommentGrid from "../components/CommentGrid";

const parseTestimonial = (text, index) => {
    const sepIdx = text.lastIndexOf("~");
    if (sepIdx === -1) {
        return { id: index, message: text.trim(), author: "" };
    }
    return {
        id: index,
        message: text.slice(0, sepIdx).trim(),
        author: text.slice(sepIdx + 1).trim(),
    };
};

const PreviousYrBookSenior = ({ isDarkMode }) => {
    const { roll_no } = useParams();
    const { user, loggedin, verified } = useContext(LoginContext);
    const [senior, setSenior] = useState(null);

    useEffect(() => {
        if (!loggedin || (user?.alumni && !verified)) return;
        axios
            .get(`${process.env.REACT_APP_API_URL}/previousYrBook/getSenior/${roll_no}`)
            .then((res) => {
                setSenior(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching senior:", err);
            });
    }, [roll_no, loggedin, user?.alumni, verified]);

    if (!senior) {
        return (
            <div className="min-h-screen bg-pagebg flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    const testimonials = senior.students_testimonial
        ? senior.students_testimonial
              .split("\n")
              .filter((t) => t.trim() !== "")
              .map(parseTestimonial)
        : [];

    return (
        <div className="fadeInUp min-h-screen w-full bg-pagebg text-white overflow-x-hidden py-8 sm:py-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="w-full max-w-2xl mx-auto bg-[#111827] rounded-2xl flex flex-col items-center pb-6 shadow-xl">
                    <div className="mx-auto pt-6 pb-2">
                        <Avatar
                            src={senior.profile_pic}
                            alt={senior.full_name}
                            className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-full border-2 border-black m-2"
                        />
                    </div>

                    <div
                        className={`w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] mx-4 sm:mx-6 mt-3 px-5 py-4 rounded-[14px] shadow-[2px_2px_4px_#49474a] break-words ${isDarkMode
                                ? "bg-gray-700 text-white border-2 border-white"
                                : "bg-pagebg text-white border-2 border-black"
                            }`}
                    >
                        <div className="text-center space-y-2 text-sm sm:text-base">
                            <p className="font-yearbook-fun text-2xl sm:text-3xl text-white break-words">
                                {senior.full_name}
                            </p>
                            <p className="text-gray-300 break-words">{senior.roll_no}</p>
                            <p className="text-gray-300 break-words">{senior.department}</p>
                            <p className="break-words whitespace-pre-line leading-relaxed pt-1">
                                {senior.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <CommentGrid
                title="Student Testimonials"
                items={testimonials}
                emptyText="No student testimonials yet."
                isDarkMode={isDarkMode}
                footer={
                    <p className="text-gray-400 text-center text-sm sm:text-base mt-8">
                        Total testimonials: {senior.testimonial_count}
                    </p>
                }
            />
        </div>
    );
};

export default PreviousYrBookSenior;
