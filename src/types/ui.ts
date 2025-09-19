export interface NavigationItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavigationItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SearchFilters {
  query?: string
  category?: string
  dateRange?: {
    from: Date
    to: Date
  }
  status?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}