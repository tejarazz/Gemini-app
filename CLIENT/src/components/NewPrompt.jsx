/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { FaArrowUp } from "react-icons/fa";
import Upload from "./Upload";
import { useEffect, useRef, useState } from "react";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState({
    isLoading: false,
    error: null,
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, image.dbData]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          image: image.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          setQuestion("");
          setAnswer("");
          setImage({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.aiData).length ? [image.aiData, text] : [text]
      );
      let accumalatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumalatedText += chunkText;
        setAnswer(accumalatedText);
      }
      mutation.mutate();
    } catch {
      console.log("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
    e.target.text.value = "";
  };
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <div>
      {image.isLoading && (
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      )}
      {image.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
          path={image.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      <div className="endChat" ref={endRef}></div>
      {question && (
        <div className="message user px-6 py-2 mb-5 flex flex-col items-end bg-neutral-700 rounded-full self-end w-fit ml-auto">
          {question}
        </div>
      )}
      {answer && (
        <div className="message bg-neutral-800 rounded-lg flex flex-col p-5 space-y-2 prose prose-invert w-full max-w-none">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <form
        className="bg-neutral-800 absolute bottom-10 mb-5 w-[90%] lg:w-[50vw] flex justify-center gap-2 items-center px-5 py-4 rounded-full"
        onSubmit={handleSubmit}
      >
        <Upload setImage={setImage} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          className="bg-transparent text-white outline-none w-full"
          placeholder="Ask me anything..."
        />
        <button>
          <FaArrowUp className="cursor-pointer" />
        </button>
      </form>
    </div>
  );
};

export default NewPrompt;
