'use client';

import { cn } from "@/lib/utils";

interface IconProps {
    name: string;
    className?: string;
}

interface IconItem {
    name: string;
    path: string;
}

const IconList: IconItem[] = [
    {
        name: "Roadmap",
        path: "M3 3h18v18H3V3zm16 16V5H5v14h14zM7 8h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
    },
    {
        name: "Course",
        path: "M6 2h12v20H6V2zm10 18V4H8v16h8zM2 6h2v12H2V6zm18 0h2v12h-2V6zm-6-1h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"
    },
    {
        name: "Learning",
        path: "M12 2h8v6h-2V4h-6V2zM2 8h2v10h16V8h2v12H2V8zm6 2h8v2H8v-2zm0 4h8v2H8v-2z"
    },
    {
        name: "Wind",
        path: "M13 5h8v2h-8V5zM5 9h16v2H5V9zm3 4h14v2H8v-2zm5 4h6v2h-6v-2z"
    },
    {
        name: "Fire",
        path: "M12 2c1 2 2 4 0 6 0-2-2-4-4-2-1 2 0 4 2 6 2 2 4 4 4 8 0-4 2-6 4-8s4-4 2-6c-2-2-3 0-3 2 0-2-1-4-3-6zm-1 18c-3-3-5-5-5-9 1 2 2 2 4 2-2-2-3-6 0-8 1 2 2 3 4 3 2 0 3-1 4-3 3 2 2 6 0 8 2 0 3 0 4-2 0 4-2 6-5 9 0-2-1-3-3-3-2 0-3 1-3 3z"
    },
    {
        name: "Rain",
        path: "M5 2h14v6H5V2zm12 2H7v2h10V4zM3 10h18v2H3v-2zm0 4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v6H3v-2z"
    },
    {
        name: "Bird",
        path: "M17 3h2v2h-2v2h-2V5h-4v2h-2V5H7v2H5V5H3V3h2V1h2v2h2V1h2v2h4V1h2v2zM5 15h2v6H5v-6zm12 0h2v6h-2v-6zm-6-2c-3 0-5-2-5-5h10c0 3-2 5-5 5z"
    },
    {
        name: "Grass",
        path: "M2 21h20v-2H2v2zM12 3c-1 2-4 3-4 6 0 2 2 3 4 3s4-1 4-3c0-3-3-4-4-6zm-6 7c-1 1-2 2-2 4 0 2 1 3 3 3s3-1 3-3c0-2-2-3-4-4zm12 0c-2 1-4 2-4 4 0 2 1 3 3 3s3-1 3-3c0-2-1-3-2-4z"
    },
    {
        name: "Board",
        path: "M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm0 6h4v4H7v-4zm6-6h4v4h-4V7zm0 6h4v4h-4v-4z"
    },
    {
        name: "MultiImage",
        path: "M24 2H4v16h20V2zM6 16V4h16v12H6zM2 4H0v18h20v-2H2V4zm12 2h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm0 0v2H8v-2h2zm8-2h-2V8h2v2zm0 0h2v2h-2v-2zM8 6h2v2H8V6z"
    },
    {
        name: "Play",
        path: "M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"
    },
    {
        name: "Pause",
        path: "M10 4H5v16h5V4zm9 0h-5v16h5V4z"
    },
    {
        name: "Previous",
        path: "M6 4h2v16H6V4zm12 0h-2v2h-2v3h-2v2h-2v2h2v3h2v2h2v2h2V4z"
    },
    {
        name: "Next",
        path: "M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4zm12 0h-2v16h2V4z"
    },
    {
        name: "Music",
        path:"M8 4h12v16h-8v-8h6V8h-8v12H2v-8h6V4zm0 10H4v4h4v-4zm10 0h-4v4h4v-4z" 
    },
    {
        name: "Volume",
        path:"M11 2h2v20h-2v-2H9v-2h2V6H9V4h2V2zM7 8V6h2v2H7zm0 8H3V8h4v2H5v4h2v2zm0 0v2h2v-2H7zm10-6h-2v4h2v-4zm2-2h2v8h-2V8zm0 8v2h-4v-2h4zm0-10v2h-4V6h4z"
    },
    {
        name: "Mute",
        path: "M13 2h-2v2H9v2H7v2H3v8h4v2h2v2h2v2h2V2zM9 18v-2H7v-2H5v-4h2V8h2V6h2v12H9zm10-6.777h-2v-2h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0h2v-2h-2v2z"
    },
    {
        name:"Tool",
        path:"M12 1h2v8h8v4h-2v-2h-8V5h-2V3h2V1zM8 7V5h2v2H8zM6 9V7h2v2H6zm-2 2V9h2v2H4zm10 8v2h-2v2h-2v-8H2v-4h2v2h8v6h2zm2-2v2h-2v-2h2zm2-2v2h-2v-2h2zm0 0h2v-2h-2v2z" 
    },
    {
        name:"List",
        path: "M19 4h2v2h-2V4zm-2 4V6h2v2h-2zm-2 0h2v2h-2V8zm0 0h-2V6h2v2zM3 6h8v2H3V6zm8 10H3v2h8v-2zm7 2v-2h2v-2h-2v2h-2v-2h-2v2h2v2h-2v2h2v-2h2zm0 0v2h2v-2h-2z"
    },
    {
        name:"Note",
       path: "M19 22h-7v-2h7V10h-6V4H5v8H3V2h12v2h2v2h2v2h2v14h-2zM17 6h-2v2h2V6zM8 19h3v-2H8v-3H6v3H3v2h3v3h2v-3z" 
    },
    {
        name: "Calendar",
        path:"M15 2h2v2h4v18H3V4h4V2h2v2h6V2zM9 6H5v2h14V6H9zm-4 4v10h14V10H5zm2 2h2v2H7v-2zm6 0h-2v2h2v-2zm2 0h2v2h-2v-2zm-6 4H7v2h2v-2zm2 0h2v2h-2v-2zm6 0h-2v2h2v-2z" 
    },
    {
        name: "Clock",
       path: "M19 3H5v2H3v14h2v2h14v-2h2V5h-2V3zm0 2v14H5V5h14zm-8 2h2v6h4v2h-6V7z" 
    },
    {
        name: "Close",
        path:"M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
    },
    {
        name:"Check-on",
       path: "M3 3h18v18H3V3zm16 16V5H5v14h14z"
    },
    {
        name:"Check-off",
        path: "M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z" 
    },
    {
        name:"Trash",
        path:"M16 2v4h6v2h-2v14H4V8H2V6h6V2h8zm-2 2h-4v2h4V4zm0 4H6v12h12V8h-4zm-5 2h2v8H9v-8zm6 0h-2v8h2v-8z" 
    },
    {
        name:"Rain",
        path: "M16 4h-6v2H8v2H4v2H2v2H0v6h2v2h20v-2h2v-6h-2v-2h-2V8h-2V6h-2V4zm2 8h4v6H2v-6h2v-2h4v2h2v-2H8V8h2V6h6v2h2v4zm0 0v2h-2v-2h2z" 
    },
    {
        name:"Scale",
        path:"M21 3h-8v2h4v2h2v4h2V3zm-4 4h-2v2h-2v2h2V9h2V7zm-8 8h2v-2H9v2H7v2h2v-2zm-4-2v4h2v2H5h6v2H3v-8h2z"
    },
    {
        name:"UnScale",
        path:"M5 3h16v4h-2V5H5v14h14v-2h2v4H3V3h2zm16 8h-2V9h-2V7h-2v2h2v2H7v2h10v2h-2v2h2v-2h2v-2h2v-2z"
    },
    {
        name:"Youtube",
        path:"M23.5 6.2c-.15-.52-.4-1-.75-1.42-.37-.44-.85-.74-1.38-.88C19.73 3.45 12 3.45 12 3.45s-7.73 0-9.37.45c-.53.14-1.01.44-1.38.88-.35.42-.6.9-.75 1.42C.07 7.88.07 12 .07 12s0 4.12.43 5.79c.15.52.4 1 .75 1.42.37.44.85.74 1.38.88 1.64.45 9.37.45 9.37.45s7.73 0 9.37-.45c.53-.14 1.01-.44 1.38-.88.35-.42.6-.9.75-1.42.43-1.67.43-5.79.43-5.79s0-4.12-.43-5.79zM10 15V9l6 3-6 3z"
    },
    {
        name:"Minimize",
        path:"M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
    },
    {
        name:"Maximize",
        path:"M11 4h2v12h2v2h-2v2h-2v-2H9v-2h2V4zM7 14v2h2v-2H7zm0 0v-2H5v2h2zm10 0v2h-2v-2h2zm0 0v-2h2v2h-2z" 
    },
    {
        name:"Chat",
        path:"M12 2C6.5 2 2 6.5 2 12c0 2.1.7 4 1.9 5.6L3 22l4.4-1.8c1.4.5 2.9.8 4.6.8 5.5 0 10-4.5 10-10S17.5 2 12 2zm-4 9h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" 
    }
];

export default function Icon({ name, className }: IconProps) {
    const icon = IconList.find((item) => item.name === name);
    
    if (!icon) {
        return null;
    }
    
    return (
        <span className={cn("w-5 h-5 text-white-500 filter-green-glow", className)}>
            <svg 
                className={cn("w-5 h-5 text-white filter-green-glow", className)} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 24 24"
            >
                <path d={icon.path}></path>
            </svg>
        </span>
    );
} 