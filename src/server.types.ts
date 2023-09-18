export type AuthResult = {
  token: string;
};

export type SignBody = {
  email: string;
  password: string;
};

export type ChangePasswordBody = {
  password: string;
  newPassword: string;
};

export type ChangePasswordResult = {
  success: boolean;
};

export type UpdateProfileBody = {
  name: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  signUpDate: unknown;
};

export type User = Omit<Profile, 'email' | 'signUpDate'>;

export type Message = {
  id: string;
  author: User;
  chatId: string;
  date: Date;
  content: string;
};

export type SendMessageData = {
  recipientIds: string[];
  authorId: string;
  content: string;
};

export type GetMessagesArgs = {
  userIds: string[];
};
