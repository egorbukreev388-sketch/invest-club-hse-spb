// Простая система аутентификации админов (демонстрационная)

interface Admin {
  id: string;
  password: string;
  name: string;
}

// Список администраторов (для демонстрации). В реальном проекте храните в безопасном месте.
const ADMINS: Admin[] = [
  { id: '1558532545', password: '1808', name: 'Егор' },
];

export function validateAdmin(adminId: string, password: string): Admin | null {
  const admin = ADMINS.find(a => a.id === adminId && a.password === password);
  return admin || null;
}

export function isAdmin(adminId: string): boolean {
  return ADMINS.some(a => a.id === adminId);
}

export function setAdminSession(adminId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminId', adminId);
  }
}

export function getAdminSession(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminId');
  }
  return null;
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminId');
  }
}

