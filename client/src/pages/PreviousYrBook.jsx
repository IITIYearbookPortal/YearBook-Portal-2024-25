import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../helpers/Context";
import axios from "axios";
import "../new_components/UserList.module.css";

const PreviousYrBook = () => {
  const { isStudent, loggedin, profile, loading, setResult } =
    useContext(LoginContext);

  const navigate = useNavigate();

  // Previous Yearbook list
  const [previousUsers, setPreviousUsers] = useState([]);

  // Login protection
  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }
  }, [loading, loggedin]);

  // Fetch previous yearbook users
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/previousYrBook/getSeniors")
      .then((res) => {
        // Store only the seniors array
        console.log(res.data.data);
        setPreviousUsers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch previous yearbook:", err);
      });
  }, []);

  // Filters
  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");

  const filterUsers = () => {
    return previousUsers.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.department.toLowerCase().includes(selectedDepartment.toLowerCase()) &&
        user.roll_no
    );
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filtered = filterUsers();
  const currentUsers =
    searchName || selectedDepartment || searchRollNo
      ? filtered.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
      : previousUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const totalFilteredPages = Math.ceil(
    (searchName || selectedDepartment || searchRollNo
      ? filtered.length
      : previousUsers.length) / usersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, selectedDepartment, searchRollNo]);

  const departments = [
    "Astronomy, Astrophysics and Space Engineering",
    "Biosciences and Biomedical Engineering",
    "Chemistry",
    "Civil Engineering",
    "Computer Science and Engineering",
    "Electrical Engineering",
    "Electric Vehicle Technology",
    "Humanities and Social Sciences",
    "Mathematics",
    "Mechanical Engineering",
    "Metallurgy Engineering and Materials Science",
    "Physics",
    "MS-DSM",
  ];

  return (
    <div className="p-16 min-h-screen">
      {/* SEARCH SECTION */}
      <div className="flex flex-col lg:flex-row mb-4 font-custom">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 mb-4 lg:mr-4 lg:mb-0 w-full border rounded-md search-input bg-[#31363F] text-white placeholder-[#EEEEEE] hover:bg-[#222831]"
        />

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 mb-4 lg:mr-4 lg:mb-0 w-full border rounded-md bg-[#EEEEEE] hover:bg-[#222831] hover:text-white"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by roll number"
          value={searchRollNo}
          onChange={(e) => setSearchRollNo(e.target.value)}
          className="p-2 w-full border rounded-md bg-[#31363F] text-white placeholder-[#EEEEEE] hover:bg-[#222831]"
        />
      </div>

      {/* TABLE */}
      <table className="w-full table-auto bg-[#212121] font-custom border-collapse">
        <thead>
          <tr>
            <th className="w-1/3 border-4 p-2 text-[#76ABAE] font-bold">Name</th>
            <th className="w-1/3 border-4 p-2 text-[#76ABAE] font-bold">
              Department
            </th>
            <th className="w-1/3 border-4 p-2 text-[#76ABAE] font-bold">
              Roll No
            </th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.roll_no}
              className="bg-slate-950 hover:bg-[#222831] text-[#EEEEEE] cursor-pointer"
              onClick={() => {
                window.localStorage.removeItem("searchedAlumni");

                axios
                  .post(process.env.REACT_APP_API_URL + "/searchword", {
                    searchword: user.email, // original logic
                  })
                  .then((res) => {
                    setResult(res.data);
                    window.localStorage.setItem(
                      "searchedAlumni",
                      JSON.stringify(res.data)
                    );
                  });

                const isCurrentUser = !isStudent
                  ? user.email === profile.email
                  : false;

                const link = isCurrentUser
                  ? `/profile/${profile.roll_no}/${profile.name}`
                  : `/previous-yrBook/getSenior/${user.roll_no}`;

                navigate(link);
              }}
            >
              <td className="border-4 p-4 bg-[#222831]">{user.full_name}</td>
              <td className="border-4 p-4 bg-[#222831] text-center">
                {user.department}
              </td>
              <td className="border-4 p-4 bg-[#222831] text-center">
                {user.roll_no}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`p-2 bg-gray-800 text-white rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"
            }`}
        >
          &lt;
        </button>

        <span className="mx-4 text-gray-400">
          Page {currentPage} of {totalFilteredPages}
        </span>

        <button
          disabled={currentPage === totalFilteredPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`p-2 bg-gray-800 text-white rounded ${currentPage === totalFilteredPages && "opacity-50 cursor-not-allowed"
            }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PreviousYrBook;
