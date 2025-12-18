import { getStore } from '@netlify/blobs';
import type { User } from '../../types';

const getBlobStore = () => {
  return getStore({ name: 'mathmaster-data', consistency: 'strong' });
};

export default async (req: Request) => {
  const store = getBlobStore();

  if (req.method === 'GET') {
    try {
      const usersData = await store.get('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      // Bots hinzufügen
      const bots: User[] = [
        { id: 'bot1', username: 'Lukas_9b', xp: 450, avatar: '🦉', coins: 1000, totalEarned: 2000, completedUnits: [], unlockedItems: [], activeEffects: [] },
        { id: 'bot2', username: 'Sarah.Math', xp: 820, avatar: '🥷', coins: 1500, totalEarned: 3000, completedUnits: [], unlockedItems: [], activeEffects: [] },
        { id: 'bot3', username: 'MathePro_X', xp: 1250, avatar: '💎', coins: 5000, totalEarned: 10000, completedUnits: [], unlockedItems: [], activeEffects: [] }
      ];

      const all = [...users, ...bots];
      const sorted = all.sort((a, b) => b.xp - a.xp);

      return Response.json(sorted);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

