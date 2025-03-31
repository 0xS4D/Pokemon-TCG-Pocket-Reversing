import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ReactJson from "react-json-view";
import { CloudDownloadIcon, CloudUploadIcon } from "lucide-react";

interface FridaMessage {
  type: string;
  content: any;
}

export default function App() {
  const [messages, setMessages] = useState<FridaMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<FridaMessage | null>(
    null
  );

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("🟢 Conectado al servidor Socket.IO");
    });

    newSocket.on("frida_message", (data: FridaMessage) => {
      console.log("📥 Mensaje recibido:", data);
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("disconnect", () => {
      console.warn("🔴 Desconectado del servidor");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const parseJsonContent = (content: any) => {
    if (!content) return null;

    const stringContent = content.slice(1, -1).replace(/\\"/g, '"');

    return JSON.parse(stringContent);
  };

  const handleMessageClick = (message: FridaMessage) => {
    setSelectedMessage(message);
  };

  return (
    <div className="bg-zinc-900 text-white flex items-center justify-center h-dvh w-full">
      <div className="h-full bg-zinc-800 w-full p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Mensajes</h2>
        {messages.length === 0 ? (
          <p className="text-zinc-400">No hay mensajes aún...</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`p-3 rounded cursor-pointer transition-colors duration-200 ${
                  selectedMessage === msg
                    ? "bg-blue-600"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
                onClick={() => handleMessageClick(msg)}
              >
                <div className="text-sm text-zinc-300 truncate flex gap-2">
                  <span>
                    {msg.type == "request" ? (
                      <CloudUploadIcon className="text-green-400" />
                    ) : (
                      <CloudDownloadIcon className="text-red-400" />
                    )}
                  </span>
                  {msg.type ? msg.content : msg.content.slice(1, -1)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-full bg-zinc-900 w-full p-4 overflow-y-auto">
        {selectedMessage ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Detalles del mensaje</h2>
            <div className="p-4 bg-zinc-800 rounded-lg">
              <div className="mt-2 p-3 bg-zinc-700 rounded overflow-scroll">
                <ReactJson
                  src={parseJsonContent(selectedMessage.content)}
                  theme="bespin"
                  name={false}
                  displayDataTypes={false}
                  collapsed={1}
                  enableClipboard={true}
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-400">
            <p>Selecciona un mensaje para ver su contenido</p>
          </div>
        )}
      </div>
    </div>
  );
}
