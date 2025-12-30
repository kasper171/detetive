import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { MobileNav } from "@/components/MobileNav";
import { Conversation } from "@/types/transcript";
import { parseTranscriptHTML } from "@/utils/parseTranscript";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatrixRain } from "@/components/MatrixRain";

const Conversas = () => {
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
      <div className="h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10 text-center space-y-4 animate-fade-in">
          <Terminal className="w-12 h-12 mx-auto text-primary animate-pulse terminal-glow" />
          <div className="font-mono">
            <p className="text-primary terminal-glow">[CARREGANDO...]</p>
            <p className="text-muted-foreground text-sm mt-2">Decifrando backup do Discord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background relative">
      {/* Matrix Rain Background - subtle */}
      <div className="fixed inset-0 z-0 opacity-20">
        <MatrixRain />
      </div>

      {/* Back to Home Header */}
      <div className="relative z-20 bg-card/90 border-b border-primary/30 py-2 px-4 flex items-center gap-4 backdrop-blur-sm">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 font-mono">
            <ArrowLeft className="w-4 h-4" />
            cd ../home
          </Button>
        </Link>
        <span className="text-muted-foreground text-sm font-mono">// backup_conversas_discord</span>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Mobile Navigation */}
        <MobileNav isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Sidebar - Desktop always visible, Mobile as overlay */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          style={{ top: "49px" }}
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
            className="fixed inset-0 bg-background/80 z-30 md:hidden backdrop-blur-sm"
            style={{ top: "49px" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <ChatArea conversation={activeConversation} />
      </div>
    </div>
  );
};

export default Conversas;
