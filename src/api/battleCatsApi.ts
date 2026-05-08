import type {
  BattleItemDto,
  LoginRequest,
  LoginResponse,
  Product,
  ProductCategory,
} from '../types';
import { API_BASE_URL, STORAGE_KEYS } from './config';

// ===========================================================
// ВНУТРЕННИЕ ХЕЛПЕРЫ
// ===========================================================

const PLACEHOLDER_IMG = (label: string) =>
  `https://placehold.co/800x520/png?text=${encodeURIComponent(label)}`;

/**
 * Достаёт текущий JWT из localStorage.
 * Возвращает null если юзер не залогинен.
 */
function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.token);
}

/**
 * Универсальный fetch с автоматической подстановкой Authorization header.
 * Если токен есть — добавляем "Bearer <token>" в каждый запрос.
 * Если бэк ответил 401 — чистим localStorage (токен протух).
 */
async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  // Токен протух — чистим хранилище, чтобы UI понял что юзер разлогинен
  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.userRole);
    localStorage.removeItem(STORAGE_KEYS.userName);
  }

  return response;
}

/**
 * Маппит категорию с бэка (ItemCategory.name) в типизированную ProductCategory.
 * Если категория неизвестна — фолбек на 'Cat Units'.
 */
function mapCategory(name: string): ProductCategory {
  const known: ProductCategory[] = [
    'Cat Units',
    'Base Upgrades',
    'Buffs',
    'Gacha',
  ];
  return known.includes(name as ProductCategory)
    ? (name as ProductCategory)
    : 'Cat Units';
}

/**
 * Превращает BattleItemDto (контракт бэка) в Product (UI-модель).
 * Это место "адаптера" — если бэк изменится, поменяется только тут.
 */
function toProduct(dto: BattleItemDto): Product {
  return {
    id: String(dto.id),
    title: dto.name,
    description: dto.lore?.description ?? '',
    priceEuro: dto.priceEuro,
    category: mapCategory(dto.category?.name ?? ''),
    imageUrl:
      dto.images && dto.images.length > 0
        ? dto.images[0].url
        : PLACEHOLDER_IMG(dto.name),
  };
}

// ===========================================================
// ПУБЛИЧНЫЕ ЭНДПОИНТЫ (без авторизации)
// ===========================================================

/**
 * Получить все товары из бэка.
 * GET /api/battleitem/getAll — публичный, [AllowAnonymous].
 */
export async function fetchBattleItems(
  signal?: AbortSignal,
): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/battleitem/getAll`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }

  const dtos = (await response.json()) as BattleItemDto[];
  return dtos.map(toProduct);
}

// ===========================================================
// АВТОРИЗАЦИЯ
// ===========================================================

/**
 * Залогиниться. POST /api/session/auth.
 * При успехе — сохраняет токен в localStorage и возвращает данные юзера.
 */
export async function loginUser(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/session/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid login or password');
  }

  const data = (await response.json()) as LoginResponse;

  // Сохраняем токен и базовые данные в localStorage.
  // Роль вытащим из payload токена в AuthContext (декодирование там).
  localStorage.setItem(STORAGE_KEYS.token, data.token);
  localStorage.setItem(STORAGE_KEYS.userId, String(data.userId));
  localStorage.setItem(STORAGE_KEYS.userName, credentials.login);

  return data;
}

/**
 * Разлогиниться — просто чистим localStorage.
 * Сервер stateless, никаких запросов слать не нужно.
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.userId);
  localStorage.removeItem(STORAGE_KEYS.userRole);
  localStorage.removeItem(STORAGE_KEYS.userName);
}

// ===========================================================
// ЗАЩИЩЁННЫЕ ОПЕРАЦИИ (Admin/Manager)
// ===========================================================

/**
 * Создать товар. POST /api/battleitem.
 * Требует роль Admin или Manager.
 */
export async function createBattleItem(
  item: Partial<BattleItemDto>,
): Promise<{ isSuccess: boolean; message: string }> {
  const response = await authFetch('/api/battleitem', {
    method: 'POST',
    body: JSON.stringify(item),
  });

  if (response.status === 401) throw new Error('Not authenticated');
  if (response.status === 403) throw new Error('Forbidden — Admin/Manager role required');

  return await response.json();
}

/**
 * Обновить товар. PUT /api/battleitem.
 * Требует роль Admin или Manager.
 */
export async function updateBattleItem(
  item: Partial<BattleItemDto>,
): Promise<{ isSuccess: boolean; message: string }> {
  const response = await authFetch('/api/battleitem', {
    method: 'PUT',
    body: JSON.stringify(item),
  });

  if (response.status === 401) throw new Error('Not authenticated');
  if (response.status === 403) throw new Error('Forbidden — Admin/Manager role required');

  return await response.json();
}

/**
 * Удалить товар. DELETE /api/battleitem/id.
 * Требует роль Admin (Manager не пускает!).
 */
export async function deleteBattleItem(
  id: number,
): Promise<{ isSuccess: boolean; message: string }> {
  const response = await authFetch(`/api/battleitem/id?id=${id}`, {
    method: 'DELETE',
  });

  if (response.status === 401) throw new Error('Not authenticated');
  if (response.status === 403) throw new Error('Forbidden — Admin role required');

  return await response.json();
}