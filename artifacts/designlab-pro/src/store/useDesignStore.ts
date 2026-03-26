import { create } from 'zustand';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface ColorRoles {
  primary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

interface DesignState {
  theme: 'light' | 'dark';
  device: DeviceType;
  colorRoles: ColorRoles;
  activeTab: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setDevice: (device: DeviceType) => void;
  toggleTheme: () => void;
  setColorRole: (role: keyof ColorRoles, value: string) => void;
  setAllColorRoles: (roles: ColorRoles) => void;
  setActiveTab: (tab: string) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  theme: 'dark',
  device: 'desktop',
  colorRoles: {
    primary: '#6366f1',
    background: '#0a0a0f',
    surface: '#16161f',
    text: '#e2e2f0',
    border: '#1e1e2e'
  },
  activeTab: 'Home Preview',
  setTheme: (theme) => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { theme: newTheme };
  }),
  setDevice: (device) => set({ device }),
  setColorRole: (role, value) => set((state) => ({
    colorRoles: { ...state.colorRoles, [role]: value }
  })),
  setAllColorRoles: (roles) => set({ colorRoles: roles }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
