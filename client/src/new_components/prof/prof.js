import React, { useContext, useEffect, useState } from "react";
import "./prof.css";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { arrayMove } from "@dnd-kit/sortable";
import { toast, ToastContainer } from "react-toastify";

import {
  Clock,
  Download,
  Filter,
  Grid,
  List,
  ArrowUpDown,
  Pencil,
  User,
  X,
  Mail,
  Trash2Icon,
  Phone,
  Delete,
  Building2,
  Calendar,
  Clock3,
  Check,
  Trophy,
  Users,
  Medal,
  GraduationCap,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  GraduationCapIcon,
  Trash2,
} from "lucide-react";

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
  // const [comments, setComments] = useState([]);
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
      result.destination.index,
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
        },
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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-400/20 text-emerald-400";
      case "rejected":
        return "bg-red-400/20 text-red-400";
      default:
        return "bg-yellow-400/20 text-yellow-400";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Prof. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces",
      comment:
        "Samantha has shown exceptional leadership skills throughout her final year project. Her innovative approach to problem-solving sets her apart.",
      date: "March 15, 2024",
      status: "pending",
      department: "Computer Science",
    },
    {
      id: 2,
      author: "Dr. Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
      comment:
        "Outstanding contribution to the department's research initiatives. Her paper on AI ethics was particularly noteworthy.",
      date: "March 14, 2024",
      status: "approved",
      department: "AI Research Lab",
    },
    {
      id: 3,
      author: "Prof. Emily Williams",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=faces",
      comment:
        "Samantha's dedication to mentoring junior students has been remarkable. She's truly embodied the spirit of giving back to the community.",
      date: "March 13, 2024",
      status: "rejected",
      department: "Student Affairs",
    },
  ]);
  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <ToastContainer />
      <div className="mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-900 max-w-4xl mt-5 mb-5 mx-auto rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="text-emerald-400 font-medium">Student Details</div>

            <div
              onClick={() => {
                const ans = window.confirm(
                  "Are you sure you want to edit your Profile?",
                );
                if (ans) {
                  navigate(`/edit/${profile.roll_no}/${profile.name}`);
                }
              }}
              className="p-2 bg-emerald-500 font-medium rounded-xl hover:bg-emerald-600/80 "
            >
              <button>Edit Profile</button>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <img
              src={profile.profile_img}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
            <div className="flex-1">
              <h2 className="text-2xl text-white font-semibold mb-1">
                {profile.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{profile.academic_program}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <GraduationCapIcon className="w-4 h-4" />
                    <span>{profile.dpeartment}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{profile.roll_no}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full gap-4 mt-8">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex flex-col px-2">
                <div className="text-2xl font-bold">About</div>
                <div className="text-gray-400 text-sm mt-2 break-words overflow-auto max-h-48">
                  {profile.about}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approved Comments Section */}
        <div className="bg-gray-900 max-w-4xl mx-auto h-[55vh] overflow-y-scroll rounded-2xl px-6 py-3 text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="">
              <div className="text-emerald-400 font-bold">
                Approved Comments{" "}
              </div>
              <div className="text-gray-300 font-medium">
                Top eight comments will be featured in the final yearbook (Drag
                to reorder comments). Additionally, you'll receive a digital
                version of the yearbook that contains all your approved
                comments. We will try to include as many comments as we can for
                publication in the yearbook.
              </div>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="approvedComments">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {approvedComments &&
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
                            className="bg-gray-800 rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <img
                                  src={
                                    val.id.profile_img ||
                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                  }
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{val.name}</h4>
                                  </div>
                                  <p className="text-gray-300 mt-1">
                                    {val.comment}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <button
                                      onClick={() => {
                                        const ans = window.confirm(
                                          "Are you sure you want to remove your Approved Comment?",
                                        );
                                        if (ans) {
                                          removeApprovedComment(
                                            val.order,
                                            val.comment,
                                            val.who,
                                            index,
                                          );
                                        }
                                      }}
                                      className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                      <span>Remove</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
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

        {/* Comments Section */}
        <div className="w-[95vw] mx-auto rounded-2xl p-6 text-white flex flex-wrap">
          <div className="gap-2 rounded-2xl text-white grid md:grid-cols-3 grid-cols-1">
            {/* My Comments Section */}
            <div className="h-[70vh] overflow-y-scroll bg-gray-900 p-6 m-2 rounded-2xl">
              <div className="mb-6">
                <div className="text-emerald-400 font-bold">My Comments</div>
                <div className="text-gray-300 font-medium">
                  Comment on other people to view them here
                </div>
              </div>

              <div className="space-y-4">
                {comments &&
                  comments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              val.comment_receiver_image ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {val.comment_reciever_name}
                              </h4>
                            </div>
                            <p className="text-gray-300 mt-1">{val.comment}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => HandlEdit(val)}
                                className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* New Comments Section */}
            <div className="h-[70vh]  overflow-y-scroll bg-gray-900 p-6 m-2 rounded-2xl">
              <div className="mb-6">
                <div className="text-emerald-400 font-bold">New Comments</div>
                <div className="text-gray-300 font-medium">
                  Comments that your friends make on you will be shown here
                </div>
              </div>

              <div className="space-y-4">
                {newComments &&
                  newComments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              val.id.profile_img ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="w-full">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{val.name}</h4>
                            </div>
                            <p className="text-gray-300 mt-1 flex max-w-full break-words">
                              {val.comment}
                            </p>
                            <div className="flex pt-3 gap-2 flex-wrap">
                              <button
                                disabled={state}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const confirmed = window.confirm(
                                    "Are you sure you want to approve this comment?",
                                  );
                                  if (confirmed) {
                                    await axios.put(
                                      process.env.REACT_APP_API_URL +
                                        "/setApprovedComments",
                                      {
                                        _id: val._id,
                                        id: val.id,
                                        comment_reciever_id: profile._id,
                                        comment: val.comment,
                                        comment_reciever_roll_no:
                                          comment_reciever_roll_no,
                                      },
                                    );
                                    setState(true);
                                    setTimeout(() => {
                                      setState(false);
                                    }, 7000);
                                    window.location.reload();
                                  }
                                }}
                                className="p-2 flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                disabled={state}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const confirmed = window.confirm(
                                    "Are you sure you want to reject this comment?",
                                  );
                                  if (confirmed) {
                                    await axios.post(
                                      process.env.REACT_APP_API_URL +
                                        "/setRejectedComments",
                                      {
                                        comment: val.comment,
                                        _id: val._id,
                                        id: val.id,
                                        comment_reciever_id: profile._id,
                                        comment_reciever_roll_no:
                                          comment_reciever_roll_no,
                                      },
                                    );
                                    setState(true);
                                    setTimeout(() => {
                                      setState(false);
                                    }, 20000);
                                    window.location.reload();
                                  }
                                }}
                                className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Rejected Comments Section */}
            <div className="h-[70vh] overflow-y-scroll bg-gray-900 p-6 m-2 rounded-2xl">
              <div className="mb-6">
                <div className="text-emerald-400 font-bold">
                  Rejected Comments
                </div>
                <div className="text-gray-300 font-medium">
                  Comments you reject will be shown here. (Remember, you cannot
                  restore these comments!)
                </div>
              </div>

              <div className="space-y-4">
                {rejectedComments &&
                  rejectedComments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              val.id.profile_img ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{val.name}</h4>
                            </div>
                            <p className="text-gray-300 mt-1">{val.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prof;
