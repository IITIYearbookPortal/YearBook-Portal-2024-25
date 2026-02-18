import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../helpers/Context";
import alumniData from "./Navbar/akumniData.json";
import axios from "axios";
import "./UserList.module.css"; // Import your CSS file for styling

const UserList = () => {
  const { allUsers, isStudent, setIsStudent, loggedin, profile, loading } =
    useContext(LoginContext); // Access allUsers directly from context

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }
  });
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const { result, setResult } = useContext(LoginContext);

  // const location = useLocation();

  // const allUsers = location.state ? location.state.allUsers : [];

  // const navigate = useNavigate();

  // const loadingSpinner2 = () => {
  //   setLoading(true);
  //   const Load = async () => {
  //     await new Promise((r) => setTimeout(r, 800));
  //     setLoading((loading) => !loading);
  //   };

  //   Load();
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filterUsers = () => {
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.department
          .toLowerCase()
          .includes(selectedDepartment.toLowerCase()) &&
        user.roll_no.toLowerCase().includes(searchRollNo.toLowerCase())
    );
  };

  const totalFilteredUsers = filterUsers().length;
  const totalUsers = allUsers.length;

  const currentUsers =
    searchName || selectedDepartment || searchRollNo
      ? filterUsers().slice(
          (currentPage - 1) * usersPerPage,
          currentPage * usersPerPage
        )
      : allUsers.slice(
          (currentPage - 1) * usersPerPage,
          currentPage * usersPerPage
        );

  const totalFilteredPages = Math.ceil(
    searchName || selectedDepartment || searchRollNo
      ? totalFilteredUsers / usersPerPage
      : totalUsers / usersPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage((prevPage) =>
      Math.max(1, Math.min(newPage, totalFilteredPages))
    );
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page whenever a new filter is applied
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

  return (<>
    <div className="p-16  min-h-screen ">
      <div className="flex flex-col lg:flex-row mb-4 lg:mb-8 font-custom">
        <div className="mb-4 lg:mb-0 lg:mr-4 lg:w-full">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="p-2 border w-full rounded-md search-input hover:bg-[#222831] bg-[#31363F] placeholder-[#EEEEEE] text-white "
          />
        </div>
        <div className="mb-4 lg:mb-0 lg:mr-4 lg:w-full">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border w-full rounded-md bg-[#EEEEEE] hover:bg-[#222831] hover:text-white"
            style={{ backgroundColor: "EEEEEE" }}
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:w-full">
          <input
            type="text"
            placeholder="Search by roll number"
            value={searchRollNo}
            onChange={(e) => setSearchRollNo(e.target.value)}
            className="p-2 border w-full rounded-md appearance-none search-input hover:bg-[#222831] bg-[#31363F] text-white placeholder-[#EEEEEE]"
          />
        </div>
      </div>
              
    <div className="overflow-x-auto">
      <table className="w-full lg:w-full table-auto  border-collapse font-custom bg-[#212121]">
        <thead>
          <tr>
            <th className="w-1/3 border-4 p-2 text-center font-bold text-[#76ABAE]">
              Name
            </th>
            <th className="w-1/3 border-4 p-2 text-center font-bold text-[#76ABAE]">
              Department
            </th>
            <th className="w-1/3 border-4 p-2 text-center font-bold text-[#76ABAE]">
              Roll No
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr
              key={user.id}
              className="bg-slate-950 hover:bg-[#222831] transition-all cursor-pointer text-[#EEEEEE]"
              onClick={(e) => {
                e.preventDefault();
                window.localStorage.removeItem("searchedAlumni");
                axios
                  .post(process.env.REACT_APP_API_URL + "/searchword", {
                    searchword: user.email,
                  })
                  .then((res) => {
                    setResult(res.data);
                    window.localStorage.setItem(
                      "searchedAlumni",
                      JSON.stringify(res.data)
                    );
                  })
                  .catch((err) => {});
                const isCurrentUser = !isStudent
                  ? user.email === profile.email
                  : false;

                const profileLink = isCurrentUser
                  ? `/profile/${profile.roll_no}/${profile.name}`
                  : `/userlist/profile/${user.roll_no}/${user.name}`;
                if (isCurrentUser) {
                  window.open(profileLink, '_blank');
                  // navigate(profileLink);
                } else {
                  // window.open(`/comment/${user.name}/${user.roll_no}`, '_blank');
                  navigate(`/comment/${user.name}/${user.roll_no}`);
                }
              }}
            >
              <td className="w-1/3 border-4 p-4 bg-[#222831] subpixel-antialiased text-[#EEEEEE] ">
                {user.name}
              </td>
              <td className="w-1/3 border-4 p-4 bg-[#222831] text-center text-[#EEEEEE]">
                {user.department}
              </td>
              <td className="w-1/3 border-4 p-4 bg-[#222831] text-center text-[#EEEEEE]">
                {user.roll_no}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <div className="flex justify-center items-center mt-4">
        <button
          className={`p-2 border bg-gray-800 text-white rounded ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="text-gray-600 mx-4">
          Page {currentPage} of {totalFilteredPages}
        </span>
        <button
          className={`p-2 border bg-gray-800 text-white rounded ${
            currentPage === totalFilteredPages
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalFilteredPages}
        >
          &gt;
        </button>
      </div>
    </div></>
  );
};

export default UserList;
