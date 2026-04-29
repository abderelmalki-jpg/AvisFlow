import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-fb-bg select-none";

  const variants = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-sm",
    secondary:
      "bg-fb-surface2 text-fb-text border border-fb-border hover:bg-fb-surface hover:border-fb-dim focus:ring-fb-dim shadow-sm",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost:
      "text-fb-muted hover:bg-fb-surface2 hover:text-fb-text focus:ring-fb-dim",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const isDisabled = disabled || loading;

  const classNames = clsx(
    base,
    variants[variant],
    sizes[size],
    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const content = loading ? (
    <>
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{children}</span>
    </>
  ) : children;

  if (href && !isDisabled) {
    return <Link href={href} className={classNames}>{content}</Link>;
  }

  return (
    <button className={classNames} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
}
