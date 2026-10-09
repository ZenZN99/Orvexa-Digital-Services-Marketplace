export type AdminTab =
  | "dashboard"
  | "users"
  | "services"
  | "orders"
  | "contracts"
  | "payments"
  | "wallet"
  | "support";

export interface AdminNavItem {
  id: AdminTab;
  label: string;
}

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface AdminContentProps {
  activeTab: AdminTab;
}

export interface AdminHeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
}

export interface AdminTableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface AdminPaginationState {
  page: number;
  limit: number;
}

export interface AdminFilterOption {
  label: string;
  value: string;
}

export interface AdminFilter {
  key: string;
  label: string;
  options: AdminFilterOption[];
}

export interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface AdminAction<T = unknown> {
  label: string;
  onClick: (item: T) => void;
  variant?: "default" | "danger" | "success";
  disabled?: boolean;
}

export interface AdminLoadingState {
  loading: boolean;
  error: string | null;
}

export interface AdminPageState {
  activeTab: AdminTab;
  sidebarOpen: boolean;
}
