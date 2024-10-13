import { useReducer } from "react";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CiMenuFries } from "react-icons/ci";
import ChatList from "../components/ChatList";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const chatListReducer = (state) => !state;

const RootLayout = () => {
  const [isChatListOpen, toggleChatList] = useReducer(chatListReducer, false);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="h-screen bg-neutral-900 text-white relative">
          <header className="h-[80px] text-white px-5 bg-black flex justify-between items-center">
            <Link to="/">
              <div className="flex items-center gap-2">
                <img
                  src="logo.webp"
                  className="w-10 h-10 rounded-full"
                  alt="Gemini AI"
                />
                <span>Textini AI</span>
              </div>
            </Link>
            <div className="flex items-center gap-4 h-full">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <button
                onClick={toggleChatList}
                className="lg:hidden block cursor-pointer"
              >
                <CiMenuFries size={25} />
              </button>
            </div>
          </header>
          <main className="relative">
            {isChatListOpen && (
              <div className="chat-list fixed top-0 left-0 w-64 h-screen bg-black pt-10 z-50">
                <ChatList onItemClick={toggleChatList} />
              </div>
            )}
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
