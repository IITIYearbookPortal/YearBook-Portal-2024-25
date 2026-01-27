import { useEffect, useState } from "react";
import axios from "axios";

const VerifyMemories = () => {
  const [memories, setMemories] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get(
      "/memories/get-pending-request",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setMemories(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const acceptMemory = async (id) => {
    await axios.patch(
      `/memories/accept/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchPending();
  };

  const deleteMemory = async (id) => {
    await axios.delete(
      `/memories/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchPending();
  };

  return (
    <div className="container mx-auto px-6 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Pending Memory Requests</h1>

      {memories.length === 0 && (
        <p className="text-gray-300">No pending requests</p>
      )}

      {memories.map((m) => (
        <div
          key={m.id}
          className="border border-gray-600 rounded-lg p-4 mb-6 bg-black bg-opacity-40"
        >
          <p className="font-semibold">{m.authorName}</p>
          <p className="mt-2">{m.content}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            {m.images.map((img, i) => (
              <img key={i} src={img} alt="" className="h-32 rounded" />
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => acceptMemory(m.id)}
              className="px-4 py-2 bg-green-600 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => deleteMemory(m.id)}
              className="px-4 py-2 bg-red-600 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerifyMemories;
