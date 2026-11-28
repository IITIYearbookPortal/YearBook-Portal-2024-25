import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../helpers/Context";
import MemberDirectory from "../components/MemberDirectory";
import axios from "axios";
import "./UserList.module.css";

const UserList = () => {
  const { allUsers = [], isStudent, profile, setResult } =
    useContext(LoginContext);
  const navigate = useNavigate();

  const openUser = (targetUser) => {
    window.localStorage.removeItem("searchedAlumni");
    axios
      .post(process.env.REACT_APP_API_URL + "/searchword", {
        searchword: targetUser.email,
      })
      .then((res) => {
        setResult(res.data);
        window.localStorage.setItem(
          "searchedAlumni",
          JSON.stringify(res.data),
        );
      })
      .catch(() => {});

    const isCurrentUser = !isStudent
      ? targetUser.email === profile.email
      : false;
    if (isCurrentUser) {
      window.open(`/profile/${profile.roll_no}/${profile.name}`, "_blank");
    } else {
      navigate(`/comment/${targetUser.name}/${targetUser.roll_no}`);
    }
  };

  return (
    <MemberDirectory
      title="Friends Directory"
      itemLabel="graduating seniors"
      emptyDropdownText="No matching friends or departments found."
      users={allUsers}
      onSelectUser={openUser}
    />
  );
};

export default UserList;
