type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

/**
 * Reusable empty state component.
 * Used when no data is available after filtering.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
