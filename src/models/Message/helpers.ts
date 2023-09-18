export const getChatId = (userIds: string[]): string => userIds.sort().join('_');
