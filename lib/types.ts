export type Log = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
};

export type ToastType = "success" | "error" | "warn" | "info";

export type ToastTheme = "A" | "B" | "C";

export type AppThemeType = "cyber" | "terminal" | "military";

export type NavTheme = "A" | "B" | "C";