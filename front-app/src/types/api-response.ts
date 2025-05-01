export interface ApiResponse {
  status: string;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details: unknown;
  };
}

export interface GuildData extends ApiResponse {
  data: {
    id: string;
    name: string;
    memberCount: number;
    iconUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    channels: GuildChannel[];
    members: GuildMember[];
    roles: GuildRole[];
    ScheduledMessage?: ScheduledMessage[];
  };
}

export interface GuildChannel {
  id: string;
  guildId: string;
  name: string;
  type: string;
  ScheduledMessage?: ScheduledMessage[];
}

export interface GuildMember {
  guildId: string;
  userId: string;
  nickname: string | null;
  joinedAt: Date;
}

export interface GuildRole {
  id: string;
  guildId: string;
  name: string;
  color: string | null;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
}

export interface UserData extends ApiResponse {
  data: {
    id: string;
    username: string;
    discriminator: string | null;
    avatarUrl: string | null;
    money: number;
    lastDraw: Date | null;
    createdAt: Date;
    updatedAt: Date;
    ScheduledMessage?: ScheduledMessage[];
    Omikuji?: Omikuji[];
    CoinFlip?: Coinflip[];
    JankenOpponent?: Janken[];
    JankenChallenger?: Janken[];
  };
}

export interface ScheduledMessage {
  id: string;
  guildId: string;
  channelId: string;
  message: string;
  scheduleTime: string;
  createdUserId: string;
  lastUpdatedUserId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Omikuji {
  id: string;
  userId: string;
  result: number;
  createdAt: Date;
}

export interface Coinflip {
  id: string;
  userId: string;
  bet: number;
  win: boolean;
  updatedMoney: number;
  createdAt: Date;
}

export interface Janken {
  id: string;
  bet: boolean;
  challengerId: string;
  opponentId: string;
  challengerHand: string;
  opponentHand: string;
  challengerBet?: number;
  opponentBet?: number;
  winnerUserId?: string;
  createdAt: Date;
}

// ユーザー一覧レスポンスの型定義
export interface UsersListResponse {
  status: string;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface User {
  id: string;
  username: string;
  discriminator: string | null;
  avatarUrl: string | null;
  money: number;
  lastDraw?: Date;
  createdAt: Date;
  updatedAt: Date;
}
