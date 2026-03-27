import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Library as LibraryIcon, ChevronRight, ExternalLink, Copy, Check,
  Terminal, BookOpen, TrendingUp, Users, DollarSign, Activity,
  ShoppingCart, Bell, Settings, Search, Star, Shield, Zap, Package,
  Home, FileText, Image, Mail, Calendar, Map, BarChart3, PieChart,
  Layers, Grid3x3, Heart, MessageSquare, Lock, Unlock, Eye, EyeOff,
  Download, Upload, Trash2, Edit, Plus, Minus, RefreshCw, Share2,
  Bookmark, Flag, Filter, SlidersHorizontal, ToggleLeft, ToggleRight,
  Sun, Moon, Monitor, Smartphone, Tablet, Wifi, WifiOff, Battery, Film,
  Volume2, VolumeX, Mic, MicOff, Camera, Video, Play, Pause,
  SkipBack, SkipForward, ChevronDown, ChevronUp, ChevronLeft,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw,
  Maximize, Minimize, X, Menu, MoreHorizontal, MoreVertical,
  Clipboard, Save, Printer, Link, Unlink, Code, Terminal as TermIcon,
  Database, Server, Cloud, CloudOff, Globe, Navigation, Compass,
  AlertTriangle, AlertCircle, Info, HelpCircle, CheckCircle, XCircle,
  Loader, Clock, Timer, Repeat, Shuffle, Hash, AtSign, Percent,
  CreditCard, Wallet, Receipt, Tag, Tags, Folder, FolderOpen,
  File, Archive, Box, Gift, Award, Trophy, Medal, Crown, Sparkles,
  Flame, Snowflake, Droplet, Wind, Umbrella, ThermometerSun,
  type LucideIcon
} from 'lucide-react';
import { toast } from '@/utils/toastStore';

/* ─── PER-LIBRARY ICON SETS — each lib has unique icons with real naming conventions ─── */
type IconEntry = { Icon: LucideIcon; label: string };
type IconCat = { name: string; icons: IconEntry[] };

const LIBRARY_ICONS: Record<string, IconCat[]> = {
  /* shadcn/ui — uses Lucide naming: lowercase-kebab */
  shadcn: [
    { name: 'Layout', icons: [
      { Icon: Home, label: 'home' }, { Icon: Layers, label: 'layers' }, { Icon: Grid3x3, label: 'grid-3x3' },
      { Icon: Monitor, label: 'monitor' }, { Icon: Smartphone, label: 'smartphone' }, { Icon: Tablet, label: 'tablet' },
      { Icon: Menu, label: 'menu' }, { Icon: SlidersHorizontal, label: 'sliders-horizontal' },
    ]},
    { name: 'Actions', icons: [
      { Icon: Plus, label: 'plus' }, { Icon: X, label: 'x' }, { Icon: Check, label: 'check' },
      { Icon: Edit, label: 'pencil' }, { Icon: Trash2, label: 'trash-2' }, { Icon: Copy, label: 'copy' },
      { Icon: Download, label: 'download' }, { Icon: Upload, label: 'upload' },
    ]},
    { name: 'Feedback', icons: [
      { Icon: AlertTriangle, label: 'alert-triangle' }, { Icon: Info, label: 'info' }, { Icon: CheckCircle, label: 'check-circle' },
      { Icon: XCircle, label: 'x-circle' }, { Icon: Bell, label: 'bell' }, { Icon: Loader, label: 'loader' },
      { Icon: HelpCircle, label: 'help-circle' }, { Icon: Shield, label: 'shield' },
    ]},
    { name: 'Data', icons: [
      { Icon: BarChart3, label: 'bar-chart-3' }, { Icon: TrendingUp, label: 'trending-up' }, { Icon: Activity, label: 'activity' },
      { Icon: PieChart, label: 'pie-chart' }, { Icon: Database, label: 'database' }, { Icon: Cloud, label: 'cloud' },
      { Icon: Server, label: 'server' }, { Icon: Code, label: 'code' },
    ]},
  ],
  /* Material UI — uses PascalCase MUI naming */
  mui: [
    { name: 'Navigation', icons: [
      { Icon: Home, label: 'HomeOutlined' }, { Icon: Menu, label: 'MenuRounded' }, { Icon: ArrowRight, label: 'ArrowForward' },
      { Icon: ArrowLeft, label: 'ArrowBack' }, { Icon: ChevronRight, label: 'ChevronRight' }, { Icon: Search, label: 'SearchOutlined' },
      { Icon: Filter, label: 'FilterList' }, { Icon: MoreVertical, label: 'MoreVert' },
    ]},
    { name: 'Common', icons: [
      { Icon: Star, label: 'StarRate' }, { Icon: Heart, label: 'FavoriteBorder' }, { Icon: Bookmark, label: 'BookmarkBorder' },
      { Icon: Share2, label: 'ShareOutlined' }, { Icon: Settings, label: 'SettingsOutlined' }, { Icon: Bell, label: 'NotificationsNone' },
      { Icon: Mail, label: 'MailOutline' }, { Icon: Calendar, label: 'EventNote' },
    ]},
    { name: 'Data Display', icons: [
      { Icon: BarChart3, label: 'BarChartOutlined' }, { Icon: PieChart, label: 'PieChartOutline' }, { Icon: TrendingUp, label: 'TrendingUp' },
      { Icon: Activity, label: 'Timeline' }, { Icon: Grid3x3, label: 'GridView' }, { Icon: Layers, label: 'LayersOutlined' },
      { Icon: DollarSign, label: 'AttachMoney' }, { Icon: CreditCard, label: 'CreditCardOutlined' },
    ]},
    { name: 'Editor', icons: [
      { Icon: Edit, label: 'EditOutlined' }, { Icon: Save, label: 'SaveOutlined' }, { Icon: Copy, label: 'ContentCopy' },
      { Icon: Trash2, label: 'DeleteOutline' }, { Icon: Plus, label: 'AddCircleOutline' }, { Icon: Minus, label: 'RemoveCircleOutline' },
      { Icon: RotateCw, label: 'Redo' }, { Icon: RotateCcw, label: 'Undo' },
    ]},
    { name: 'Media', icons: [
      { Icon: Image, label: 'ImageOutlined' }, { Icon: Video, label: 'VideoLibrary' }, { Icon: Camera, label: 'CameraAlt' },
      { Icon: Play, label: 'PlayCircleOutline' }, { Icon: Pause, label: 'PauseCircleOutline' }, { Icon: Volume2, label: 'VolumeUp' },
      { Icon: Mic, label: 'MicNone' }, { Icon: Download, label: 'GetApp' },
    ]},
  ],
  /* Ant Design — uses PascalCase + Outlined/Filled/TwoTone */
  antd: [
    { name: 'Direction', icons: [
      { Icon: ArrowUp, label: 'ArrowUpOutlined' }, { Icon: ArrowDown, label: 'ArrowDownOutlined' },
      { Icon: ArrowLeft, label: 'ArrowLeftOutlined' }, { Icon: ArrowRight, label: 'ArrowRightOutlined' },
      { Icon: ChevronUp, label: 'CaretUpFilled' }, { Icon: ChevronDown, label: 'CaretDownFilled' },
      { Icon: RotateCw, label: 'RedoOutlined' }, { Icon: RotateCcw, label: 'UndoOutlined' },
    ]},
    { name: 'Suggestion', icons: [
      { Icon: CheckCircle, label: 'CheckCircleTwoTone' }, { Icon: XCircle, label: 'CloseCircleTwoTone' },
      { Icon: AlertCircle, label: 'ExclamationCircleTwoTone' }, { Icon: Info, label: 'InfoCircleTwoTone' },
      { Icon: AlertTriangle, label: 'WarningTwoTone' }, { Icon: HelpCircle, label: 'QuestionCircleTwoTone' },
      { Icon: Flag, label: 'FlagTwoTone' }, { Icon: Bell, label: 'BellTwoTone' },
    ]},
    { name: 'Application', icons: [
      { Icon: Settings, label: 'SettingOutlined' }, { Icon: Users, label: 'TeamOutlined' },
      { Icon: ShoppingCart, label: 'ShoppingCartOutlined' }, { Icon: DollarSign, label: 'DollarCircleOutlined' },
      { Icon: Calendar, label: 'CalendarOutlined' }, { Icon: Clock, label: 'ClockCircleOutlined' },
      { Icon: Cloud, label: 'CloudOutlined' }, { Icon: Database, label: 'DatabaseOutlined' },
    ]},
    { name: 'File & Edit', icons: [
      { Icon: File, label: 'FileOutlined' }, { Icon: FileText, label: 'FileTextOutlined' },
      { Icon: Folder, label: 'FolderOutlined' }, { Icon: FolderOpen, label: 'FolderOpenOutlined' },
      { Icon: Copy, label: 'CopyOutlined' }, { Icon: Edit, label: 'EditOutlined' },
      { Icon: Save, label: 'SaveOutlined' }, { Icon: Trash2, label: 'DeleteOutlined' },
    ]},
  ],
  /* Chakra UI — uses PascalCase React-style */
  chakra: [
    { name: 'Interface', icons: [
      { Icon: Sun, label: 'SunIcon' }, { Icon: Moon, label: 'MoonIcon' }, { Icon: Search, label: 'SearchIcon' },
      { Icon: Plus, label: 'AddIcon' }, { Icon: Minus, label: 'MinusIcon' }, { Icon: X, label: 'CloseIcon' },
      { Icon: Check, label: 'CheckIcon' }, { Icon: Settings, label: 'SettingsIcon' },
    ]},
    { name: 'Arrows', icons: [
      { Icon: ArrowUp, label: 'ArrowUpIcon' }, { Icon: ArrowDown, label: 'ArrowDownIcon' },
      { Icon: ArrowLeft, label: 'ArrowBackIcon' }, { Icon: ArrowRight, label: 'ArrowForwardIcon' },
      { Icon: ChevronDown, label: 'ChevronDownIcon' }, { Icon: ChevronUp, label: 'ChevronUpIcon' },
      { Icon: ChevronLeft, label: 'ChevronLeftIcon' }, { Icon: ChevronRight, label: 'ChevronRightIcon' },
    ]},
    { name: 'Status', icons: [
      { Icon: AlertTriangle, label: 'WarningIcon' }, { Icon: AlertCircle, label: 'WarningTwoIcon' },
      { Icon: Info, label: 'InfoIcon' }, { Icon: HelpCircle, label: 'QuestionIcon' },
      { Icon: Bell, label: 'BellIcon' }, { Icon: Lock, label: 'LockIcon' },
      { Icon: Unlock, label: 'UnlockIcon' }, { Icon: Eye, label: 'ViewIcon' },
    ]},
    { name: 'Media & Social', icons: [
      { Icon: Star, label: 'StarIcon' }, { Icon: Heart, label: 'HeartIcon' },
      { Icon: Mail, label: 'EmailIcon' }, { Icon: Link, label: 'LinkIcon' },
      { Icon: ExternalLink, label: 'ExternalLinkIcon' }, { Icon: Download, label: 'DownloadIcon' },
      { Icon: Copy, label: 'CopyIcon' }, { Icon: Edit, label: 'EditIcon' },
    ]},
  ],
  /* Mantine — uses Tabler naming: IconName */
  mantine: [
    { name: 'System', icons: [
      { Icon: Home, label: 'IconHome' }, { Icon: Settings, label: 'IconSettings' }, { Icon: Users, label: 'IconUsers' },
      { Icon: Bell, label: 'IconBell' }, { Icon: Search, label: 'IconSearch' }, { Icon: Menu, label: 'IconMenu2' },
      { Icon: Globe, label: 'IconWorld' }, { Icon: Shield, label: 'IconShield' },
    ]},
    { name: 'Editing', icons: [
      { Icon: Edit, label: 'IconEdit' }, { Icon: Trash2, label: 'IconTrash' }, { Icon: Plus, label: 'IconPlus' },
      { Icon: Copy, label: 'IconCopy' }, { Icon: Save, label: 'IconDeviceFloppy' }, { Icon: Download, label: 'IconDownload' },
      { Icon: Upload, label: 'IconUpload' }, { Icon: RefreshCw, label: 'IconRefresh' },
    ]},
    { name: 'Charts', icons: [
      { Icon: BarChart3, label: 'IconChartBar' }, { Icon: PieChart, label: 'IconChartPie' },
      { Icon: TrendingUp, label: 'IconTrendingUp' }, { Icon: Activity, label: 'IconActivity' },
      { Icon: Database, label: 'IconDatabase' }, { Icon: Server, label: 'IconServer' },
      { Icon: Cloud, label: 'IconCloud' }, { Icon: Code, label: 'IconCode' },
    ]},
    { name: 'Communication', icons: [
      { Icon: Mail, label: 'IconMail' }, { Icon: MessageSquare, label: 'IconMessage' },
      { Icon: Heart, label: 'IconHeart' }, { Icon: Star, label: 'IconStar' },
      { Icon: Bookmark, label: 'IconBookmark' }, { Icon: Share2, label: 'IconShare' },
      { Icon: Camera, label: 'IconCamera' }, { Icon: Image, label: 'IconPhoto' },
    ]},
  ],
  /* Radix UI — uses PascalCase + Icon suffix */
  radix: [
    { name: 'Arrows', icons: [
      { Icon: ArrowUp, label: 'ArrowTopIcon' }, { Icon: ArrowDown, label: 'ArrowBottomIcon' },
      { Icon: ArrowLeft, label: 'ArrowLeftIcon' }, { Icon: ArrowRight, label: 'ArrowRightIcon' },
      { Icon: ChevronUp, label: 'ChevronUpIcon' }, { Icon: ChevronDown, label: 'ChevronDownIcon' },
      { Icon: RotateCw, label: 'UpdateIcon' }, { Icon: RotateCcw, label: 'CounterClockwiseIcon' },
    ]},
    { name: 'Components', icons: [
      { Icon: Check, label: 'CheckIcon' }, { Icon: X, label: 'Cross2Icon' },
      { Icon: Plus, label: 'PlusIcon' }, { Icon: Minus, label: 'MinusIcon' },
      { Icon: Settings, label: 'GearIcon' }, { Icon: Maximize, label: 'EnterFullScreenIcon' },
      { Icon: Minimize, label: 'ExitFullScreenIcon' }, { Icon: Eye, label: 'EyeOpenIcon' },
    ]},
    { name: 'Design', icons: [
      { Icon: Sun, label: 'SunIcon' }, { Icon: Moon, label: 'MoonIcon' },
      { Icon: Layers, label: 'LayersIcon' }, { Icon: Grid3x3, label: 'DashboardIcon' },
      { Icon: SlidersHorizontal, label: 'MixerHorizontalIcon' }, { Icon: Image, label: 'ImageIcon' },
      { Icon: Code, label: 'CodeIcon' }, { Icon: Globe, label: 'GlobeIcon' },
    ]},
  ],
  /* Bootstrap — uses bi- prefix */
  bootstrap: [
    { name: 'General', icons: [
      { Icon: Home, label: 'bi-house' }, { Icon: Search, label: 'bi-search' }, { Icon: Bell, label: 'bi-bell' },
      { Icon: Settings, label: 'bi-gear' }, { Icon: Users, label: 'bi-people' }, { Icon: Star, label: 'bi-star' },
      { Icon: Heart, label: 'bi-heart' }, { Icon: Shield, label: 'bi-shield' },
    ]},
    { name: 'Content', icons: [
      { Icon: File, label: 'bi-file-earmark' }, { Icon: FileText, label: 'bi-file-text' },
      { Icon: Folder, label: 'bi-folder' }, { Icon: Image, label: 'bi-image' },
      { Icon: Camera, label: 'bi-camera' }, { Icon: Film, label: 'bi-film' },
      { Icon: Calendar, label: 'bi-calendar' }, { Icon: Clock, label: 'bi-clock' },
    ]},
    { name: 'Interfaces', icons: [
      { Icon: Plus, label: 'bi-plus-lg' }, { Icon: Minus, label: 'bi-dash-lg' },
      { Icon: X, label: 'bi-x-lg' }, { Icon: Check, label: 'bi-check-lg' },
      { Icon: Edit, label: 'bi-pencil' }, { Icon: Trash2, label: 'bi-trash' },
      { Icon: Download, label: 'bi-download' }, { Icon: Upload, label: 'bi-upload' },
    ]},
    { name: 'Commerce', icons: [
      { Icon: ShoppingCart, label: 'bi-cart' }, { Icon: CreditCard, label: 'bi-credit-card' },
      { Icon: DollarSign, label: 'bi-currency-dollar' }, { Icon: Gift, label: 'bi-gift' },
      { Icon: Receipt, label: 'bi-receipt' }, { Icon: Tag, label: 'bi-tag' },
      { Icon: Box, label: 'bi-box' }, { Icon: Package, label: 'bi-archive' },
    ]},
    { name: 'Alerts', icons: [
      { Icon: AlertTriangle, label: 'bi-exclamation-triangle' }, { Icon: Info, label: 'bi-info-circle' },
      { Icon: CheckCircle, label: 'bi-check-circle' }, { Icon: XCircle, label: 'bi-x-circle' },
      { Icon: AlertCircle, label: 'bi-exclamation-circle' }, { Icon: HelpCircle, label: 'bi-question-circle' },
      { Icon: Flag, label: 'bi-flag' }, { Icon: Bookmark, label: 'bi-bookmark' },
    ]},
  ],
  /* Fluent UI — uses PascalCase + Regular/Filled */
  fluent: [
    { name: 'Navigation', icons: [
      { Icon: Home, label: 'HomeRegular' }, { Icon: Search, label: 'SearchRegular' },
      { Icon: Menu, label: 'NavigationRegular' }, { Icon: Settings, label: 'SettingsRegular' },
      { Icon: ArrowLeft, label: 'ArrowLeftRegular' }, { Icon: ArrowRight, label: 'ArrowRightRegular' },
      { Icon: Globe, label: 'GlobeRegular' }, { Icon: Filter, label: 'FilterRegular' },
    ]},
    { name: 'Communication', icons: [
      { Icon: Mail, label: 'MailRegular' }, { Icon: MessageSquare, label: 'ChatRegular' },
      { Icon: Bell, label: 'AlertRegular' }, { Icon: Users, label: 'PeopleRegular' },
      { Icon: Calendar, label: 'CalendarLtrRegular' }, { Icon: Video, label: 'VideoRegular' },
      { Icon: Mic, label: 'MicRegular' }, { Icon: Share2, label: 'ShareRegular' },
    ]},
    { name: 'Content', icons: [
      { Icon: File, label: 'DocumentRegular' }, { Icon: Folder, label: 'FolderRegular' },
      { Icon: Image, label: 'ImageRegular' }, { Icon: Edit, label: 'EditRegular' },
      { Icon: Save, label: 'SaveRegular' }, { Icon: Copy, label: 'CopyRegular' },
      { Icon: Trash2, label: 'DeleteRegular' }, { Icon: Clipboard, label: 'ClipboardRegular' },
    ]},
    { name: 'Status', icons: [
      { Icon: CheckCircle, label: 'CheckmarkCircleRegular' }, { Icon: XCircle, label: 'DismissCircleRegular' },
      { Icon: AlertTriangle, label: 'WarningRegular' }, { Icon: Info, label: 'InfoRegular' },
      { Icon: Shield, label: 'ShieldRegular' }, { Icon: Lock, label: 'LockClosedRegular' },
      { Icon: Eye, label: 'EyeRegular' }, { Icon: EyeOff, label: 'EyeOffRegular' },
    ]},
  ],
  /* DaisyUI — uses Heroicons naming */
  daisyui: [
    { name: 'Outline', icons: [
      { Icon: Home, label: 'HomeIcon' }, { Icon: Users, label: 'UsersIcon' },
      { Icon: ShoppingCart, label: 'ShoppingCartIcon' }, { Icon: Heart, label: 'HeartIcon' },
      { Icon: Star, label: 'StarIcon' }, { Icon: Bell, label: 'BellIcon' },
      { Icon: Globe, label: 'GlobeAltIcon' }, { Icon: Search, label: 'MagnifyingGlassIcon' },
    ]},
    { name: 'Solid', icons: [
      { Icon: Plus, label: 'PlusCircleIcon' }, { Icon: Minus, label: 'MinusCircleIcon' },
      { Icon: Check, label: 'CheckCircleIcon' }, { Icon: X, label: 'XCircleIcon' },
      { Icon: AlertTriangle, label: 'ExclamationTriangleIcon' }, { Icon: Info, label: 'InformationCircleIcon' },
      { Icon: Lock, label: 'LockClosedIcon' }, { Icon: Unlock, label: 'LockOpenIcon' },
    ]},
    { name: 'Mini', icons: [
      { Icon: ArrowUp, label: 'ArrowUpMini' }, { Icon: ArrowDown, label: 'ArrowDownMini' },
      { Icon: ChevronLeft, label: 'ChevronLeftMini' }, { Icon: ChevronRight, label: 'ChevronRightMini' },
      { Icon: Settings, label: 'Cog6ToothIcon' }, { Icon: Trash2, label: 'TrashIcon' },
      { Icon: Edit, label: 'PencilSquareIcon' }, { Icon: Share2, label: 'ShareIcon' },
    ]},
  ],
  /* Naive UI — uses Ionicons naming */
  naive: [
    { name: 'General', icons: [
      { Icon: Home, label: 'home-outline' }, { Icon: Search, label: 'search-outline' },
      { Icon: Settings, label: 'settings-outline' }, { Icon: Bell, label: 'notifications-outline' },
      { Icon: Users, label: 'people-outline' }, { Icon: Mail, label: 'mail-outline' },
      { Icon: Star, label: 'star-outline' }, { Icon: Heart, label: 'heart-outline' },
    ]},
    { name: 'Interface', icons: [
      { Icon: Plus, label: 'add-outline' }, { Icon: Minus, label: 'remove-outline' },
      { Icon: X, label: 'close-outline' }, { Icon: Check, label: 'checkmark-outline' },
      { Icon: Edit, label: 'create-outline' }, { Icon: Trash2, label: 'trash-outline' },
      { Icon: Download, label: 'download-outline' }, { Icon: Share2, label: 'share-outline' },
    ]},
    { name: 'Data', icons: [
      { Icon: BarChart3, label: 'bar-chart-outline' }, { Icon: PieChart, label: 'pie-chart-outline' },
      { Icon: TrendingUp, label: 'trending-up-outline' }, { Icon: Globe, label: 'globe-outline' },
      { Icon: Cloud, label: 'cloud-outline' }, { Icon: Code, label: 'code-outline' },
      { Icon: Folder, label: 'folder-outline' }, { Icon: File, label: 'document-outline' },
    ]},
  ],
};

/* ─── LIBRARY DATA ─── */
const LIBRARIES = [
  {
    name: 'shadcn/ui', slug: 'shadcn', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAAAUElEQVR4Ae3RAQbAQAxE0QXYM4e5Ro7zrxQUgJRCoFCiaPMO8A2zxnhKErAamVlmuvsUf1vcewPNG49LczEiPlmU1FUswO3XVewC1NcvG+MEvqR7x4wP3WYAAAAASUVORK5CYII=', logoColor: '#fff', logoBg: '#18181b',
    desc: 'Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste components you own.',
    website: 'https://ui.shadcn.com', github: 'https://github.com/shadcn-ui/ui',
    installSteps: ['npx shadcn-ui@latest init', 'npx shadcn-ui@latest add button', 'npx shadcn-ui@latest add card'],
    features: ['Copy-paste components', 'Full ownership', 'Tailwind CSS', 'Radix primitives', 'Dark mode', 'TypeScript'],
    tokens: { primary: '#18181b', primaryFg: '#fff', secondary: '#f4f4f5', accent: '#18181b', radius: '8px', border: '#e4e4e7', bg: '#ffffff', surface: '#fafafa', text: '#09090b', textMuted: '#71717a', font: 'Inter', shadow: '0 1px 3px rgba(0,0,0,.1)' },
    stats: { stars: '74k', weekly: '280k', version: '2.1' },
    iconPack: 'Lucide React', iconCount: '1500+',
  },
  {
    name: 'Material UI', slug: 'mui', logo: 'https://img.icons8.com/color/48/material-ui.png', logoColor: '#fff', logoBg: '#1976d2',
    desc: "Google's Material Design in React. The world's most popular React UI framework.",
    website: 'https://mui.com', github: 'https://github.com/mui/material-ui',
    installSteps: ['npm install @mui/material @emotion/react @emotion/styled', 'npm install @mui/icons-material', 'import { Button } from "@mui/material"'],
    features: ['Material Design 3', 'Theming engine', 'CSS-in-JS', 'Tree-shaking', '2000+ icons', 'Enterprise ready'],
    tokens: { primary: '#1976d2', primaryFg: '#fff', secondary: '#f5f5f5', accent: '#9c27b0', radius: '4px', border: '#e0e0e0', bg: '#ffffff', surface: '#fafafa', text: '#212121', textMuted: '#757575', font: 'Roboto', shadow: '0 2px 4px rgba(0,0,0,.12)' },
    stats: { stars: '94k', weekly: '3.8M', version: '6.1' },
    iconPack: '@mui/icons-material', iconCount: '2100+',
  },
  {
    name: 'Ant Design', slug: 'antd', logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg', logoColor: '#fff', logoBg: '#1677ff',
    desc: 'Enterprise-class UI from Alibaba. Ideal for rich, interactive enterprise applications.',
    website: 'https://ant.design', github: 'https://github.com/ant-design/ant-design',
    installSteps: ['npm install antd', "import { Button } from 'antd'", "import 'antd/dist/reset.css'"],
    features: ['Enterprise grade', 'Design tokens', '60+ components', 'i18n support', 'TypeScript', 'Form system'],
    tokens: { primary: '#1677ff', primaryFg: '#fff', secondary: '#f0f5ff', accent: '#722ed1', radius: '6px', border: '#d9d9d9', bg: '#ffffff', surface: '#fafafa', text: '#000000e0', textMuted: '#00000073', font: '-apple-system, BlinkMacSystemFont', shadow: '0 6px 16px rgba(0,0,0,.08)' },
    stats: { stars: '92k', weekly: '1.3M', version: '5.21' },
    iconPack: '@ant-design/icons', iconCount: '800+',
  },
  {
    name: 'Chakra UI', slug: 'chakra', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAY1BMVEVHcEwnnKYPxqsrlaUdragbs6kB3K4bsqkbsakG1K0jpqcZtakVv6otkqUMyqwZtakrlqULzawPxqsjpKcpmaYF060C264rlqUmnaYQw6sMyawWuaoipqcJz6wvj6UTv6ozh6Oj1BR7AAAAF3RSTlMAhru9vSP7Ggv+MPU/5YrsZNhh46CbcFHBA2IAAAErSURBVCiRjdLZsoMgDABQEEGggOBS9+X/v/KaUCnO9OGGxzMZshHyj5BVFvJpnLISo4Bw/GFsHNd1relrOaZp3opc6YDYyTri5r5mLGKrEwaTiukGRCoTqv4uylvEkpOEQjV3NTtg68kXlYg1SX8isuqLSgnxBtRsB4TELFOJoKGNE7HDChpXhCNmiqsdbRGtvseoTePCBqpJd56g9DFNGNgy96SflnUc7GPWfhj2K4cSI4TapuAaw+9t8KvvfT/hJ6eU2uZ5eoXSxc7piAg/6aA2wONYlhpyTYvIoET5jpmALwmTHhF9/KJ4oG8R2WelzZZhVa6A1t8r6zOkK2KXejMhoW4RbVo2ke7G6koEzAfGiw/SGhHWl6mDk4zXWTL6OE3YBr/e76P+HX/KeyP6QEK3CwAAAABJRU5ErkJggg==', logoColor: '#fff', logoBg: '#319795',
    desc: 'Simple, modular and accessible component library for React applications.',
    website: 'https://chakra-ui.com', github: 'https://github.com/chakra-ui/chakra-ui',
    installSteps: ['npm install @chakra-ui/react @emotion/react', 'Wrap app with <ChakraProvider>', "import { Button } from '@chakra-ui/react'"],
    features: ['Accessible', 'Themeable', 'Composable', 'Dark mode', 'Style props', 'Developer DX'],
    tokens: { primary: '#3182ce', primaryFg: '#fff', secondary: '#edf2f7', accent: '#805ad5', radius: '6px', border: '#e2e8f0', bg: '#ffffff', surface: '#f7fafc', text: '#1a202c', textMuted: '#718096', font: 'system-ui', shadow: '0 4px 6px rgba(0,0,0,.07)' },
    stats: { stars: '38k', weekly: '560k', version: '3.2' },
    iconPack: 'Chakra Icons + react-icons', iconCount: '1000+',
  },
  {
    name: 'Mantine', slug: 'mantine', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX////P4/qdyPZxsvNPpPEzmvD0+f6RwvUZk+8clO8mlu8tmPChyvcNke8ymvDu9f3b6vvJ4Pp9uPTo8f1JofHC3PkAi+6y0/jw9v262PmKvvVqr/NrLSs8AAABGElEQVR4AYWTBRLDMAwEL4lJUqyU8f/vLNeVp4EdMogBhqbtnPeuaxuMEGIiFvFehIliQA36zOoLyrmv1R2pr1ByxsjA4v8QHoq+qB9B5WvDiR9F3Cc+Ki9Uh0KvSEP+Poqs1iT6k9EcAEQuBjbAdvegmOQIwFil9aekVJJ9XYzJt8Q2FZUGLdvMUkDoNirFR4tOfLmlTBFwpmzSwVnp4ASVTXHQcskA9gfgyN5gBNIJ6A+hFlBb5925TQT0lQsbpGfmDaoX6eo0fV4hHBJ5E7gtlE8RT/ZkClWV+oIXp2RKbZt1fV5jbHemWbbd6gBHzGzbXQ2MMsn/wNiR09GRQ2D1IwiHMvYyNvYyLC/O8uoZQqTR5V1c/zu9URUVRTPTLgAAAABJRU5ErkJggg==', logoColor: '#fff', logoBg: '#339af0',
    desc: 'Fully featured React library with 100+ customizable components and 50+ hooks.',
    website: 'https://mantine.dev', github: 'https://github.com/mantinedev/mantine',
    installSteps: ['npm install @mantine/core @mantine/hooks', 'Wrap app with <MantineProvider>', "import { Button } from '@mantine/core'"],
    features: ['100+ components', '50+ hooks', 'Form library', 'Notifications', 'Rich text editor', 'Date pickers'],
    tokens: { primary: '#228be6', primaryFg: '#fff', secondary: '#f1f3f5', accent: '#7950f2', radius: '4px', border: '#ced4da', bg: '#ffffff', surface: '#f8f9fa', text: '#212529', textMuted: '#868e96', font: 'system-ui', shadow: '0 1px 3px rgba(0,0,0,.05)' },
    stats: { stars: '27k', weekly: '350k', version: '7.14' },
    iconPack: 'Tabler Icons', iconCount: '4500+',
  },
  {
    name: 'Radix UI', slug: 'radix', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEX///+4ubkAAAYcICQABw+en6C8vb5qbG8vMjY2OT1zdXjHyMnp6ekHEBYNExgZHSEUGB2Ji4zz8/MVGh+mpqfQ0dFHSk1VWFrW19iys7QhJirBwcKqq6xPUlRfYmSTlJYAAAsAAAAmKi+Bg4Q+QkWgLj4NAAAA10lEQVR4AZ3SBXLEMAxAUWVNQcsQZrr/GTvLrE77hwwvHDgWHNglLgBAqjCKE7j2CtI404jaWPcFWIPHEXrxEeRFac5DU9UfQcPwPMS2+wh6fR1n8n9nqAdzHuqx/vwU0/UEPXwAs4B0WI7vYYndHTTL4djM+XJ6kyNbVQJ/LxUqWib4lkuiRftZwJdq6831a37cHzUyArjNI6OAjDyjgNsyRoKi9DToGNIg4IwGMvsFdC3SoBg8DZzVNIBu9zRwFpEEkMYGSQBu0oYAx+qd/GGOBduwvoEf0Z0O6TBr0qwAAAAASUVORK5CYII=', logoColor: '#fff', logoBg: '#6e56cf',
    desc: 'Unstyled, accessible components for building high-quality design systems.',
    website: 'https://radix-ui.com', github: 'https://github.com/radix-ui/primitives',
    installSteps: ['npm install @radix-ui/react-dialog', 'npm install @radix-ui/react-dropdown-menu', 'Style with your own CSS/Tailwind'],
    features: ['Unstyled', 'WAI-ARIA', 'Composable', 'Incremental adoption', 'SSR ready', 'Animations'],
    tokens: { primary: '#6e56cf', primaryFg: '#fff', secondary: '#f5f2ff', accent: '#e54666', radius: '6px', border: '#e5e8eb', bg: '#ffffff', surface: '#faf9fb', text: '#1c2024', textMuted: '#60646c', font: 'system-ui', shadow: '0 2px 10px rgba(0,0,0,.07)' },
    stats: { stars: '16k', weekly: '8.5M', version: '1.2' },
    iconPack: 'Radix Icons', iconCount: '300+',
  },
  {
    name: 'Bootstrap 5', slug: 'bootstrap', logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow@2x.png', logoColor: '#fff', logoBg: '#7952b3',
    desc: "The world's most popular framework for responsive, mobile-first websites.",
    website: 'https://getbootstrap.com', github: 'https://github.com/twbs/bootstrap',
    installSteps: ['npm install bootstrap react-bootstrap', "import 'bootstrap/dist/css/bootstrap.min.css'", "import { Button } from 'react-bootstrap'"],
    features: ['Responsive grid', 'Sass variables', 'JS plugins', 'Utility classes', 'Themeable', 'RTL support'],
    tokens: { primary: '#0d6efd', primaryFg: '#fff', secondary: '#e9ecef', accent: '#6f42c1', radius: '6px', border: '#dee2e6', bg: '#ffffff', surface: '#f8f9fa', text: '#212529', textMuted: '#6c757d', font: 'system-ui', shadow: '0 0.5rem 1rem rgba(0,0,0,.15)' },
    stats: { stars: '171k', weekly: '4.1M', version: '5.3' },
    iconPack: 'Bootstrap Icons', iconCount: '2000+',
  },
  {
    name: 'Fluent UI', slug: 'fluent', logo: 'data:image/svg+xml,<svg width="163" height="29" viewBox="0 0 163 29" fill="none" xmlns="http://www.w3.org/2000/svg">%0A<path d="M8.17362 0.173779L0.678882 4.36611C0.259079 4.60094 0 5.03796 0 5.51127V23.7645C0 24.2378 0.25908 24.6748 0.678882 24.9096L7.83414 28.9121C8.28326 29.1633 8.84208 28.8459 8.84208 28.3395V19.5839L16.6606 15.2105C17.1131 14.9573 17.1131 14.3185 16.6606 14.0653L8.84208 9.69188L16.6606 5.31844C17.1131 5.06528 17.1131 4.42645 16.6606 4.17328L9.51054 0.173779C9.09635 -0.0579263 8.58781 -0.0579263 8.17362 0.173779Z" fill="%23242424"/>%0A<path d="M36.7578 11.8516H32.8047V14.6016H36.4375V16.6484H32.8047V21H30.2812V9.79688H36.7578V11.8516ZM38.2072 21V9.15625H40.6759V21H38.2072ZM50.1956 21H47.7347V19.7812H47.6956C47.3935 20.25 47.0368 20.6042 46.6253 20.8438C46.2191 21.0781 45.7607 21.1953 45.2503 21.1953C44.3232 21.1953 43.6279 20.9141 43.1644 20.3516C42.7008 19.7891 42.4691 18.9479 42.4691 17.8281V13H44.93V17.6094C44.93 18.1719 45.042 18.5964 45.2659 18.8828C45.4899 19.1641 45.8258 19.3047 46.2738 19.3047C46.7165 19.3047 47.0706 19.151 47.3363 18.8438C47.6019 18.5312 47.7347 18.1094 47.7347 17.5781V13H50.1956V21ZM59.3091 17.7031H54.0903C54.132 18.2812 54.3247 18.7109 54.6684 18.9922C55.0174 19.2734 55.4966 19.4141 56.1059 19.4141C56.3351 19.4141 56.6502 19.3464 57.0513 19.2109C57.4575 19.0703 57.8507 18.8516 58.2309 18.5547L59.3247 19.9531C58.7778 20.3854 58.2153 20.7005 57.6372 20.8984C57.0591 21.0964 56.421 21.1953 55.7231 21.1953C54.4315 21.1953 53.4289 20.8385 52.7153 20.125C52.0018 19.4062 51.645 18.4062 51.645 17.125C51.645 15.849 52.0226 14.8099 52.7778 14.0078C53.533 13.2057 54.4888 12.8047 55.645 12.8047C56.7544 12.8047 57.6424 13.1406 58.3091 13.8125C58.9757 14.4792 59.3091 15.4505 59.3091 16.7266V17.7031ZM57.02 16.1875C57.02 15.5677 56.9028 15.1276 56.6684 14.8672C56.4393 14.6016 56.0929 14.4688 55.6294 14.4688C55.2335 14.4688 54.8898 14.6224 54.5981 14.9297C54.3117 15.237 54.1372 15.6562 54.0747 16.1875H57.02ZM68.3444 21H65.8834V16.5547C65.8834 15.9349 65.7715 15.4714 65.5475 15.1641C65.3288 14.8516 64.998 14.6953 64.5553 14.6953C64.1282 14.6953 63.7767 14.8594 63.5006 15.1875C63.2246 15.5156 63.0866 15.9323 63.0866 16.4375V21H60.6178V13H63.0866V14.2656H63.1178C63.4147 13.776 63.7767 13.4115 64.2038 13.1719C64.6308 12.9271 65.1256 12.8047 65.6881 12.8047C66.5735 12.8047 67.2376 13.0807 67.6803 13.6328C68.123 14.1797 68.3444 15.0026 68.3444 16.1016V21ZM75.1453 20.875C74.8953 20.9792 74.6141 21.0573 74.3016 21.1094C73.9943 21.1667 73.6818 21.1953 73.3641 21.1953C72.4891 21.1953 71.8302 20.9844 71.3875 20.5625C70.9448 20.1406 70.7234 19.5104 70.7234 18.6719V14.8203H69.4266V13H70.7234V11.0625L73.1844 10.3594V13H74.9813V14.8203H73.1844V18.5156C73.1844 18.8229 73.2443 19.0469 73.3641 19.1875C73.4839 19.3229 73.6766 19.3906 73.9422 19.3906C74.0724 19.3906 74.1974 19.375 74.3172 19.3438C74.437 19.3073 74.5516 19.263 74.6609 19.2109L75.1453 20.875ZM89.8566 16.1484C89.8566 17.8307 89.4633 19.0938 88.6769 19.9375C87.8956 20.776 86.7211 21.1953 85.1534 21.1953C83.6326 21.1953 82.492 20.7865 81.7316 19.9688C80.9711 19.1458 80.5909 17.9036 80.5909 16.2422V9.79688H83.1222V16.2969C83.1222 17.2031 83.2993 17.8828 83.6534 18.3359C84.0076 18.7891 84.5389 19.0156 85.2472 19.0156C85.9451 19.0156 86.4659 18.7969 86.8097 18.3594C87.1586 17.9219 87.3331 17.2656 87.3331 16.3906V9.79688H89.8566V16.1484ZM94.6653 21H92.1419V9.79688H94.6653V21ZM110.423 21H107.572L106.08 18.2422C105.84 17.7943 105.598 17.4557 105.353 17.2266C105.114 16.9974 104.838 16.8672 104.525 16.8359H103.845V21H101.322V9.79688H105.322C106.681 9.79688 107.699 10.0625 108.377 10.5938C109.059 11.1198 109.4 11.9115 109.4 12.9688C109.4 13.7135 109.181 14.3568 108.744 14.8984C108.306 15.4349 107.707 15.8307 106.947 16.0859V16.1172C107.28 16.2214 107.59 16.4401 107.877 16.7734C108.168 17.1068 108.416 17.4531 108.619 17.8125L110.423 21ZM103.845 11.6875V14.9297H104.939C105.486 14.9297 105.923 14.7656 106.252 14.4375C106.58 14.1094 106.744 13.7031 106.744 13.2188C106.744 12.7083 106.598 12.3255 106.306 12.0703C106.015 11.8151 105.574 11.6875 104.986 11.6875H103.845ZM118.154 17.7031H112.935C112.977 18.2812 113.17 18.7109 113.513 18.9922C113.862 19.2734 114.342 19.4141 114.951 19.4141C115.18 19.4141 115.495 19.3464 115.896 19.2109C116.302 19.0703 116.696 18.8516 117.076 18.5547L118.17 19.9531C117.623 20.3854 117.06 20.7005 116.482 20.8984C115.904 21.0964 115.266 21.1953 114.568 21.1953C113.276 21.1953 112.274 20.8385 111.56 20.125C110.847 19.4062 110.49 18.4062 110.49 17.125C110.49 15.849 110.868 14.8099 111.623 14.0078C112.378 13.2057 113.334 12.8047 114.49 12.8047C115.599 12.8047 116.487 13.1406 117.154 13.8125C117.821 14.4792 118.154 15.4505 118.154 16.7266V17.7031ZM115.865 16.1875C115.865 15.5677 115.748 15.1276 115.513 14.8672C115.284 14.6016 114.938 14.4688 114.474 14.4688C114.079 14.4688 113.735 14.6224 113.443 14.9297C113.157 15.237 112.982 15.6562 112.92 16.1875H115.865ZM126.119 21H123.783V19.8516H123.752C123.486 20.2995 123.153 20.6354 122.752 20.8594C122.356 21.0833 121.906 21.1953 121.4 21.1953C120.708 21.1953 120.111 20.9844 119.611 20.5625C119.116 20.1354 118.869 19.5391 118.869 18.7734C118.869 18.0339 119.114 17.4297 119.603 16.9609C120.098 16.4922 120.869 16.1875 121.916 16.0469L123.799 15.7969V15.6406C123.799 15.2604 123.676 14.974 123.432 14.7812C123.187 14.5833 122.848 14.4844 122.416 14.4844C122.088 14.4844 121.721 14.5391 121.314 14.6484C120.913 14.7578 120.504 14.9323 120.088 15.1719L119.252 13.7109C119.799 13.3932 120.34 13.1641 120.877 13.0234C121.419 12.8776 122.007 12.8047 122.643 12.8047C123.835 12.8047 124.713 13.0885 125.275 13.6562C125.838 14.224 126.119 15.0781 126.119 16.2188V21ZM123.799 17.75V17.2109L122.346 17.3984C121.945 17.4505 121.643 17.5729 121.439 17.7656C121.241 17.9531 121.143 18.1927 121.143 18.4844C121.143 18.7656 121.239 18.9974 121.432 19.1797C121.629 19.3568 121.895 19.4453 122.228 19.4453C122.692 19.4453 123.07 19.2865 123.361 18.9688C123.653 18.6458 123.799 18.2396 123.799 17.75ZM134.342 20.5C133.92 20.7396 133.501 20.9141 133.084 21.0234C132.673 21.138 132.222 21.1953 131.732 21.1953C130.378 21.1953 129.324 20.8229 128.568 20.0781C127.813 19.3333 127.436 18.3724 127.436 17.1953C127.436 15.8359 127.837 14.7656 128.639 13.9844C129.446 13.1979 130.514 12.8047 131.842 12.8047C132.347 12.8047 132.787 12.8542 133.162 12.9531C133.537 13.0469 133.917 13.2005 134.303 13.4141L133.389 15.0703C133.149 14.9401 132.915 14.8464 132.686 14.7891C132.462 14.7266 132.214 14.6953 131.943 14.6953C131.318 14.6953 130.829 14.8984 130.475 15.3047C130.121 15.7109 129.943 16.2865 129.943 17.0312C129.943 17.7448 130.141 18.3021 130.537 18.7031C130.933 19.1042 131.412 19.3047 131.975 19.3047C132.126 19.3047 132.331 19.2708 132.592 19.2031C132.857 19.1302 133.126 19.0156 133.397 18.8594L134.342 20.5ZM140.44 20.875C140.19 20.9792 139.908 21.0573 139.596 21.1094C139.289 21.1667 138.976 21.1953 138.658 21.1953C137.783 21.1953 137.125 20.9844 136.682 20.5625C136.239 20.1406 136.018 19.5104 136.018 18.6719V14.8203H134.721V13H136.018V11.0625L138.479 10.3594V13H140.276V14.8203H138.479V18.5156C138.479 18.8229 138.539 19.0469 138.658 19.1875C138.778 19.3229 138.971 19.3906 139.237 19.3906C139.367 19.3906 139.492 19.375 139.612 19.3438C139.731 19.3073 139.846 19.263 139.955 19.2109L140.44 20.875ZM153.393 13L150.417 21H147.604L144.768 13H147.409L148.799 17.9297C148.878 18.2109 148.94 18.4714 148.987 18.7109C149.034 18.9453 149.062 19.1589 149.073 19.3516H149.104C149.12 19.1693 149.151 18.9635 149.198 18.7344C149.25 18.5052 149.315 18.2526 149.393 17.9766L150.815 13H153.393ZM161.686 14.8594C161.686 16.8646 161.301 18.4219 160.53 19.5312C159.764 20.6406 158.572 21.1953 156.952 21.1953C156.384 21.1953 155.863 21.112 155.389 20.9453C154.921 20.7786 154.465 20.5156 154.022 20.1562L155.21 18.6875C155.475 18.901 155.746 19.0573 156.022 19.1562C156.303 19.2552 156.645 19.3047 157.046 19.3047C157.816 19.3047 158.402 19.026 158.803 18.4688C159.21 17.9115 159.415 17.1068 159.421 16.0547L159.374 16.0391C159.134 16.362 158.829 16.6068 158.46 16.7734C158.095 16.9349 157.668 17.0156 157.178 17.0156C156.288 17.0156 155.553 16.6927 154.975 16.0469C154.397 15.3958 154.108 14.5677 154.108 13.5625C154.108 12.3802 154.46 11.4271 155.163 10.7031C155.866 9.97396 156.783 9.60938 157.913 9.60938C159.085 9.60938 160.007 10.0729 160.678 11C161.35 11.9219 161.686 13.2083 161.686 14.8594ZM159.327 13.5469C159.327 12.974 159.189 12.4896 158.913 12.0938C158.642 11.6927 158.285 11.4922 157.842 11.4922C157.421 11.4922 157.074 11.6719 156.803 12.0312C156.533 12.3854 156.397 12.8255 156.397 13.3516C156.397 13.9401 156.535 14.3932 156.811 14.7109C157.087 15.0234 157.449 15.1797 157.897 15.1797C158.335 15.1797 158.681 15.0208 158.936 14.7031C159.197 14.3854 159.327 14 159.327 13.5469Z" fill="%231B1A19"/>%0A</svg>%0A', logoColor: '#fff', logoBg: '#0078d4',
    desc: "Microsoft's design system for building Office-like experiences.",
    website: 'https://react.fluentui.dev', github: 'https://github.com/microsoft/fluentui',
    installSteps: ['npm install @fluentui/react-components', 'Wrap app with <FluentProvider>', "import { Button } from '@fluentui/react-components'"],
    features: ['Fluent Design', 'Office integration', 'Accessibility', 'Theming', 'SSR', 'Cross-platform'],
    tokens: { primary: '#0078d4', primaryFg: '#fff', secondary: '#f5f5f5', accent: '#005a9e', radius: '4px', border: '#edebe9', bg: '#ffffff', surface: '#faf9f8', text: '#323130', textMuted: '#605e5c', font: 'Segoe UI', shadow: '0 3.2px 7.2px rgba(0,0,0,.13)' },
    stats: { stars: '18k', weekly: '240k', version: '9.54' },
    iconPack: '@fluentui/react-icons', iconCount: '3500+',
  },
  {
    name: 'DaisyUI', slug: 'daisyui', logo: 'https://img.daisyui.com/images/daisyui/mark-rotating.svg', logoColor: '#fff', logoBg: '#661ae6',
    desc: 'Most popular Tailwind CSS component library with semantic class names.',
    website: 'https://daisyui.com', github: 'https://github.com/saadeghi/daisyui',
    installSteps: ['npm install daisyui', 'Add to tailwind.config.js plugins', 'Use class names: btn, card, etc.'],
    features: ['Tailwind plugin', '30+ themes', 'Semantic classes', 'Customizable', 'Lightweight', 'No JS'],
    tokens: { primary: '#661ae6', primaryFg: '#fff', secondary: '#f0e7ff', accent: '#d926a9', radius: '8px', border: '#e5e7eb', bg: '#ffffff', surface: '#f9fafb', text: '#1f2937', textMuted: '#6b7280', font: 'system-ui', shadow: '0 1px 3px rgba(0,0,0,.1)' },
    stats: { stars: '34k', weekly: '420k', version: '4.12' },
    iconPack: 'Heroicons', iconCount: '300+',
  },
  {
    name: 'Naive UI', slug: 'naive', logo: 'https://naiveui.com/assets/naivelogo-BdDVTUmz.svg', logoColor: '#fff', logoBg: '#18a058',
    desc: 'Vue 3 component library with 90+ components and TypeScript support.',
    website: 'https://naiveui.com', github: 'https://github.com/tusen-ai/naive-ui',
    installSteps: ['npm install naive-ui', "import { createApp } from 'vue'", "import naive from 'naive-ui'"],
    features: ['Vue 3 only', 'TypeScript', '90+ components', 'Tree shaking', 'i18n', 'Custom themes'],
    tokens: { primary: '#18a058', primaryFg: '#fff', secondary: '#f0fdf4', accent: '#2080f0', radius: '3px', border: '#e0e0e6', bg: '#ffffff', surface: '#fafafc', text: '#333639', textMuted: '#999', font: 'system-ui', shadow: '0 2px 8px rgba(0,0,0,.06)' },
    stats: { stars: '16k', weekly: '85k', version: '2.39' },
    iconPack: 'Ionicons', iconCount: '1300+',
  }
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 1500); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: copied ? '#22c55e' : 'var(--text-secondary)', cursor: 'pointer' }}>
      {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ━━━━ DASHBOARD PREVIEW (expanded) ━━━━ */
function DashboardPreview({ lib }: { lib: typeof LIBRARIES[0] }) {
  const t = lib.tokens;
  const r = parseInt(t.radius);
  const card: React.CSSProperties = { background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius, boxShadow: t.shadow, fontFamily: t.font, color: t.text };
  const btn1: React.CSSProperties = { background: t.primary, color: t.primaryFg, border: 'none', borderRadius: t.radius, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: t.font };
  const btn2: React.CSSProperties = { background: t.secondary, color: t.text, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: t.font };
  const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', border: `1px solid ${t.border}`, borderRadius: t.radius, fontSize: 13, outline: 'none', fontFamily: t.font, background: t.bg, color: t.text };

  const stats = [
    { icon: <DollarSign size={18} />, label: 'Revenue', value: '$45,231', change: '+20.1%', c: '#22c55e' },
    { icon: <Users size={18} />, label: 'Users', value: '2,350', change: '+12.5%', c: t.primary },
    { icon: <ShoppingCart size={18} />, label: 'Orders', value: '1,247', change: '+8.2%', c: '#f59e0b' },
    { icon: <Activity size={18} />, label: 'Active', value: '573', change: '+2.1%', c: '#ef4444' },
  ];
  const barData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 68];
  const linePoints = [30, 45, 35, 60, 50, 75, 65, 80, 55, 90, 70, 82];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tableRows = [
    { name: 'Kristin Watson', email: 'kristin@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jacob Jones', email: 'jacob@example.com', role: 'Editor', status: 'Active' },
    { name: 'Jenny Wilson', email: 'jenny@example.com', role: 'Viewer', status: 'Inactive' },
    { name: 'Robert Fox', email: 'robert@example.com', role: 'Editor', status: 'Active' },
    { name: 'Eleanor Pena', email: 'eleanor@example.com', role: 'Admin', status: 'Active' },
  ];
  const donutSegments = [
    { pct: 40, color: t.primary, label: 'Desktop' },
    { pct: 30, color: t.accent, label: 'Mobile' },
    { pct: 20, color: '#f59e0b', label: 'Tablet' },
    { pct: 10, color: '#22c55e', label: 'Other' },
  ];

  // SVG line path
  const lineW = 280, lineH = 80;
  const linePath = linePoints.map((p, i) => `${(i / (linePoints.length - 1)) * lineW},${lineH - (p / 100) * lineH}`).join(' ');

  // Donut conic gradient
  let donutGrad = '';
  let acc = 0;
  donutSegments.forEach(s => { donutGrad += `${s.color} ${acc}% ${acc + s.pct}%, `; acc += s.pct; });
  donutGrad = donutGrad.slice(0, -2);

  return (
    <div style={{ background: t.surface, minHeight: '100%', fontFamily: t.font, color: t.text }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: `1px solid ${t.border}`, background: t.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: r, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={lib.logo} alt={lib.name} style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Dashboard</span>
          {['Overview','Analytics','Reports'].map((tab, i) => (
            <span key={tab} style={{ fontSize: 12, padding: '4px 10px', borderRadius: r, cursor: 'pointer', color: i === 0 ? t.primaryFg : t.textMuted, background: i === 0 ? t.primary : 'transparent', fontWeight: i === 0 ? 600 : 400, marginLeft: i === 0 ? 12 : 0 }}>{tab}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
            <input placeholder="Search..." style={{ ...inp, width: 160, paddingLeft: 26, fontSize: 11, padding: '6px 10px 6px 26px' }} />
          </div>
          <button style={{ ...btn2, padding: '5px 7px' }}><Bell size={13} /></button>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: t.primary, color: t.primaryFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>JD</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ ...card, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: t.textMuted }}>{s.label}</span>
                <div style={{ color: s.c, opacity: 0.6 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{s.value}</div>
              <span style={{ fontSize: 10, color: s.c, fontWeight: 600 }}>{s.change} from last month</span>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
          {/* Bar Chart */}
          <div style={{ ...card, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Revenue</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 12 }}>Monthly breakdown</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 90 }}>
              {barData.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 9 ? t.primary : t.secondary, borderRadius: `${r / 2}px ${r / 2}px 0 0` }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {months.map(m => <span key={m} style={{ fontSize: 7, color: t.textMuted, flex: 1, textAlign: 'center' }}>{m}</span>)}
            </div>
          </div>

          {/* Line Chart */}
          <div style={{ ...card, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>User Growth</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 12 }}>Trend over time</div>
            <svg width="100%" viewBox={`0 0 ${lineW} ${lineH}`} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id={`lg-${lib.slug}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.primary} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={t.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,${lineH} ${linePath} ${lineW},${lineH}`} fill={`url(#lg-${lib.slug})`} />
              <polyline points={linePath} fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {linePoints.map((p, i) => (
                <circle key={i} cx={(i / (linePoints.length - 1)) * lineW} cy={lineH - (p / 100) * lineH} r="2.5" fill={t.bg} stroke={t.primary} strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Donut Chart */}
          <div style={{ ...card, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Traffic Sources</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 12 }}>By device type</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(${donutGrad})`, position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>100%</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {donutSegments.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    <span style={{ color: t.textMuted }}>{s.label}</span>
                    <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
          {/* Table */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Team Members</div>
              <button style={{ ...btn1, padding: '5px 12px', fontSize: 11 }}><Plus size={12} style={{ marginRight: 4 }} /> Invite</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Name','Email','Role','Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 16px', fontWeight: 600, color: t.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < tableRows.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '10px 16px', color: t.textMuted }}>{row.email}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: r, fontSize: 10, fontWeight: 600, background: row.role === 'Admin' ? t.primary + '18' : t.secondary, color: row.role === 'Admin' ? t.primary : t.text }}>{row.role}</span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: r, fontSize: 10, fontWeight: 600, background: row.status === 'Active' ? '#22c55e18' : '#ef444418', color: row.status === 'Active' ? '#22c55e' : '#ef4444' }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Progress Card */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Project Progress</div>
              {[
                { label: 'Design System', pct: 85, color: t.primary },
                { label: 'Frontend Dev', pct: 62, color: t.accent },
                { label: 'Testing', pct: 40, color: '#f59e0b' },
                { label: 'Deployment', pct: 15, color: '#22c55e' },
              ].map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span>{p.label}</span><span style={{ fontWeight: 600 }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: t.secondary }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, borderRadius: 3, background: p.color, transition: 'width .5s' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts & Badges */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Notifications</div>
              {[
                { icon: <CheckCircle size={14} />, text: 'Build succeeded', bg: '#22c55e18', color: '#22c55e' },
                { icon: <AlertTriangle size={14} />, text: 'Disk usage at 80%', bg: '#f59e0b18', color: '#f59e0b' },
                { icon: <Info size={14} />, text: 'New update available', bg: t.primary + '18', color: t.primary },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: r, background: a.bg, marginBottom: 6 }}>
                  <div style={{ color: a.color }}>{a.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{a.text}</span>
                </div>
              ))}
            </div>

            {/* Toggle + Input */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Settings</div>
              {['Email notifications', 'Dark mode', 'Auto save'].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
                  <span style={{ fontSize: 12 }}>{s}</span>
                  <div style={{ width: 36, height: 20, borderRadius: 10, background: i === 1 ? t.primary : t.border, position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: i === 1 ? 18 : 2, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━ ICONS VIEW ━━━━ */
function IconsView({ lib }: { lib: typeof LIBRARIES[0] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const t = lib.tokens;

  // Reset filters when library changes
  React.useEffect(() => { setActiveCategory('All'); setSearchTerm(''); }, [lib.slug]);

  const libIcons = LIBRARY_ICONS[lib.slug] || [];
  const categories = ['All', ...libIcons.map(c => c.name)];
  const filteredCategories = activeCategory === 'All'
    ? libIcons
    : libIcons.filter(c => c.name === activeCategory);
  const allFiltered = filteredCategories.map(cat => ({
    ...cat,
    icons: cat.icons.filter(ic => !searchTerm || ic.label.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.icons.length > 0);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 4px' }}>
            {lib.name} Icon Pack
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            Uses <strong>{lib.iconPack}</strong> — {lib.iconCount} icons available
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search icons..."
            style={{ paddingLeft: 32, padding: '8px 14px 8px 32px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none', width: 220 }} />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? t.primary : 'var(--surface)',
              color: activeCategory === cat ? t.primaryFg : 'var(--text-secondary)',
              borderColor: activeCategory === cat ? t.primary : 'var(--border)',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Icon Grid by Category */}
      {allFiltered.map(cat => (
        <div key={cat.name} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', fontFamily: 'var(--font-display)' }}>{cat.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {cat.icons.map(({ Icon, label }) => (
              <div key={label}
                onClick={() => { navigator.clipboard.writeText(`<${label} />`); toast.success(`Copied <${label} />`); }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 6px', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', background: 'var(--surface)', transition: 'all .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.primary; e.currentTarget.style.color = t.primary; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Icon size={22} strokeWidth={1.5} />
                <span style={{ fontSize: 9, marginTop: 6, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ━━━━ DETAILS VIEW ━━━━ */
function DetailsView({ lib }: { lib: typeof LIBRARIES[0] }) {
  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src={lib.logo} alt={lib.name} style={{ width: 48, height: 48, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>{lib.name}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0', lineHeight: 1.5 }}>{lib.desc}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {[{ icon: <Star size={13} />, text: `${lib.stats.stars} stars` }, { icon: <TrendingUp size={13} />, text: `${lib.stats.weekly}/week` }, { icon: <Shield size={13} />, text: `v${lib.stats.version}` }, { icon: <Package size={13} />, text: `${lib.iconCount} icons` }].map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--surface2)', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{b.icon} {b.text}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        <a href={lib.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: lib.logoBg, color: lib.logoColor, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}><ExternalLink size={14} /> Official Website</a>
        <a href={lib.github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--surface2)', color: 'var(--text)', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--border)' }}><BookOpen size={14} /> GitHub</a>
      </div>
      {/* Installation */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Terminal size={18} style={{ color: 'var(--accent)' }} /><h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: 0 }}>Installation Guide</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lib.installSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0d1117', borderRadius: 8, padding: '10px 14px' }}>
              <span style={{ color: '#7ee787', fontSize: 12, fontWeight: 700, flexShrink: 0, width: 18 }}>{i + 1}.</span>
              <code style={{ flex: 1, fontSize: 12, color: '#c9d1d9', fontFamily: 'var(--font-mono)' }}>{step}</code>
              <CopyBtn text={step} />
            </div>
          ))}
        </div>
      </div>
      {/* Features */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', margin: '0 0 16px' }}>Key Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {lib.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}><Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} /> {f}</div>
          ))}
        </div>
      </div>
      {/* Tokens */}
      <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#58a6ff', margin: 0, fontFamily: 'var(--font-mono)' }}>design-tokens.css</h3>
          <CopyBtn text={`:root {\n  --primary: ${lib.tokens.primary};\n  --radius: ${lib.tokens.radius};\n  --border: ${lib.tokens.border};\n  --font: "${lib.tokens.font}";\n}`} />
        </div>
        <pre style={{ margin: 0, fontSize: 12, color: '#c9d1d9', lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}>
{`:root {
  --primary: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.primary}</span>{`;
  --radius: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.radius}</span>{`;
  --border: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.border}</span>{`;
  --surface: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.surface}</span>{`;
  --text: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.text}</span>{`;
  --font: `}<span style={{color:'#a5d6ff'}}>"{lib.tokens.font}"</span>{`;
  --shadow: `}<span style={{color:'#a5d6ff'}}>{lib.tokens.shadow}</span>{`;
}`}
        </pre>
      </div>
    </div>
  );
}

/* ━━━━ MAIN COMPONENT ━━━━ */
export default function LibrariesTool() {
  const [activeLibIndex, setActiveLibIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'icons' | 'details'>('preview');
  const activeLib = LIBRARIES[activeLibIndex];

  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <LibraryIcon size={16} className="text-primary" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: 0 }}>UI Libraries</h2>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Select a framework to compare design systems.</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {LIBRARIES.map((lib, i) => (
          <button key={lib.name} onClick={() => { setActiveLibIndex(i); setViewMode('preview'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all .15s',
              background: activeLibIndex === i ? 'var(--accent-soft)' : 'transparent',
              outline: activeLibIndex === i ? '2px solid var(--accent)' : '2px solid transparent',
              color: 'var(--text)',
            }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={lib.logo} alt={lib.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{lib.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>⭐ {lib.stats.stars}</div>
            </div>
            {activeLibIndex === i && <ChevronRight size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
          </button>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { key: 'preview' as const, label: '🖥 Dashboard' },
    { key: 'icons' as const, label: '🎨 Icons' },
    { key: 'details' as const, label: '📖 Details' },
  ];

  return (
    <Layout sidebar={Sidebar}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={activeLib.logo} alt={activeLib.name} style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{activeLib.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 8px', background: 'var(--surface2)', borderRadius: 20 }}>v{activeLib.stats.version}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setViewMode(t.key)}
                style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: viewMode === t.key ? 'var(--accent)' : 'transparent',
                  color: viewMode === t.key ? '#fff' : 'var(--text-secondary)',
                  borderColor: viewMode === t.key ? 'var(--accent)' : 'var(--border)',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {viewMode === 'preview' && <DashboardPreview lib={activeLib} />}
          {viewMode === 'icons' && <IconsView lib={activeLib} />}
          {viewMode === 'details' && <DetailsView lib={activeLib} />}
        </div>
      </div>
    </Layout>
  );
}
