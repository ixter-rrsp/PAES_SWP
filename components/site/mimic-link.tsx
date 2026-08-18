"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { usePageContent } from "./page-content-context";

type MimicLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
  };

/**
 * Drop-in replacement for next/link everywhere a page view uses
 * navigational links (Read More, View All, Quick Access cards...).
 *
 * On the public site it behaves exactly like Link. Inside the Page
 * Configuration admin preview (PageMimic), the destination is fixed
 * code, not something an admin can change here, so following it would
 * just yank the admin out of the config screen into a real page. In
 * that context this renders the same markup as a non-navigating <div>
 * instead, with a small visual/cursor hint that it isn't clickable.
 */
export default function MimicLink({ href, children, className, ...rest }: MimicLinkProps) {
  const { editable } = usePageContent();

  if (editable) {
    return (
      <div
        className={`${className ?? ""} cursor-default opacity-90`}
        title="Links are disabled in this preview"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
