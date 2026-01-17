import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return; // 🔑 IMPORTANT FIX

    axios
      .get(`http://localhost:5000/api/notifications/${user.id}`)
      .then(res => {
        // Ensure array
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          setNotifications([]);
        }
      })
      .catch(err => {
        console.error("Notification error:", err);
        setNotifications([]);
      });
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
      <button onClick={() => setOpen(!open)}>
        🔔 {notifications.length}
      </button>

      {open && (
        <div style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: 10,
          marginTop: 5,
          width: 300
        }}>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map(n => (
              <div key={n._id} style={{ marginBottom: 8 }}>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
