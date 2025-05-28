//
// export interface Message {
//   id: string;
//   senderId: string;
//   content: string;
//   timestamp: string;
//   status: 'sent' | 'delivered' | 'read';
//   isOwn: boolean;
// }
//
// export interface ChatMarker {
//   type: 'follow-up' | 'resolve';
//   timestamp: string;
//   date: string;
// }
//
// export interface Conversation {
//   id: string;
//   user: User;
//   lastMessage?: Message;
//   unreadCount: number;
//   markers?: ChatMarker[];
//   hasFollowUp?: boolean;
// }
//
// export interface QuickMessage {
//   id: string;
//   content: string;
//   category: string;
// }