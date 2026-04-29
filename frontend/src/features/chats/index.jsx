import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import PrimaryNavbar from "../../common/layout/PrimaryNavbar";
import ChatSidebar from "./components/ChatSidebar";

export default function ChatPage() {
  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const profileId = profile.id;

  const [conversationId, setConversationId] = useState(null);

  return (
    <div
      className="h-screen flex flex-col 
      bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]"
    >
      {/* Navbar */}
      <PrimaryNavbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden border-t border-white/50">
        {/* Sidebar */}
        <div
          className={`
            ${conversationId ? "hidden md:flex" : "flex"}
            w-full md:w-72 flex-col
            relative

            bg-white/10 backdrop-blur-xl
            border-r border-white/10
          `}
        >
          {/* same subtle glow as header */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-indigo-500/10 to-purple-500/10" />

          <div className="relative h-full flex flex-col">
            <ChatSidebar
              profileId={profileId}
              conversationId={conversationId}
              setConversationId={setConversationId}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`
            ${!conversationId ? "hidden md:flex" : "flex"}
            flex-1 flex-col
            bg-white/40 backdrop-blur-sm  
          `}
        >
          {conversationId ? (
            <>
              {/* Mobile back button */}
              <div
                className="
                  md:hidden px-3 py-2
                  bg-white/80 backdrop-blur-xl
                  border-b border-white/50
                "
              >
                <button
                  onClick={() => setConversationId(null)}
                  className="
                    text-sm font-medium
                    text-indigo-600 hover:text-indigo-700
                    transition
                  "
                >
                  ← Back
                </button>
              </div>

              <ChatWindow
                profileId={profileId}
                conversationId={conversationId}
              />
            </>
          ) : (
            <div className="hidden md:flex items-center justify-center flex-1 px-6">
              <div
                className="
                  relative w-full max-w-2xl min-h-[340px] rounded-3xl
                  flex flex-col items-center justify-center gap-6
                "
              >
                <img
                  src="/yoga.svg"
                  alt="No conversation"
                  className="w-64 opacity-80"
                />

                <div
                  className="
                    px-8 py-6 rounded-2xl text-center
                    bg-white/80 backdrop-blur-xl
                    border border-white/60
                    shadow-[0_10px_30px_rgba(0,0,0,0.1)]
                  "
                >
                  <p className="text-sm text-gray-600">
                    No conversation selected
                  </p>

                  <p className="mt-2 text-xl font-semibold text-gray-900">
                    Start chatting with your community
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
