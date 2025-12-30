import { Conversation } from "@/types/transcript";
import { Search, Terminal, Star, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
}

// Conversas principais que devem aparecer em destaque
const VICTIM_CONVERSATION = "vieira2025";
const GIRLFRIEND_CONVERSATION = "ysa_b1";

export function Sidebar({ conversations, activeId, onSelectConversation }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Identifica tipo de conversa
  const isVictim = (name: string) => name.toLowerCase().includes(VICTIM_CONVERSATION.toLowerCase());
  const isGirlfriend = (name: string) => name.toLowerCase().includes(GIRLFRIEND_CONVERSATION.toLowerCase());
  const isMain = (name: string) => isVictim(name) || isGirlfriend(name);

  // Separa conversas principais das outras
  const mainConversations = filteredConversations.filter((conv) => isMain(conv.name));
  const otherConversations = filteredConversations.filter((conv) => !isMain(conv.name));

  const getLabel = (name: string) => {
    if (isVictim(name)) return { text: "VÍTIMA", color: "bg-primary text-primary-foreground" };
    if (isGirlfriend(name)) return { text: "NAMORADA", color: "bg-amber-600 text-white" };
    return null;
  };

  const renderConversation = (conv: Conversation, highlighted: boolean = false) => {
    const label = getLabel(conv.name);
    
    return (
      <button
        key={conv.id}
        onClick={() => onSelectConversation(conv.id)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm mb-0.5 transition-all duration-200 group font-mono text-sm ${
          activeId === conv.id
            ? "bg-primary/20 text-primary border border-primary/50"
            : highlighted
            ? "bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/30"
            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
        }`}
      >
        <div className="relative">
          <img
            src={conv.avatarUrl}
            alt={conv.name}
            className={`w-8 h-8 rounded-sm object-cover ${highlighted ? "ring-1 ring-primary" : ""}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
            }}
          />
          {highlighted && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
              <Star className="w-2 h-2 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <span className={`text-sm font-medium truncate block ${highlighted ? "text-primary terminal-glow" : ""}`}>
            {conv.name}
          </span>
          <span className="text-xs text-muted-foreground truncate block">
            [{conv.messages.length}] msgs
          </span>
        </div>
        {label && (
          <span className={`text-[9px] ${label.color} px-1.5 py-0.5 rounded-sm font-bold`}>
            {label.text}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-60 md:w-72 bg-sidebar/95 backdrop-blur-sm flex flex-col border-r border-primary/20 h-full shrink-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-primary/20 bg-card/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-primary">./conversas</span>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm font-mono">
          {conversations.length}
        </span>
      </div>
      
      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="grep -i 'buscar'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 text-sm rounded-sm pl-9 pr-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-primary/20 font-mono transition-all"
          />
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8 font-mono">
            <p className="text-primary">[ERRO]</p>
            <p>Nenhum resultado</p>
          </div>
        ) : (
          <>
            {/* Main Conversations Section */}
            {mainConversations.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-2 py-2">
                  <AlertTriangle className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                    // PRINCIPAIS
                  </span>
                </div>
                {mainConversations.map((conv) => renderConversation(conv, true))}
              </div>
            )}
            
            {/* Other Conversations */}
            {otherConversations.length > 0 && (
              <div>
                {mainConversations.length > 0 && (
                  <div className="px-2 py-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      // outras
                    </span>
                  </div>
                )}
                {otherConversations.map((conv) => renderConversation(conv, false))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
