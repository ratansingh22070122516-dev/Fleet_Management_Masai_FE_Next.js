import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg' | 'xs'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
  
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-4 focus:ring-purple-300',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
    outline: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
    ghost: 'text-purple-600 hover:bg-purple-100',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3'
  }

  const loadingClass = isLoading ? 'loading' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      )}
      {children}
    </button>
  )
}