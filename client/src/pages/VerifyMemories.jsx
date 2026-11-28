import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../helpers/Context";
import ImageLightbox from "../components/memory-map/ImageLightbox";

const API_BASE = process.env.REACT_APP_API_URL;

const VerifyMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  const navigate = useNavigate();
  const {user} = useContext(LoginContext);
  const email = user?.email;

  const fetchPending = useCallback(async () => {
    if (!email) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/memories/get-pending-requests/${email}`,
        {
          credentials:"include", headers: {"X-Yearbook-Request":"1"},
        }
      );

      if (!res.ok) throw new Error("Failed to fetch pending memories");

      const data = await res.json();
      setMemories(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    } else {
      fetchPending();
    }
  }, [email, navigate, fetchPending]);

  const acceptMemory = async (memoryGroupId) => {
    try {
      const res = await fetch(
        `${API_BASE}/memories/accept/${memoryGroupId}/${email}`,
        {
          method: "PATCH",
          credentials:"include", headers: {"X-Yearbook-Request":"1"},
        }
      );

      if (res.ok) fetchPending();
    } catch (err) {
      console.error("Error accepting memory:", err);
    }
  };

  const deleteMemory = async (memoryGroupId) => {
    try {
      const res = await fetch(
        `${API_BASE}/memories/delete/${memoryGroupId}/${email}`,
        {
          method: "DELETE",
          credentials:"include", headers: {"X-Yearbook-Request":"1"},
        }
      );

      if (res.ok) fetchPending();
    } catch (err) {
      console.error("Error deleting memory:", err);
    }
  };

  if (!email) return null;

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
              className="border border-gray-700 rounded-xl p-5 bg-gray-900 shadow-md"
            >
              <p className="font-semibold text-emerald-400">{m.authorName}</p>

              <p className="mt-2 text-gray-200">{m.content}</p>

              {m.images?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {m.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setLightbox({
                          images: m.images,
                          index: i,
                          caption: `Memory by ${m.authorName}`,
                        })
                      }
                      className="rounded-lg border border-gray-700 hover:border-[#76ABAE] overflow-hidden cursor-zoom-in transition-colors"
                      aria-label={`View full memory image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt="Memory"
                        className="h-32 w-auto object-cover block"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => acceptMemory(m.groupId)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600/80 transition-colors rounded-xl font-medium"
                >
                  Accept
                </button>

                <button
                  onClick={() => deleteMemory(m.groupId)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-xl font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default VerifyMemories;