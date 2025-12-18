import { getStore } from '@netlify/blobs';
import type { ChatMessage, User } from '../../types';

const getBlobStore = () => {
  return getStore({ name: 'mathmaster-data', consistency: 'strong' });
};

export default async (req: Request) => {
  const store = getBlobStore();

  if (req.method === 'GET') {
    try {
      const messagesData = await store.get('mm_chat');
      const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [
        {
          id: '1',
          userId: 'bot1',
          username: 'Lukas_9b',
          text: 'Hey, wer traut sich ein Battle in "Ähnlichkeit" zu? 📐',
          timestamp: Date.now() - 3600000,
          avatar: '🦉',
          type: 'chat'
        }
      ];
      return Response.json(messages);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const { user, text, type = 'chat' }: { user: User; text: string; type?: 'chat' | 'system' } = await req.json();
      const messagesData = await store.get('mm_chat');
      const messages: ChatMessage[] = messagesData ? JSON.parse(messagesData) : [];

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        text,
        timestamp: Date.now(),
        type
      };

      messages.push(newMessage);
      await store.set('mm_chat', JSON.stringify(messages.slice(-50)));

      return Response.json({ success: true, message: newMessage });
    } catch (error) {
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

