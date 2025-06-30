import React, { useContext, useEffect, useState } from "react";
import "./prof.css";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { arrayMove } from "@dnd-kit/sortable";
import { toast, ToastContainer } from "react-toastify";
 
import { Clock, Download, Filter, Grid, List, ArrowUpDown,Pencil, User, X, Mail,Trash2Icon, Phone,Delete, Building2, Calendar, Clock3, Check, Trophy, Users, Medal, GraduationCap, MessageCircle, ThumbsUp, ThumbsDown, GraduationCapIcon, Trash2 } from 'lucide-react';

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
      .then((res) => { })
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
      .catch((err) => { });
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
        .catch((err) => { });
    }
  }, [profile]);

  const token = window.sessionStorage.getItem("google-token");

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
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-400/20 text-emerald-400';
      case 'rejected':
        return 'bg-red-400/20 text-red-400';
      default:
        return 'bg-yellow-400/20 text-yellow-400';
    }
  };





  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  const [comments, setComments] = useState([

    {
      id: 1,
      author: "Prof. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces",
      comment: "Samantha has shown exceptional leadership skills throughout her final year project. Her innovative approach to problem-solving sets her apart.",
      date: "March 15, 2024",
      status: "pending",
      department: "Computer Science"
    },
    {
      id: 2,
      author: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
      comment: "Outstanding contribution to the department's research initiatives. Her paper on AI ethics was particularly noteworthy.",
      date: "March 14, 2024",
      status: "approved",
      department: "AI Research Lab"
    },
    {
      id: 3,
      author: "Prof. Emily Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=faces",
      comment: "Samantha's dedication to mentoring junior students has been remarkable. She's truly embodied the spirit of giving back to the community.",
      date: "March 13, 2024",
      status: "rejected",
      department: "Student Affairs"
    }
  ]);
  return (
    <div className="min-h-screen bg-gray-800 p-6">

      <div className=" mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-900 max-w-4xl mt-5 mb-5 mx-auto rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="text-emerald-400 font-medium">Student Details</div>

          </div>

          <div className="flex gap-6 items-start">
            <img
              src={profile.profile_img}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
            <div className="flex-1">
              <h2 className="text-2xl text-white font-semibold mb-1">{profile.name}</h2>
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
              <div className="flex px-2 items-center gap-3">

                <div>
                  <div className="text-2xl font-bold">About</div>
                  <div className="text-gray-400 text-sm">{profile.about}</div>

                </div>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Approvals Section */}

        <div className="bg-gray-900 max-w-4xl mx-auto h-[55vh]  overflow-y-scroll rounded-2xl px-6 py-3 text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="text-emerald-400 font-medium">Approved Comments</div>

          </div>

          <div className="space-y-4">
            <div key="1" className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                    alt="John Doe"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">John Doe</h4>
                    </div>
                    <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                    <div className="flex items-center gap-3 mt-2">
                   
                  <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div key="2" className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                    alt="John Doe"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">John Doe</h4>
                    </div>
                    <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                    <div className="flex items-center gap-3 mt-2">
                   
                  <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          
            



          </div>

        </div>
        {/* comments Section */}
        <div className=" w-[80vw] mx-auto rounded-2xl p-6 text-white">
          <div className="  lg:flex gap-2 rounded-2xl text-white">
            {/* my comments Section */}
            <div className="h-[70vh]  overflow-y-scroll bg-gray-900 p-6 rounded-2xl">
              <div className=" mb-6">
                <div className="text-emerald-400 font-bold">My Comments </div>
                <div className="text-gray-300 font-medium">Comment on other people to view them here </div>

              </div>

              <div className=" space-y-4">
                <div key="1" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex items-center gap-3 mt-2">

                        <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
                <div key="2" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex items-center gap-3 mt-2">

                        <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
               



              </div>
            </div>
            {/* new comments Section */}
            <div className="h-[70vh]  overflow-y-scroll bg-gray-900 p-6 rounded-2xl">
              <div className=" mb-6">
              <div className="text-emerald-400 font-bold">New Comments </div>
              <div className="text-gray-300 font-medium">Comment that your friends make on you will be shown here </div>
              </div>

              <div className=" space-y-4">
                <div key="1" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex pt-3 gap-2">
                      <button className="p-2 flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
                <div key="2" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex pt-3 gap-2">
                      <button className="p-2 flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button className="p-2 flex gap-2 items-center rounded-lg bg-gray-700 hover:bg-red-500/20 text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
                


              </div>
            </div>
            {/* rejected comments Section */}
            
            <div className="h-[70vh]  overflow-y-scroll bg-gray-900 p-6 rounded-2xl">
              <div className=" mb-6">
              <div className="text-emerald-400 font-bold">Rejected Comments </div>
              <div className="text-gray-300 font-medium">Comments you reject will  will be shown here. (Remember, you cannot restore these comments!) </div>
              </div>

              <div className=" space-y-4">
                <div key="1" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex items-center gap-3 mt-2">

                        <button className="p-2 flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
                <div key="2" className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg" // Dummy avatar
                        alt="John Doe"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">John Doe</h4>
                        </div>
                        <p className="text-gray-300 mt-1">This is a dummy comment to demonstrate the structure of the comment component.</p>
                        <div className="flex items-center gap-3 mt-2">

                        <button className="p-2 flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
               


              </div>
            </div>


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