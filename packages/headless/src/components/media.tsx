"use client";
import { useEffect, useState, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import { UserIcon } from "../icons.js";
import { cx } from "../utils.js";
import type { Presence } from "./status.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

/** "Mayur Choudhary" → "MC", "asha" → "A". Works for any script, letter by letter. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = Array.from(words[0] ?? "")[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1]!)[0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The person's name. Used for initials and as the spoken name. */
  name?: string;
  src?: string;
  size?: AvatarSize;
  status?: Presence;
  /** Set when the name is printed right next to the avatar, so it isn't read twice. */
  decorative?: boolean;
}

/** A person. Falls back from photo → initials → icon on its own, including when the photo fails to load. */
export function Avatar({ name, src, size = "md", status, decorative, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = src && !failed;
  const type = showImage ? "image" : name ? "initials" : "icon";
  const a11y = decorative || !name ? { "aria-hidden": true as const } : { role: "img", "aria-label": status ? `${name}, ${status}` : name };
  return (
    <span {...props} {...a11y} data-size={size} data-type={type} className={cx("astra-avatar", className)}>
      {showImage ? (
        <img data-slot="image" src={src} alt="" onError={() => setFailed(true)} />
      ) : name ? (
        <span data-slot="initials">{initialsOf(name)}</span>
      ) : (
        <UserIcon data-slot="icon" />
      )}
      {status && <span data-slot="status" data-status={status} aria-hidden="true" />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatars beyond this collapse into "+3". */
  max?: number;
  size?: AvatarSize;
  children: ReactNode[];
}

export function AvatarGroup({ max = 4, size = "sm", children, className, ...props }: AvatarGroupProps) {
  const shown = children.slice(0, max);
  const rest = children.length - shown.length;
  return (
    <div {...props} role="group" data-size={size} className={cx("astra-avatar-group", className)}>
      {shown}
      {rest > 0 && (
        <span className="astra-avatar" data-size={size} data-type="initials" role="img" aria-label={`${rest} more`}>
          <span data-slot="initials">+{rest}</span>
        </span>
      )}
    </div>
  );
}

export type ThumbnailRatio = "1/1" | "4/3" | "16/9" | "3/4";

export interface ThumbnailProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  /** Required. Use "" when the name is printed right beside the photo. */
  alt: string;
  ratio?: ThumbnailRatio;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "circle";
}

/** A photo at a fixed ratio, so layouts never jump while it loads. Lazy-loads by default. */
export function Thumbnail({ ratio = "1/1", size = "md", shape = "rounded", className, loading = "lazy", ...props }: ThumbnailProps) {
  return (
    <span data-ratio={ratio} data-size={size} data-shape={shape} className={cx("astra-thumbnail", className)}>
      <img {...props} loading={loading} decoding="async" data-slot="image" />
    </span>
  );
}
