import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import PrimaryNavbar from "../../common/layout/PrimaryNavbar";
import ChatSidebar from "./components/ChatSidebar";

export default function ChatPage() {
  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const profileId = profile.id;

  const [conversationId, setConversationId] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <PrimaryNavbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden border-t-2 border-orange-200">
        {/* Sidebar */}
        <div
          className={`
            ${conversationId ? "hidden md:flex" : "flex"}
            w-full md:w-72 flex-col border-r
          `}
        >
          <ChatSidebar
            profileId={profileId}
            conversationId={conversationId}
            setConversationId={setConversationId}
          />
        </div>

        {/* Chat Area */}
        <div
          className={`
            ${!conversationId ? "hidden md:flex" : "flex"}
            flex-1 flex-col bg-gray-50
          `}
        >
          {conversationId ? (
            <>
              {/* Mobile back button */}
              <div className="md:hidden p-2 border-b bg-white">
                <button
                  onClick={() => setConversationId(null)}
                  className="text-indigo-600 font-medium"
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
            <div className="hidden md:flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
