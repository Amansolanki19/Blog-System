// A small set of hand-drawn line icons, kept as plain SVG so no icon
// package is required. Each accepts standard SVG props (className, style…).

export const SunIcon = (props) => (
  <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);

export const MoonIcon = (props) => (
  <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const EyeOffIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.8 16.8 0 0 1-3.1 3.8M6.2 6.3C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.7-.5" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.6" strokeLinejoin="round" {...props}>
    <path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.4 4.5 6 4.2c2-.2 3.7.9 5 2.7 1.3-1.8 3-2.9 5-2.7 3.6.3 5.5 3.6 4 7-2.5 4.7-10 9.3-10 9.3Z" />
  </svg>
);

export const CommentIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...props}>
    <path d="M4 4.5h16v12H9l-5 4v-4H4z" />
  </svg>
);

export const PencilIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
  </svg>
);

export const LogoutIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4M16 16l4-4-4-4M20 12H9" />
  </svg>
);

export const SettingsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1l.4 2.5h4l.4-2.5a8 8 0 0 0 1.7-1l2.3.9 2-3.4Z" />
  </svg>
);

export const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3 4.5 6v5.5C4.5 16 7.7 19.7 12 21c4.3-1.3 7.5-5 7.5-9.5V6L12 3Z" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h6l1-13" />
  </svg>
);
