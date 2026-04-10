"use client";

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

function getInitials(firstname: string, lastname: string): string {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}

interface AvatarProps {
  firstname: string;
  lastname: string;
  avatarUrl?: string | null;
  size?: number;
}

export function EmployeAvatar({ firstname, lastname, avatarUrl, size = 40 }: AvatarProps) {
  const initials = getInitials(firstname, lastname);
  const bg = hashColor(`${firstname} ${lastname}`);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstname} ${lastname}`}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.38 }}
      aria-label={`${firstname} ${lastname}`}
    >
      {initials}
    </div>
  );
}
