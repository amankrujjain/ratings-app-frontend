import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./userContext";
import { config } from "../../config";

const WebSocketContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  clearNotifications: () => {},
});

export function WebSocketProvider({ children }) {
  const { user } = useContext(UserContext);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const connect = useCallback(() => {
    if (!user || !user._id) return;

    // Close existing connection
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const role = user.role?.name || "employee";
    const wsUrl = config.BASE_URL.replace(/^http/, "ws");
    const ws = new WebSocket(`${wsUrl}?clientId=${user._id}&role=${role}`);

    ws.onopen = () => {
      console.log("[WS] Connected as", role, user._id);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[WS] Received:", data);

        const notification = {
          id: Date.now(),
          ...data,
          read: false,
        };

        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        setUnreadCount((prev) => prev + 1);

        // Show toast only for employees (not admin/subadmin)
        const role = user?.role?.name;
        if (role !== "admin" && role !== "subadmin") {
          if (data.type === "NEW_REVIEW") {
            const icon = data.rating >= 4 ? "⭐" : data.rating >= 3 ? "👍" : "📝";
            toast.info(`${icon} ${data.message}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            toast.info(data.message || "New notification", {
              position: "top-right",
              autoClose: 4000,
            });
          }
        }
      } catch (err) {
        console.error("[WS] Failed to parse message:", err);
      }
    };

    ws.onclose = () => {
      console.log("[WS] Disconnected, reconnecting in 5s...");
      reconnectTimer.current = setTimeout(connect, 5000);
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
      ws.close();
    };

    wsRef.current = ws;
  }, [user]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <WebSocketContext.Provider value={{ notifications, unreadCount, markAllRead, clearNotifications }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useNotifications = () => useContext(WebSocketContext);
