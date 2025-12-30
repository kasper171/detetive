import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { MobileNav } from "@/components/MobileNav";
import { Conversation } from "@/types/transcript";
import { parseTranscriptHTML } from "@/utils/parseTranscript";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadTranscript() {
      setLoading(true);
      const data = await parseTranscriptHTML();
      setConversations(data);
      setLoading(false);
    }
    loadTranscript();
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
          <p className="text-muted-foreground">Carregando backup do Discord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile Navigation */}
      <MobileNav isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar - Desktop always visible, Mobile as overlay */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Area */}
      <ChatArea conversation={activeConversation} />
    </div>
  );
};

export default Index;
