// Small, consistent inline line icons (no dependency).
// Each takes an optional className for sizing/colour.

type IconProps = { className?: string };

function base(path: React.ReactNode, className = "h-[18px] w-[18px]") {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

export const IconUser = ({ className }: IconProps) =>
  base(<><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></>, className);

export const IconBriefcase = ({ className }: IconProps) =>
  base(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>, className);

export const IconMail = ({ className }: IconProps) =>
  base(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7L22 6" /></>, className);

export const IconPhone = ({ className }: IconProps) =>
  base(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />, className);

export const IconMapPin = ({ className }: IconProps) =>
  base(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>, className);

export const IconGlobe = ({ className }: IconProps) =>
  base(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" /></>, className);

export const IconText = ({ className }: IconProps) =>
  base(<path d="M4 6h16M4 12h16M4 18h10" />, className);

export const IconGraduation = ({ className }: IconProps) =>
  base(<><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></>, className);

export const IconTools = ({ className }: IconProps) =>
  base(<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2-2 2.7-2.7Z" />, className);

export const IconSparkles = ({ className }: IconProps) =>
  base(
    <>
      <path d="M12 3 10.4 8.4a2 2 0 0 1-2 1.4L3 12l5.4 1.6a2 2 0 0 1 1.4 2L12 21l1.6-5.4a2 2 0 0 1 2-1.4L21 12l-5.4-1.6a2 2 0 0 1-1.4-2L12 3Z" />
      <path d="M19 4v3M20.5 5.5h-3" />
    </>,
    className,
  );

export const IconDownload = ({ className }: IconProps) =>
  base(<path d="M12 3v12M7 10l5 5 5-5M5 21h14" />, className);

export const IconHistory = ({ className }: IconProps) =>
  base(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>, className);

export const IconTarget = ({ className }: IconProps) =>
  base(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>, className);

export const IconGrip = ({ className }: IconProps) =>
  base(<path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" />, className);

export const IconList = ({ className }: IconProps) =>
  base(<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />, className);

export const IconPlus = ({ className }: IconProps) =>
  base(<path d="M12 5v14M5 12h14" />, className);

export const IconTrash = ({ className }: IconProps) =>
  base(<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />, className);

export const IconArrowLeft = ({ className }: IconProps) =>
  base(<path d="M19 12H5M12 19l-7-7 7-7" />, className);

export const IconEye = ({ className }: IconProps) =>
  base(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>, className);

export const IconEyeOff = ({ className }: IconProps) =>
  base(<path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 4.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.1M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 3-.4" />, className);

export const IconChevron = ({ className }: IconProps) =>
  base(<path d="M6 9l6 6 6-6" />, className);

export const IconImage = ({ className }: IconProps) =>
  base(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>, className);

export const IconAward = ({ className }: IconProps) =>
  base(<><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" /></>, className);

export const IconLanguages = ({ className }: IconProps) =>
  base(<path d="M4 5h7M9 3v2c0 4-2 7-5 9M5 9c0 3 3 5 6 6M14 21l4-9 4 9M16.5 16h5" />, className);

export const IconFileText = ({ className }: IconProps) =>
  base(<><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /><path d="M9 9h1M9 13h6M9 17h6" /></>, className);

export const IconExpand = ({ className }: IconProps) =>
  base(<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />, className);

export const IconX = ({ className }: IconProps) =>
  base(<path d="M18 6 6 18M6 6l12 12" />, className);
