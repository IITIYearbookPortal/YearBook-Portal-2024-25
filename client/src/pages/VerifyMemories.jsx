import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const API_BASE = process.env.REACT_APP_API_URL;
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const VerifyMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwt_decode(token);
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }, [token]);

  let isAdmin = user?.email === ADMIN_EMAIL;
  // uncomment the below line to acces the page without been logged in as admin
  isAdmin = true;
  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/memories/get-pending-request`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch pending memories");

      const data = await res.json();
      setMemories(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/login", { replace: true });
    } else {
      fetchPending();
    }
  }, [token, isAdmin, navigate, fetchPending]);

  const acceptMemory = async (groupId) => {
    try {
      console.log(groupId);
      const res = await fetch(`${API_BASE}/memories/accept/${groupId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPending();
    } catch (err) {
      console.error("Error accepting memory:", err);
    }
  };

  const deleteMemory = async (groupId) => {
    try {
      const res = await fetch(`${API_BASE}/memories/delete/${groupId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPending();
    } catch (err) {
      console.error("Error deleting memory:", err);
    }
  };

  if (!token || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Pending Memory Requests</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
        </div>
      ) : memories.length === 0 ? (
        <p className="text-gray-300">No pending requests</p>
      ) : (
        <div className="grid gap-6">
          {memories.map((m) => (
            <div
              key={m.id}
              className="border border-gray-600 rounded-lg p-4 bg-black bg-opacity-40"
            >
              <p className="font-semibold text-blue-400">{m.authorName}</p>
              <p className="mt-2 text-gray-200">{m.content}</p>

              <div className="flex flex-wrap gap-3 mt-4">
                {m.images?.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt="Memory" 
                    className="h-32 w-auto object-cover rounded shadow-md border border-gray-700" 
                  />
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => acceptMemory(m.groupId)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => deleteMemory(m.groupId)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyMemories;