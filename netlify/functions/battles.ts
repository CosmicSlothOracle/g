import { getStore } from '@netlify/blobs';
import type { BattleRequest } from '../../types';

const getBlobStore = () => {
  return getStore({ name: 'mathmaster-data', consistency: 'strong' });
};

export default async (req: Request) => {
  const store = getBlobStore();

  if (req.method === 'GET') {
    try {
      const battleId = new URL(req.url).searchParams.get('id');
      if (battleId) {
        const battleData = await store.get(`battles/${battleId}`);
        const battle = battleData ? JSON.parse(battleData) : null;
        return Response.json(battle);
      }
      return Response.json({ error: 'Battle ID required' }, { status: 400 });
    } catch (error) {
      return Response.json({ error: 'Failed to fetch battle' }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const battle: BattleRequest = await req.json();
      await store.set(`battles/${battle.id}`, JSON.stringify(battle));
      return Response.json({ success: true, battle });
    } catch (error) {
      return Response.json({ error: 'Failed to create battle' }, { status: 500 });
    }
  }

  if (req.method === 'PUT') {
    try {
      const battle: BattleRequest = await req.json();
      await store.set(`battles/${battle.id}`, JSON.stringify(battle));
      return Response.json({ success: true, battle });
    } catch (error) {
      return Response.json({ error: 'Failed to update battle' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

