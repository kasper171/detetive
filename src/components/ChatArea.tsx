import { Conversation, Message, Attachment } from "@/types/transcript";
import { Terminal, Play, Pause, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AttachmentRendererProps {
  attachment: Attachment;
}

function AttachmentRenderer({ attachment }: AttachmentRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (attachment.type === "image") {
    if (imageError) return null;
    return (
      <img
        src={attachment.url}
        alt={attachment.filename}
        className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(attachment.url, "_blank")}
        onError={() => setImageError(true)}
      />
    );
  }

  if (attachment.type === "video") {
    return (
      <div className="max-w-md rounded-lg overflow-hidden bg-black/20">
        <video
          ref={videoRef}
          src={attachment.url}
          controls
          className="w-full max-h-80 object-contain"
          preload="metadata"
        >
          Seu navegador não suporta vídeo.
        </video>
        <div className="px-2 py-1 text-xs text-muted-foreground truncate">
          {attachment.filename}
        </div>
      </div>
    );
  }

  if (attachment.type === "audio") {
    return (
      <div className="flex flex-col gap-2 bg-secondary/50 rounded-lg px-3 py-2 max-w-sm border border-primary/20">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm truncate text-foreground">{attachment.filename}</span>
        </div>
        <audio
          ref={audioRef}
          src={attachment.url}
          controls
          className="w-full h-8 [&::-webkit-media-controls-panel]:bg-secondary [&::-webkit-media-controls-current-time-display]:text-foreground [&::-webkit-media-controls-time-remaining-display]:text-foreground"
          preload="metadata"
        />
      </div>
    );
  }

  return null;
}

function MessageBubble({ message, showAvatar }: { message: Message; showAvatar: boolean }) {
  return (
    <div
      className={`flex gap-4 py-1 px-4 hover:bg-discord-hover transition-colors rounded animate-fade-in ${
        message.isMine ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      {!message.isMine && showAvatar ? (
        <img
          src={message.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"}
          alt={message.author}
          className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
          }}
        />
      ) : !message.isMine ? (
        <div className="w-10 shrink-0" />
      ) : null}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${message.isMine ? "items-end" : "items-start"}`}>
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 ${message.isMine ? "flex-row-reverse" : ""}`}>
            <span className={`font-semibold text-sm ${message.isMine ? "text-primary" : "text-foreground"}`}>
              {message.author}
            </span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          </div>
        )}
        
        {/* Text content */}
        {message.content && (
          <div
            className={`px-4 py-2 rounded-2xl ${
              message.isMine
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-foreground rounded-bl-md border border-primary/20"
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          </div>
        )}
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, idx) => (
              <AttachmentRenderer key={idx} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatAreaProps {
  conversation: Conversation | null;
}

export function ChatArea({ conversation }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background/50">
        <div className="text-center space-y-4 animate-fade-in">
          <Terminal className="w-16 h-16 mx-auto text-primary/30" />
          <div className="font-mono">
            <p className="text-primary terminal-glow text-lg">$ SELECT_CONVERSATION</p>
            <p className="text-muted-foreground text-sm mt-2">// Selecione uma conversa</p>
          </div>
        </div>
      </div>
    );
  }

  // Group consecutive messages from same author
  const groupedMessages: { message: Message; showAvatar: boolean }[] = [];
  conversation.messages.forEach((msg, idx) => {
    const prevMsg = conversation.messages[idx - 1];
    const showAvatar = !prevMsg || prevMsg.author !== msg.author || prevMsg.isMine !== msg.isMine;
    groupedMessages.push({ message: msg, showAvatar });
  });

  return (
    <div className="flex-1 flex flex-col bg-background/50 overflow-hidden">
      {/* Chat Header */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-primary/20 shrink-0 bg-card/50">
        <Terminal className="w-4 h-4 text-primary" />
        <div className="flex items-center gap-3">
          <img
            src={conversation.avatarUrl}
            alt={conversation.name}
            className="w-6 h-6 rounded-sm border border-primary/30"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
            }}
          />
          <span className="font-mono text-primary terminal-glow">{conversation.name}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          [{conversation.messages.length}] msgs
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Nenhuma mensagem nesta conversa
          </div>
        ) : (
          <>
            {/* Conversation start indicator */}
            <div className="px-4 py-8 text-center border-b border-border mb-4 mx-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={conversation.avatarUrl}
                  alt={conversation.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{conversation.name}</h3>
              <p className="text-sm text-muted-foreground">
                Este é o início do seu histórico de mensagens diretas com{" "}
                <span className="font-semibold text-foreground">{conversation.name}</span>
              </p>
            </div>

            {groupedMessages.map(({ message, showAvatar }) => (
              <MessageBubble key={message.id} message={message} showAvatar={showAvatar} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
