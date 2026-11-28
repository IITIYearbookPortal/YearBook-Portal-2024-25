import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../helpers/Context";
import MemberDirectory from "../components/MemberDirectory";
import axios from "axios";
import "../new_components/UserList.module.css";

const PreviousYrBook = () => {
  const { user, loggedin, verified } = useContext(LoginContext);
  const navigate = useNavigate();
  const [previousUsers, setPreviousUsers] = useState([]);

  // Fetch previous yearbook users only for verified members/students
  useEffect(() => {
    if (!loggedin || (user?.alumni && !verified)) return;
    axios
      .get(process.env.REACT_APP_API_URL + "/previousYrBook/getSeniors")
      .then((res) => {
        setPreviousUsers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch previous yearbook:", err);
      });
  }, [loggedin, user?.alumni, verified]);

  const openSenior = (senior) => {
    if (!senior?.roll_no) return;
    navigate(`/previous-yrbook/getSenior/${senior.roll_no}`);
  };

  return (
    <MemberDirectory
      title="Yearbook Archive"
      itemLabel="archived seniors"
      emptyDropdownText="No matching seniors or departments found."
      users={previousUsers}
      onSelectUser={openSenior}
    />
  );
};

export default PreviousYrBook;
