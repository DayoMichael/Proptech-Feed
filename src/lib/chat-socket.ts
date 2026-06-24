import type { Message } from "@/types";

export type ServerEvent =
  | { type: "delivered"; conversationId: string; messageId: string }
  | { type: "seen"; conversationId: string }
  | { type: "typing"; conversationId: string; isTyping: boolean }
  | { type: "message"; message: Message };

type Handler = (event: ServerEvent) => void;

class ChatSocket {
  private target = new EventTarget();

  on(handler: Handler): () => void {
    const listener = (e: Event) =>
      handler((e as CustomEvent<ServerEvent>).detail);
    this.target.addEventListener("server", listener);
    return () => this.target.removeEventListener("server", listener);
  }

  private emit(event: ServerEvent) {
    this.target.dispatchEvent(new CustomEvent("server", { detail: event }));
  }

  send(message: Message, makeReply: () => Message) {
    const { conversationId, id } = message;
    setTimeout(
      () => this.emit({ type: "delivered", conversationId, messageId: id }),
      500,
    );
    setTimeout(() => this.emit({ type: "seen", conversationId }), 1100);
    setTimeout(
      () => this.emit({ type: "typing", conversationId, isTyping: true }),
      1400,
    );
    const replyDelay = 2600 + Math.floor(Math.random() * 1400);
    setTimeout(() => {
      this.emit({ type: "typing", conversationId, isTyping: false });
      this.emit({ type: "message", message: makeReply() });
    }, replyDelay);
  }
}

export const chatSocket = new ChatSocket();
