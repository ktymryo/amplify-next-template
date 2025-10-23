import { cookiesClient } from './server-client';

export async function getBreadcrumbData(itemId: string): Promise<string[]> {
  const { data: item } = await cookiesClient.models.StorageItem.get({ id: itemId });
  
  if (!item) return [];
  
  if (item.parentId) {
    const parentBreadcrumbs = await getBreadcrumbData(item.parentId);
    return [...parentBreadcrumbs, item.name || ''];
  }
  
  return [item.name || ''];
}
