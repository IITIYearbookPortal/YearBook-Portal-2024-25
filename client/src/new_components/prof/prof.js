import React, { useContext, useEffect, useState } from "react";
import "./prof.css";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { arrayMove } from "@dnd-kit/sortable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Prof = ({ isDarkMode, setIsDarkMode }) => {
  const { loading, profile, loggedin, isStudent, verified } =
    useContext(LoginContext);
  const [state, setState] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [message, setMessage] = useState("");
  const [imageadded, setImageadded] = useState(false);
  const [wait, setWait] = useState(false);
  const navigate = useNavigate();
  const [newComments, setNewComments] = useState([]);
  const [message2, setMessage2] = useState("");
  const [approvedComments, setApprovedComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [protectionmsg, setProtectionMsg] = useState("");
  const [rejectedComments, setRejectedComments] = useState([]);

  // useEffect(() => {
  // }, [isDarkMode]);

  const { roll, name } = useParams();

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }

    if (!loading && isStudent) {
      window.location.href = "/error";
    }

    if (!loading && !verified) {
      window.location.href = "/";
    }

    if (!loading && (roll !== profile.roll_no || name !== profile.name)) {
      window.location.href = "/error";
    }
  });

  const comment_reciever_roll_no = roll;
  // const comment_reciever_name=name;

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedComments = arrayMove(
      approvedComments,
      result.source.index,
      result.destination.index
    );
    // setApprovedComments(updatedComments);
    // setApprovedComments((prevComments) => [...updatedComments]);
    setTimeout(() => {
      setApprovedComments((prevComments) => [...updatedComments]);
    }, 0);

    // Map the updated order and add it to the comment objects
    const updatedOrder = updatedComments.map((comment, index) => ({
      ...comment,
      order: index,
    }));

    const previousOrderMap = {};
    approvedComments.forEach((comment, index) => {
      previousOrderMap[comment._id] = index;
    });

    // Make API call to update order in the database
    axios
      .post(process.env.REACT_APP_API_URL + "/updateCommentOrder", {
        comment_reciever_email_id: profile.email,
        comment_reciever_roll_no: comment_reciever_roll_no,
        // comment_reciever_id: profile._id,
        updatedOrder: updatedOrder,
        previousOrderMap: previousOrderMap,
      })
      .then((res) => {})
      .catch((error) => {
        console.error("Error updating comment order:", error);
        // If there's an error, revert the state to the previous one
        setApprovedComments(approvedComments);
      });
  };

  // Getting Reciever's and Approved Comments:
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getRecieversComments", {
        // comment_reciever_email_id: profile.email,
        // comment_reciever_id: profile._id
        comment_reciever_roll_no: comment_reciever_roll_no,
        // comment_reciever_name:comment_reciever_name
      })
      .then((res) => {
        if (res.data.message === "No users found") {
          setMessage2(res.data.message);
          setNewComments([]);
          setApprovedComments([]);
          setRejectedComments([]);
        } else {
          setNewComments(res.data.user2);
          setApprovedComments(res.data.approvedComments);
          setRejectedComments(res.data.rejectedComments);
        }
      })
      .catch((err) => {});
  }, [profile]);

  useEffect(() => {
    if (profile.email) {
      axios
        .post(process.env.REACT_APP_API_URL + "/getComments", {
          comment_reciever_roll_no: profile.roll_no,
        })
        .then((res) => {
          if (res.data.message === "No users found") {
            setMessage2(res.data.message);
            setComments([]);
          } else {
            setComments(res.data.User);
          }
        })
        .catch((err) => {});
    }
  }, [profile]);

  const token = window.localStorage.getItem("token");

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       // const response = await axios.get(`/profile/${roll}/${name}`);
  //       const response = await axios.get(process.env.REACT_APP_API_URL+`/profile/${roll}/${name}`);
  //       // const response = await axios.get('https://randomuser.me/api/ ');
  //       setProtectionMsg(response.data);
  //       setError(null);
  //     } catch (error) {
  //       setError(error.response.data.message);
  //     }
  //   };

  //   fetchProfile();

  //   // Cleanup function
  //   return () => {
  //     // Any cleanup if necessary
  //   };
  // }, [comment_reciever_roll_no]);
  const removeApprovedComment = (order, comment, index) => {
    setApprovedComments(approvedComments.filter((_, i) => i !== index));

    let worked = false;
    // if(who){
    //   axios
    //   .post(process.env.REACT_APP_API_URL + "/removeCommentFromApprovedComments", {
    //     order: order,
    //     comment_reciever_roll_no: roll,
    //     comment: comment,
    //   }).then((res) => {
    //     setTimeout(() => {
    //       setState(false);
    //     }, 7000);
    //   // })

    //   //   .post(process.env.REACT_APP_API_URL + "/removeCommentFromApprovedComments", {
    //   //     order: order,
    //   //     comment_reciever_roll_no: roll,
    //   //     comment: comment,
    //   //   }).then((res) => {
    //   //     setTimeout(() => {
    //   //       setState(false);
    //   //     }, 7000);

    //     window.location.reload();
    //     });
    // }
    // else{
    // while(!worked){
    //   setTimeout(() => {
    //     setState(false);
    //   }, 5000);
    //   axios
    //   .post(process.env.REACT_APP_API_URL + "/removeCommentFromApprovedComments", {
    //     order: order,
    //     comment_reciever_roll_no: roll,
    //     comment: comment,
    //   }).then((res) => {
    //     worked = res.data.worked;
    // setTimeout(() => {
    //   setState(false);
    // }, 7000);
    // axios
    // .post(process.env.REACT_APP_API_URL + "/removeCommentFromApprovedComments", {
    //   order: order,
    //   comment_reciever_roll_no: roll,
    //   comment: comment,
    // })
    //   })
    // }
    axios
      .post(
        process.env.REACT_APP_API_URL + "/removeCommentFromApprovedComments",
        {
          order: order,
          comment_reciever_roll_no: roll,
          comment: comment,
        }
      )
      .then((res) => {
        worked = res.data.worked;

        if (worked) {
          window.location.reload();
        }
      });

    toast.warning("Kindly refresh the page and retry!");
  };

  // .then((res) => {
  //   navigate(`/profile/${roll}/${name}`);
  //   if (res.data.message === "No users found") {
  //     setMessage2(res.data.message);
  //     setComments([]);
  //   } else {
  //     setComments(res.data.User);
  //   }
  // })
  // .catch((err) => {
  // });

  const HandlEdit = (val) => {
    navigate(`/comment/edit/${val.comment_reciever_roll_no}/${val.comment_id}`);
    // navigate(`/comment/edit/${val.user_comment_reciever_id}-${val.comment_id}-${val.comment}`);
  };

  return (
    <div>
      <ToastContainer />
      <div className="containerls py-20">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.1/css/font-awesome.min.css"
        ></link>
        <div className="container2ls flex flex-col items-center lg:flex-row w-full h-screen gap-4 px-4">
          <div
            className={`comm1 fadeInLeft ${
              isDarkMode
                ? "bg-gray-700 border-2 border-white"
                : "bg-white border-2 border-black"
            }`}
          >
            <div>
              <h1 id="cmtm">Approved Comments</h1>
            </div>
            <div>
              <h6>
                Top twelve comments will be shown on the yearbook (Drag to
                reorder comments)
              </h6>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="approvedComments">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    id="commentsscroll"
                  >
                    {approvedComments &&
                      approvedComments.length !== 0 &&
                      approvedComments.map((val, index) => (
                        <Draggable
                          key={val._id}
                          draggableId={val._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              id="comment"
                              class={`${
                                isDarkMode
                                  ? "border-2 border-white"
                                  : "border-2 border-black"
                              }`}
                            >
                              <p id="commentp">{val.comment}</p>
                              <p id="commentby">-{val.name}</p>
                              <button
                                id="ogout2"
                                className={`rounded-2xl border-2 border-dashed border-black ${
                                  isDarkMode ? "bg-gray-400" : "bg-white"
                                } text-black px-6 py-1 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none`}
                                onClick={() => {
                                  const ans = window.confirm(
                                    "Are you sure you want to remove your Approved Comment?"
                                  );
                                  if (ans) {
                                    removeApprovedComment(
                                      val.order,
                                      val.comment,
                                      val.who,
                                      index
                                    );
                                  }
                                }}
                              >
                                Remove Comment
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="profle fadeInRight">
            <div className="dotsl">
              <img
                className="ipp object-cover exclude-dark-mode"
                id="ip"
                src={profile.profile_img}
                alt=""
              />
            </div>

            <br></br>
            <br></br>
            <div
              className={`about1 text-xl ${
                isDarkMode
                  ? "bg-gray-700 border-2 border-white"
                  : "bg-white border-2 border-black"
              }`}
            >
              <p className="pb-1">{profile.name}</p>
              <p className="p-1">{profile.roll_no}</p>
              <p className="p-1">
                {profile.academic_program} - {profile.dpeartment}
              </p>
              <p className="p-1">About Me: {profile.about}</p>
            </div>
            <div className="edit">
              <button
                style={{ width: "30%" }}
                //   onClick={editProfile}
                id="edti"
                className={`mr-2 rounded-2xl border-dashed px-6 py-1 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none ${
                  isDarkMode
                    ? "bg-gray-700 border-2 border-white text-white"
                    : "bg-white border-2 border-black text-black"
                } `}
                onClick={() => {
                  const ans = window.confirm(
                    "Are you sure you want to edit your Profile?"
                  );
                  if (ans) {
                    ///////////////////////
                    // Navigate to edit profile/
                    ///////////////////////
                    navigate(`/edit/${profile.roll_no}/${profile.name}`);
                  }
                }}
              >
                EDIT YOUR PROFILE
              </button>
            </div>
            {wait && <p>Wait... while Image is Uploading</p>}
            {imageUploaded && imageadded && <p>{message}</p>}
          </div>
        </div>

        <div className="container2ls flex flex-col lg:flex-row items-center w-full h-screen gap-4 px-4">
          <div
            className={`comm2 fadeInLeft ${
              isDarkMode
                ? "bg-gray-700 border-2 border-white"
                : "bg-white border-2 border-black"
            }`}
          >
            <h1 id="cmtm">My Comments</h1>

            <div id="commentsscroll">
              <h6>Comment on other people to view them here</h6>
              {comments && comments.length !== 0 && (
                <>
                  {comments.map((val, index) => (
                    <div
                      id="comment"
                      key={index}
                      class={`${
                        isDarkMode
                          ? "border-2 border-white"
                          : "border-2 border-black"
                      }`}
                    >
                      <p id="commentp">{val.comment}</p>
                      <button
                        id="ebtn"
                        className={`rounded-2xl border-2 border-dashed border-black ${
                          isDarkMode ? "bg-gray-400" : "bg-white"
                        } text-black px-6 py-1 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none`}
                        onClick={() => {
                          HandlEdit(val);
                        }}
                      >
                        Edit Comment
                      </button>
                      <p id="commentby">-{val.comment_reciever_name}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div
            className={`comm3 fadeInRight ${
              isDarkMode
                ? "bg-gray-700 border-2 border-white"
                : "bg-white border-2 border-black"
            }`}
          >
            <h1 id="cmtm">New Comments</h1>
            <h6>Comments that your friends make on you will be shown here</h6>
            <ul style={{ display: "block" }}>
              {newComments && newComments.length !== 0 && (
                <>
                  {newComments.map((val, index) => (
                    <li
                      key={index}
                      id="comment5"
                      class={`${
                        isDarkMode
                          ? "border-2 border-white"
                          : "border-2 border-black"
                      }`}
                    >
                      <p className="newComment">{val.comment}</p>
                      <p className="newCommentUserName"> - {val.name}</p>
                      <button
                        id="check"
                        disabled={state}
                        style={{
                          backgroundColor: state ? "grey" : "transparent",
                        }}
                        onClick={async (e) => {
                          e.preventDefault();
                          const confirmed = window.confirm(
                            "Are you sure you want to approve this comment?"
                          );
                          if (confirmed) {
                            await axios
                              .put(
                                process.env.REACT_APP_API_URL +
                                  "/setApprovedComments",
                                {
                                  // comment_reciever_email_id: profile.email,
                                  // comment_sender_email_id: val.email_id,
                                  _id: val._id,
                                  id: val.id,
                                  comment_reciever_id: profile._id,
                                  comment: val.comment,
                                  comment_reciever_roll_no:
                                    comment_reciever_roll_no,
                                }
                              )
                              .then((res) => {})
                              .catch((err) => {});

                            setState(true);
                            setTimeout(() => {
                              setState(false);
                            }, 7000);
                            window.location.reload();
                          }
                        }}
                      >
                        <i
                          className="fa fa-check-circle"
                          style={{ display: "inline" }}
                        ></i>
                      </button>
                      <p style={{ display: "inline" }}> </p>
                      <button
                        id="check"
                        disabled={state}
                        style={{
                          backgroundColor: state ? "grey" : "transparent",
                        }}
                        onClick={async (e) => {
                          e.preventDefault();
                          const confirmed = window.confirm(
                            "Are you sure you want to reject this comment?"
                          );
                          if (confirmed) {
                            await axios
                              .post(
                                process.env.REACT_APP_API_URL +
                                  "/setRejectedComments",
                                {
                                  comment: val.comment,
                                  // comment_reciever_email_id: profile.email,
                                  // comment_sender_email_id: val.email_id,
                                  _id: val._id,
                                  id: val.id,
                                  comment_reciever_id: profile._id,
                                  comment_reciever_roll_no:
                                    comment_reciever_roll_no,
                                }
                              )
                              .then((res) => {})
                              .catch((err) => {});

                            setState(true);
                            setTimeout(() => {
                              setState(false);
                            }, 20000);
                            window.location.reload();
                          }
                        }}
                      >
                        <a href="" className="fa fa-times-circle"></a>
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          <div
            className={`comm3 fadeInRight ${
              isDarkMode
                ? "bg-gray-700 border-2 border-white"
                : "bg-white border-2 border-black"
            }`}
          >
            <h1 id="cmtm">Rejected Comments</h1>
            <h6>
              Comments you reject will be shown here. (Remember, you CANNOT
              restore these comments!)
            </h6>
            <ul style={{ display: "block" }}>
              {rejectedComments && rejectedComments.length !== 0 && (
                <>
                  {rejectedComments.map((val, index) => (
                    <li
                      key={index}
                      id="comment5"
                      class={`${
                        isDarkMode
                          ? "border-2 border-white"
                          : "border-2 border-black"
                      }`}
                    >
                      <p className="newComment">{val.comment}</p>
                      <p className="newCommentUserName"> - {val.name}</p>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          <div
            style={{
              height: "50px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setApprovedComments((items) => {
        const activeIndex = items.indexOf(active.id);
        const overIndex = items.indexOf(over.id);
        return arrayMove(items, activeIndex, overIndex);
        // items: [2, 3, 1]   0  -> 2
        // [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1]
      });
    }
  }
};

export default Prof;
