
import { User, ChatMessage, LogEntry, BattleRequest } from '../types';

const DELAY = 100;
// Prüfe ob wir in Production sind und Netlify verwenden sollen
const USE_NETLIFY = typeof window !== 'undefined' &&
  (window.location.hostname.includes('netlify.app') ||
   window.location.hostname.includes('netlify.com') ||
   (typeof process !== 'undefined' && process.env?.VITE_USE_NETLIFY === 'true'));
const API_BASE = '/.netlify/functions';

const db = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val)),
};

// Chat Initialisierung (nur für localStorage)
if (!USE_NETLIFY && !db.get('mm_chat')) {
  db.set('mm_chat', [
    { id: '1', userId: 'bot1', username: 'Lukas_9b', text: 'Hey, wer traut sich ein Battle in "Ähnlichkeit" zu? 📐', timestamp: Date.now() - 3600000, avatar: '🦉', type: 'chat' }
  ]);
}

export const AuthService = {
  async login(username: string): Promise<User> {
    if (USE_NETLIFY) {
      await new Promise(r => setTimeout(r, DELAY));
      const usersRes = await fetch(`${API_BASE}/users`);
      const users: User[] = await usersRes.json();
      let user = users.find((u: User) => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        user = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          avatar: '👤',
          coins: 250,
          totalEarned: 250,
          completedUnits: [],
          unlockedItems: ['av_1'],
          activeEffects: [],
          xp: 0
        };
        await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      }
      db.set('mm_current_user', user); // Cache für getCurrentUser
      return user;
    } else {
      await new Promise(r => setTimeout(r, DELAY));
      let users = db.get('mm_users') || [];
      let user = users.find((u: User) => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        user = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          avatar: '👤',
          coins: 250,
          totalEarned: 250,
          completedUnits: [],
          unlockedItems: ['av_1'],
          activeEffects: [],
          xp: 0
        };
        users.push(user);
        db.set('mm_users', users);
      }
      db.set('mm_current_user', user);
      return user;
    }
  },

  getCurrentUser(): User | null {
    return db.get('mm_current_user');
  }
};

export const DataService = {
  async updateUser(user: User): Promise<void> {
    if (USE_NETLIFY) {
      await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      db.set('mm_current_user', user); // Cache aktualisieren
    } else {
      let users = db.get('mm_users') || [];
      const idx = users.findIndex((u: User) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        db.set('mm_users', users);
        db.set('mm_current_user', user);
      }
    }
  }
};

export const SocialService = {
  async getLeaderboard(): Promise<User[]> {
    if (USE_NETLIFY) {
      const res = await fetch(`${API_BASE}/leaderboard`);
      return await res.json();
    } else {
      let users = db.get('mm_users') || [];
      const bots: User[] = [
        { id: 'bot1', username: 'Lukas_9b', xp: 450, avatar: '🦉', coins: 1000, totalEarned: 2000, completedUnits: [], unlockedItems: [], activeEffects: [] },
        { id: 'bot2', username: 'Sarah.Math', xp: 820, avatar: '🥷', coins: 1500, totalEarned: 3000, completedUnits: [], unlockedItems: [], activeEffects: [] },
        { id: 'bot3', username: 'MathePro_X', xp: 1250, avatar: '💎', coins: 5000, totalEarned: 10000, completedUnits: [], unlockedItems: [], activeEffects: [] }
      ];
      const all = [...users, ...bots];
      return all.sort((a, b) => b.xp - a.xp);
    }
  },

  async getChatMessages(): Promise<ChatMessage[]> {
    if (USE_NETLIFY) {
      const res = await fetch(`${API_BASE}/chat`);
      return await res.json();
    } else {
      return db.get('mm_chat') || [];
    }
  },

  async sendMessage(user: User, text: string, type: 'chat' | 'system' = 'chat'): Promise<void> {
    if (USE_NETLIFY) {
      await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, text, type })
      });
    } else {
      let chat = await this.getChatMessages();
      chat.push({
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        text,
        timestamp: Date.now(),
        type
      });
      db.set('mm_chat', chat.slice(-50));
    }
  },

  async broadcastEvent(username: string, event: string) {
    // Diese Funktion dient als "Event-Tracker" für das Backend
    console.log(`[EVENT]: ${username} ${event}`);
    await this.sendMessage({ id: 'system', username: 'SYSTEM', avatar: '📢' } as User, `${username} ${event}`, 'system');
  }
};

export const Logger = {
  async log(userId: string, action: string, details: string) {
    const logEntry: LogEntry = { timestamp: Date.now(), userId, action, details };

    if (USE_NETLIFY) {
      // Optional: Sende auch an Analytics-Function
      try {
        await fetch(`${API_BASE}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action, details })
        });
      } catch (e) {
        // Ignore analytics errors
      }
    }

    // Immer auch lokal speichern für Debugging
    let logs: LogEntry[] = db.get('mm_logs') || [];
    logs.push(logEntry);
    db.set('mm_logs', logs.slice(-500));
    console.debug(`[SERVER] ${action}: ${details}`);
  }
};
