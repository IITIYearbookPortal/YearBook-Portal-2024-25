import React, { useContext, useEffect, useState } from "react";
import "./prof.css";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { arrayMove } from "@dnd-kit/sortable";
import { toast, ToastContainer } from "react-toastify";
import Avatar from "../../components/Avatar";
import ConfirmDialog, { useConfirmDialog } from "../../components/ConfirmDialog";

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
  const { openConfirm, dialogProps } = useConfirmDialog();

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

    // Make API call to update order in the database
    axios
      .post(process.env.REACT_APP_API_URL + "/updateCommentOrder", {
        comment_reciever_email_id: profile.email,
        comment_reciever_roll_no: comment_reciever_roll_no,
        // comment_reciever_id: profile._id,
        updatedOrder: updatedOrder,
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
    <div className="min-h-screen bg-pagebg px-3 sm:px-6 py-5 sm:py-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-900 max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="text-emerald-400 font-semibold text-base sm:text-lg">
              Student Details
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => (window.location.href = "/verifyMemories")}
                className="flex-1 sm:flex-none px-4 py-2 text-sm sm:text-base bg-emerald-500 font-medium rounded-xl hover:bg-emerald-600/90 active:scale-[0.98] transition-all whitespace-nowrap text-center"
              >
                Verify Memories
              </button>

              <button
                onClick={() =>
                  openConfirm({
                    title: "Edit Profile",
                    message: "Are you sure you want to edit your Profile?",
                    confirmLabel: "Edit Profile",
                    onConfirm: () =>
                      navigate(`/edit/${profile.roll_no}/${profile.name}`),
                  })
                }
                className="flex-1 sm:flex-none px-4 py-2 text-sm sm:text-base bg-emerald-500 font-medium rounded-xl hover:bg-emerald-600/90 active:scale-[0.98] transition-all whitespace-nowrap text-center"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start text-center sm:text-left">
            <Avatar
              src={profile.profile_img}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gray-700"
            />
            <div className="flex-1 min-w-0 w-full">
              <h2 className="text-xl sm:text-2xl text-white font-semibold mb-1 break-words">
                {profile.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 text-sm sm:text-base">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                    <Building2 className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="break-words">{profile.academic_program}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                    <GraduationCapIcon className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="break-words">{profile.department}</span>
                  </div>
                </div>
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                    <Mail className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="break-all">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300">
                    <User className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="break-words">{profile.roll_no}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 sm:mt-8">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex flex-col px-1 sm:px-2">
                <div className="text-lg sm:text-2xl font-bold">About</div>
                <div className="text-gray-300 text-sm sm:text-base mt-2 break-words overflow-auto max-h-48 leading-relaxed">
                  {profile.about}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approved Comments Section */}
        <div className="bg-gray-900 max-w-4xl mx-auto max-h-[55vh] overflow-y-auto rounded-2xl p-4 sm:p-6 text-white shadow-lg">
          <div className="mb-5">
            <div className="text-emerald-400 font-bold text-base sm:text-lg mb-1">
              Approved Comments
            </div>
            <div className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed">
              Top eight comments will be featured in the final yearbook (Drag to
              reorder comments). Additionally, you'll receive a digital version
              of the yearbook that contains all your approved comments. We will
              try to include as many comments as we can for publication in the
              yearbook.
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="approvedComments">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 sm:space-y-4"
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
                            <div className="flex items-start gap-3">
                              <Avatar
                                src={val?.id?.profile_img?.url}
                                alt={val.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium break-words">
                                  {val.name}
                                </h4>
                                <p className="text-gray-300 text-sm sm:text-base mt-1 break-words">
                                  {val.comment}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  <button
                                    onClick={() =>
                                      openConfirm({
                                        title: "Remove Comment",
                                        message:
                                          "Are you sure you want to remove your Approved Comment?",
                                        confirmLabel: "Remove",
                                        variant: "danger",
                                        onConfirm: () =>
                                          removeApprovedComment(
                                            val.order,
                                            val.comment,
                                            val.who,
                                            index,
                                          ),
                                      })
                                    }
                                    className="px-3 py-1.5 text-sm flex gap-1.5 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 active:scale-[0.98] transition-all"
                                  >
                                    <X className="w-4 h-4 shrink-0" />
                                    <span>Remove</span>
                                  </button>
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
        <div className="w-full max-w-7xl mx-auto text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* My Comments Section */}
            <div className="max-h-[65vh] lg:h-[70vh] overflow-y-auto bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg">
              <div className="mb-5">
                <div className="text-emerald-400 font-bold text-base sm:text-lg">
                  My Comments
                </div>
                <div className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
                  Comment on other people to view them here
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {comments &&
                  comments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={val.comment_receiver_image}
                          alt={val.comment_reciever_name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium break-words">
                            {val.comment_reciever_name}
                          </h4>
                          <p className="text-gray-300 text-sm sm:text-base mt-1 break-words">
                            {val.comment}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <button
                              onClick={() => HandlEdit(val)}
                              className="px-3 py-1.5 text-sm flex gap-1.5 items-center rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 active:scale-[0.98] transition-all"
                            >
                              <Pencil className="w-4 h-4 shrink-0" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* New Comments Section */}
            <div className="max-h-[65vh] lg:h-[70vh] overflow-y-auto bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg">
              <div className="mb-5">
                <div className="text-emerald-400 font-bold text-base sm:text-lg">
                  New Comments
                </div>
                <div className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
                  Comments that your friends make on you will be shown here
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {newComments &&
                  newComments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={val?.id?.profile_img?.url}
                          alt={val.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium break-words">{val.name}</h4>
                          <p className="text-gray-300 text-sm sm:text-base mt-1 break-words">
                            {val.comment}
                          </p>
                          <div className="flex pt-3 gap-2 flex-wrap">
                            <button
                              disabled={state}
                              onClick={(e) => {
                                e.preventDefault();
                                openConfirm({
                                  title: "Approve Comment",
                                  message:
                                    "Are you sure you want to approve this comment?",
                                  confirmLabel: "Approve",
                                  onConfirm: async () => {
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
                                  },
                                });
                              }}
                              className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-sm flex items-center gap-1.5 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 active:scale-[0.98] transition-all whitespace-nowrap"
                            >
                              <Check className="w-4 h-4 shrink-0" />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={state}
                              onClick={(e) => {
                                e.preventDefault();
                                openConfirm({
                                  title: "Reject Comment",
                                  message:
                                    "Are you sure you want to reject this comment?",
                                  confirmLabel: "Reject",
                                  variant: "danger",
                                  onConfirm: async () => {
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
                                  },
                                });
                              }}
                              className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-sm flex gap-1.5 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 active:scale-[0.98] transition-all whitespace-nowrap"
                            >
                              <X className="w-4 h-4 shrink-0" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Rejected Comments Section */}
            <div className="max-h-[65vh] lg:h-[70vh] overflow-y-auto bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg">
              <div className="mb-5">
                <div className="text-emerald-400 font-bold text-base sm:text-lg">
                  Rejected Comments
                </div>
                <div className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
                  Comments you reject will be shown here. (Remember, you cannot
                  restore these comments!)
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {rejectedComments &&
                  rejectedComments.map((val, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={val?.id?.profile_img?.url}
                          alt={val.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium break-words">{val.name}</h4>
                          <p className="text-gray-300 text-sm sm:text-base mt-1 break-words">
                            {val.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default Prof;
