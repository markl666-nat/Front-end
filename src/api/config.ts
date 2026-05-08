// Базовая конфигурация API.
// В dev — наш локальный бэк на http://localhost:5257.
// В prod — заменить на реальный домен через переменную окружения.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5257';

// Имена ключей в localStorage для хранения JWT-токена и информации о юзере.
// Не содержат пароли — только токен и публичные данные.
export const STORAGE_KEYS = {
  token: 'cbs_token',
  userId: 'cbs_user_id',
  userRole: 'cbs_user_role',
  userName: 'cbs_user_name',
} as const;