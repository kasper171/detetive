import { Conversation, Message, Attachment } from "@/types/transcript";

function getAttachmentType(filename: string): "image" | "video" | "audio" {
  const ext = filename.toLowerCase().split('.').pop() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'].includes(ext)) return 'video';
  if (['ogg', 'mp3', 'wav', 'm4a', 'flac', 'aac'].includes(ext)) return 'audio';
  return 'image'; // default
}

export async function parseTranscriptHTML(): Promise<Conversation[]> {
  try {
    const response = await fetch("/transcript.html");
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const conversations: Conversation[] = [];
    
    // Parse DM items from sidebar
    const dmItems = doc.querySelectorAll(".dm-item");
    
    dmItems.forEach((item) => {
      const onclick = item.getAttribute("onclick");
      const idMatch = onclick?.match(/showChat\('(\d+)'\)/);
      if (!idMatch) return;
      
      const chatId = idMatch[1];
      const avatar = item.querySelector(".dm-avatar") as HTMLImageElement;
      const nameSpan = item.querySelector("span");
      
      const name = nameSpan?.textContent?.trim() || "Unknown";
      const avatarUrl = avatar?.src || "https://cdn.discordapp.com/embed/avatars/0.png";
      
      // Find corresponding chat messages
      const chatContainer = doc.getElementById(`chat-${chatId}`);
      const messages: Message[] = [];
      
      if (chatContainer) {
        const messageWrappers = chatContainer.querySelectorAll(".message-wrapper");
        
        messageWrappers.forEach((wrapper, index) => {
          const isMine = wrapper.classList.contains("mine");
          const authorEl = wrapper.querySelector(".msg-author");
          const timeEl = wrapper.querySelector(".msg-time");
          const contentEl = wrapper.querySelector(".message-main > div");
          const avatarImg = wrapper.querySelector(".msg-avatar") as HTMLImageElement;
          
          // Get image attachments
          const attachmentImgs = wrapper.querySelectorAll(".attachment-img") as NodeListOf<HTMLImageElement>;
          
          // Get audio/video attachments (links)
          const attachmentLinks = wrapper.querySelectorAll("a[href^='attachments']") as NodeListOf<HTMLAnchorElement>;
          
          const author = authorEl?.textContent?.trim() || "Unknown";
          const timestamp = timeEl?.textContent?.trim() || "";
          const content = contentEl?.textContent?.trim() || "";
          const msgAvatarUrl = avatarImg?.src;
          
          const attachments: Attachment[] = [];
          
          // Add images
          attachmentImgs.forEach((img) => {
            if (img.src) {
              const filename = img.src.split('/').pop() || img.src.split('\\').pop() || '';
              attachments.push({
                type: 'image',
                url: img.src.replace(/\\/g, '/'),
                filename
              });
            }
          });
          
          // Add audio/video from links
          attachmentLinks.forEach((link) => {
            if (link.href) {
              const href = link.getAttribute('href') || '';
              const filename = href.split('/').pop() || href.split('\\').pop() || '';
              const type = getAttachmentType(filename);
              attachments.push({
                type,
                url: href.replace(/\\/g, '/'),
                filename
              });
            }
          });
          
          messages.push({
            id: `${chatId}-${index}`,
            author,
            content,
            timestamp,
            avatarUrl: msgAvatarUrl,
            isMine,
            attachments: attachments.length > 0 ? attachments : undefined,
          });
        });
      }
      
      conversations.push({
        id: chatId,
        name,
        avatarUrl,
        messages,
      });
    });
    
    return conversations;
  } catch (error) {
    console.error("Error parsing transcript:", error);
    return [];
  }
}
