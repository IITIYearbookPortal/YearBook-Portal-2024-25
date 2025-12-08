import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PreviousYrBookSenior = () => {
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

  if (!senior) return <div>Loading...</div>;

  return (
    <div>
      <h1>{senior.full_name}</h1>

      {senior.profile_pic && (
        <img 
          src={senior.profile_pic} 
          alt={senior.full_name} 
        />
      )}

      <p>Roll No: {senior.roll_no}</p>
      <p>Department: {senior.department}</p>

      <p>About: {senior.about}</p>

      <div>
        <p>Student Testimonials:</p>
        <p>{senior.students_testimonial}</p>
      </div>

      <p>Total testimonials: {senior.testimonial_count}</p>
    </div>
  );
};

export default PreviousYrBookSenior;
