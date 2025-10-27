import React from 'react';

export const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5zM18.4 5.6c.2.2.5.2.7 0 .2-.2.2-.5 0-.7l-2.1-2.1c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l2.1 2.1zM21 12c0-.3-.2-.5-.5-.5h-3c-.3 0-.5.2-.5.5s.2.5.5.5h3c.3 0 .5-.2.5-.5zM18.4 18.4c.2.2.5.2.7 0s.2-.5 0-.7l-2.1-2.1c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l2.1 2.1zM12 21c.3 0 .5-.2.5-.5v-3c0 .3-.2.5-.5.5s-.5.2-.5.5v3c0 .3.2.5.5.5zM5.6 18.4c.2.2.5.2.7 0l2.1-2.1c.2-.2.2-.5 0-.7s-.5-.2-.7 0l-2.1 2.1c-.2.2-.2.5 0 .7zM3 12c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5zM5.6 5.6c.2-.2.2-.5 0-.7L3.5 3.5c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l2.1 2.1c.2 0 .5 0 .7 0z" />
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0 -7z" />
  </svg>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export const SceneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="m3.5 13.5 5-5 4 4 6-6" />
  </svg>
);

export const IdeasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
    <path d="M15 2v5h5" />
    <path d="m12 12-2 4 2 4" />
    <path d="m16 12-2 4 2 4" />
  </svg>
);

export const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 13v-2a4 4 0 0 0-4-4H8" />
        <path d="m7 7-3 3 3 3" />
    </svg>
);

export const RedoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 13v-2a4 4 0 0 1 4-4h11" />
        <path d="m17 7 3 3-3 3" />
    </svg>
);

export const SendToEditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M13 21v-9a1 1 0 0 1 1-1h6M21 7v6M7 21v-4a1 1 0 0 1 1-1h4M3 11v6a2 2 0 0 0 2 2h1" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
