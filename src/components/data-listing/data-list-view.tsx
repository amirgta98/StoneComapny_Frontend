import React from "react";

type DataListViewProps = {
  /**
   * Mobile card grid view (shown on md and below)
   */
  cardView: React.ReactNode;
  /**
   * Desktop table view (shown on md and above)
   */
  tableView: React.ReactNode;
  /**
   * Item count and metadata
   */
  footer?: React.ReactNode;
};

/**
 * Handles responsive switching between card view (mobile) and table view (desktop).
 * Prevents code duplication by providing single component for both layouts.
 */
export function DataListView({ cardView, tableView, footer }: DataListViewProps) {
  return (
    <>
      {/* Mobile Card View - Hidden on md+ */}
      <div className="md:hidden">{cardView}</div>

      {/* Desktop Table View - Hidden on md- */}
      <div className="hidden md:block">{tableView}</div>

      {/* Footer (count, pagination, etc) */}
      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </>
  );
}
