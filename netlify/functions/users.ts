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
      return Response.json(users);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const user: User = await req.json();
      const usersData = await store.get('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      const idx = users.findIndex((u: User) => u.id === user.id);

      if (idx !== -1) {
        users[idx] = user;
      } else {
        users.push(user);
      }

      await store.set('users', JSON.stringify(users));
      await store.set(`users/${user.id}`, JSON.stringify(user));
      await store.set('mm_current_user', JSON.stringify(user));

      return Response.json({ success: true, user });
    } catch (error) {
      return Response.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

