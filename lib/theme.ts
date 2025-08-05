export const themes = {
  light: {
    // 基础颜色
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
    },
    foreground: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#6b7280',
      muted: '#9ca3af',
    },
    // 边框颜色
    border: {
      default: '#e5e7eb',
      subtle: '#f3f4f6',
    },
    // 按钮颜色
    button: {
      primary: {
        bg: '#111827',
        text: '#ffffff',
        hover: '#1f2937',
      },
      secondary: {
        bg: '#f3f4f6',
        text: '#111827',
        hover: '#e5e7eb',
      },
      ghost: {
        bg: 'transparent',
        text: '#111827',
        hover: '#f3f4f6',
      },
    },
    // 输入框颜色
    input: {
      bg: '#ffffff',
      border: '#e5e7eb',
      placeholder: '#9ca3af',
      focus: '#3b82f6',
    },
    // 卡片颜色
    card: {
      bg: '#ffffff',
      border: '#e5e7eb',
    },
    // 成功/错误/警告颜色
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },
  dark: {
    // 基础颜色
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    foreground: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      tertiary: '#cbd5e1',
      muted: '#94a3b8',
    },
    // 边框颜色
    border: {
      default: '#334155',
      subtle: '#1e293b',
    },
    // 按钮颜色
    button: {
      primary: {
        bg: '#3b82f6',
        text: '#ffffff',
        hover: '#2563eb',
      },
      secondary: {
        bg: '#334155',
        text: '#f8fafc',
        hover: '#475569',
      },
      ghost: {
        bg: 'transparent',
        text: '#f8fafc',
        hover: '#334155',
      },
    },
    // 输入框颜色
    input: {
      bg: '#1e293b',
      border: '#334155',
      placeholder: '#64748b',
      focus: '#3b82f6',
    },
    // 卡片颜色
    card: {
      bg: '#1e293b',
      border: '#334155',
    },
    // 成功/错误/警告颜色
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },
} as const;

export type Theme = typeof themes.light;
export type ThemeName = keyof typeof themes;