import "../new_components/MakeComment2/makecomment.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PreviousYrBookSenior = ({ isDarkMode }) => {
    const { roll_no } = useParams();
    const [senior, setSenior] = useState(null);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/previousYrBook/getSenior/${roll_no}`)
            .then((res) => {
                setSenior(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching senior:", err);
            });
    }, [roll_no]);

    if (!senior) return <div className="text-white">Loading...</div>;

    const testimonials = senior.students_testimonial
        ? senior.students_testimonial.split("\n").filter(t => t.trim() !== "")
        : [];

    return (
        <div className="fadeInUp min-h-screen bg-[#1F2937]">

            <div className="flex justify-center pt-12">
                <div className="main2 flex justify-center flex-col w-[350px] bg-[#111827] rounded-2xl">
                    <div className="mx-auto mt-6">
                        {senior.profile_pic && (
                            <img
                                src={senior.profile_pic}
                                alt={senior.full_name}
                                className="bg-white rounded-full object-cover border-2 border-black"
                                style={{ width: "150px", height: "150px" }}
                            />
                        )}
                    </div>

                    <div
                        className={`info block p-4 mt-4 ${isDarkMode
                                ? "bg-gray-700 text-white border-white"
                                : "bg-[#1F2937] text-white border-black"
                            }`}
                    >
                        <div className="text-center">
                            <p>{senior.full_name}</p>
                            <p>{senior.roll_no}</p>
                            <p>{senior.department}</p>
                            <p>{senior.about}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS SECTION */}
            <div className="mt-16 px-8">
                <h2 className="text-4xl font-semibold text-white text-center mb-10">
                    Student Testimonials
                </h2>

                <div className="testimonial-grid">
                    {testimonials.map((text, index) => {
                        const [body, author] = text.split("~");

                        return (
                            <div
                                key={index}
                                className={`info2 testimonial-card ${isDarkMode
                                        ? "bg-gray-700 text-white border-white"
                                        : "bg-[#111827] text-white border-black"
                                    }`}
                            >
                                <p className="cmt whitespace-pre-wrap">
                                    {body?.trim()}
                                </p>

                                {author && (
                                    <span className="testimonial-author">
                                        ~ {author.trim()}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="text-gray-400 text-center mt-6">
                    Total testimonials: {senior.testimonial_count}
                </p>
            </div>
        </div>
    );
};

export default PreviousYrBookSenior;
