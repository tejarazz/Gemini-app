/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiChatNewFill } from "react-icons/ri";
import { useState } from "react";

const ChatList = ({ onItemClick }) => {
  const [chats, setChats] = useState([]);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userchats`,
        {
          credentials: "include", // Ensure cookies are included
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      const data = await response.json();
      setChats(data); // Set initial chats
      return data;
    },
  });

  const handleDeleteChat = async (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
          {
            method: "DELETE",
            credentials: "include", // Ensure cookies are included
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete chat");
        }

        // Update the local state by filtering out the deleted chat
        setChats((prevChats) =>
          prevChats.filter((chat) => chat._id !== chatId)
        );
      } catch (err) {
        console.error("Failed to delete chat:", err);
        alert("Something went wrong while deleting the chat.");
      }
    }
  };

  return (
    <div className="chatList w-[250px] bg-black h-[calc(100vh-80px)] p-5 flex flex-col gap-2">
      <span className="title text-xs font-semibold">DASHBOARD</span>
      <Link
        to="/dashboard"
        className="text-sm p-2 flex justify-between items-center text-neutral-200 hover:bg-neutral-800 rounded"
        onClick={onItemClick} // Close chat list on clicking New Chat
      >
        New Chat
        <RiChatNewFill />
      </Link>
      <hr className="mt-5" />
      <span className="title text-xs pt-5 font-semibold">RECENT CHATS</span>
      <div className="list text-sm flex flex-col gap-2">
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p className="text-red-500">Something went wrong: {error.message}</p>
        )}
        {!isLoading &&
          !isError &&
          chats.map((chat) => (
            <div key={chat._id} className="flex justify-between items-center">
              <Link
                className="hover:bg-neutral-800 text-neutral-200 p-2 rounded flex-1"
                to={`/dashboard/chats/${chat._id}`}
                onClick={onItemClick} // Close chat list on chat item click
              >
                {chat.title}
              </Link>
              <button
                onClick={() => handleDeleteChat(chat._id)}
                className="ml-2 text-white hover:text-red-400"
                aria-label="Delete chat"
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatList;
