import NewPrompt from "./NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });

  return (
    <div className="w-full lg:w-[calc(100vw-250px)] bg-neutral-900 h-[calc(100vh-80px)] pb-20 lg:pb-0 flex flex-col items-center">
      <div className="wrapper flex-1 px-5 lg:px-0 overflow-auto w-full flex justify-center pt-4 md:pt-10 mb-4 md:mb-[100px]">
        <div className="chat w-full max-w-md md:max-w-[50vw] flex flex-col space-y-6">
          {isLoading ? (
            <div className="h-screen w-full flex justify-center items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : isError ? (
            <div className="text-red-500">Something went wrong</div>
          ) : (
            data?.history?.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col p-4 shadow-md ${
                  message.role === "user"
                    ? "bg-neutral-700 flex self-end px-6 py-2 w-fit rounded-full ml-auto text-gray-900"
                    : "bg-neutral-800 rounded-lg"
                }`}
              >
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
                    path={message.image}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    className="rounded-lg mb-2 shadow"
                  />
                )}
                <div className="prose prose-invert w-full max-w-none">
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          )}
          <div className="py-4">{data && <NewPrompt data={data} />}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
