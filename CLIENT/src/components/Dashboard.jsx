import { FaArrowUp } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  const features = [
    { src: "create-chat.webp", label: "Create a new chat" },
    { src: "analyze-image.webp", label: "Analyze images" },
    { src: "help-me.webp", label: "Help me" },
  ];

  return (
    <div className="flex  flex-col gap-10 bg-neutral-900 justify-center items-center lg:w-[calc(100vw-250px)] h-[90vh] lg:h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row justify-center  items-center w-full gap-4">
        <img
          src="logo.webp"
          className="h-20 w-20 opacity-50 rounded-full"
          alt="Textini AI Logo"
        />
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase bg-gradient-to-r from-blue-600 via-purple-400 to-pink-600 bg-clip-text text-transparent text-center opacity-50">
          Textini AI
        </h1>
      </div>
      <div className="flex flex-wrap justify-center lg:px-0 px-10 gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border flex flex-col justify-center items-center rounded-xl gap-4 border-neutral-700 w-full sm:w-[150px] md:w-[200px] transition-all"
          >
            <img
              src={feature.src}
              className="h-10 w-10 rounded"
              alt={feature.label}
            />
            <p className="text-center text-sm md:text-base">{feature.label}</p>
          </div>
        ))}
      </div>
      <div className="pt-10 md:pt-40 w-full px-4 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-800 absolute bottom-10 mb-5 w-[90%] lg:w-[50vw] flex justify-center gap-2 items-center px-5 py-4 rounded-full"
        >
          <input
            type="text"
            name="text"
            className="bg-transparent text-white outline-none w-full"
            placeholder="Ask me anything..."
          />
          <button type="submit" aria-label="Submit chat">
            <FaArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
