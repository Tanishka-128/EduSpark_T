import { AppLayout } from '@/components/layout/app-layout';
import ChatInterface from '@/components/chatbot/chat-interface';

export default function ChatbotPage() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-theme(spacing.32))]">
        <ChatInterface />
      </div>
    </AppLayout>
  );
}
