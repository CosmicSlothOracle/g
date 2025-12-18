import { getStore } from '@netlify/blobs';

const getBlobStore = () => {
  return getStore({ name: 'mathmaster-data', consistency: 'strong' });
};

export default async (req: Request) => {
  const store = getBlobStore();

  if (req.method === 'POST') {
    try {
      const event = await req.json();
      const eventsData = await store.get('analytics/events');
      const events: any[] = eventsData ? JSON.parse(eventsData) : [];

      events.push({
        ...event,
        timestamp: Date.now()
      });

      // Behalte nur die letzten 1000 Events
      await store.set('analytics/events', JSON.stringify(events.slice(-1000)));

      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ error: 'Failed to log event' }, { status: 500 });
    }
  }

  if (req.method === 'GET') {
    try {
      const eventsData = await store.get('analytics/events');
      const events: any[] = eventsData ? JSON.parse(eventsData) : [];

      // Aggregierte Statistiken
      const stats = {
        totalEvents: events.length,
        questCompletions: events.filter(e => e.action === 'QUEST_COMPLETE').length,
        battles: events.filter(e => e.action?.startsWith('BATTLE_')).length,
        shopPurchases: events.filter(e => e.action === 'SHOP_PURCHASE').length,
        coinTransactions: events.filter(e => e.action === 'COIN_TRANSACTION').length
      };

      return Response.json(stats);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

