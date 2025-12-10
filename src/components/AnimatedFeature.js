import React from "react";

export default function AnimatedFeature() {
    return (
        <div className="w-[500px] mx-auto aspect-video">
            <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <style>
                    {`
                        /* Master Loop Duration: 4s (3s active + 1s delay) */
                        
                        @keyframes windowAnim {
                            0% { transform: scale(0); opacity: 0; }
                            8% { transform: scale(1); opacity: 1; }
                            64% { transform: scale(1); opacity: 1; }
                            71% { transform: scale(0.95); opacity: 0; }
                            75%, 100% { transform: scale(0); opacity: 0; }
                        }

                        @keyframes slideInLeftLoop {
                            0%, 11% { transform: translateX(-20px); opacity: 0; }
                            19% { transform: translateX(0); opacity: 1; }
                            64% { transform: translateX(0); opacity: 1; }
                            71% { transform: translateX(-10px); opacity: 0; }
                            75%, 100% { transform: translateX(-20px); opacity: 0; }
                        }

                        @keyframes fadeInUpLoop {
                            0%, 19% { transform: translateY(20px); opacity: 0; }
                            26% { transform: translateY(0); opacity: 1; }
                            64% { transform: translateY(0); opacity: 1; }
                            71% { transform: translateY(10px); opacity: 0; }
                            75%, 100% { transform: translateY(20px); opacity: 0; }
                        }
                        
                        @keyframes floatLoop {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }

                        @keyframes badgeAppear {
                             0%, 32% { transform: translate(300px, 14px) scale(0); opacity: 0; }
                             35% { transform: translate(300px, 14px) scale(1.1); opacity: 1; }
                             40% { transform: translate(300px, 14px) scale(1); opacity: 1; }
                             64% { transform: translate(300px, 14px) scale(1); opacity: 1; }
                             71% { transform: translate(300px, 14px) scale(0); opacity: 0; }
                             75%, 100% { transform: translate(300px, 14px) scale(0); opacity: 0; }
                        }

                        @keyframes flyOut {
                            0%, 35% { transform: translateX(0) scale(0); opacity: 0; }
                            40% { opacity: 1; transform: translateX(0) scale(1); }
                            41% { transform: translateX(15px) scale(0.8); }
                            55% { opacity: 0; transform: translateX(45px) scale(0); }
                            100% { opacity: 0; transform: translateX(45px) scale(0); }
                        }
                        
                        .browser-window { animation: windowAnim 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: center; }
                        
                        .header { animation: slideInLeftLoop 4s ease-out infinite; }
                        .sidebar { animation: slideInLeftLoop 4s ease-out infinite; animation-delay: 0.1s; }
                        
                        .content-block-1 { animation: fadeInUpLoop 4s ease-out infinite; }
                        .content-block-2 { animation: fadeInUpLoop 4s ease-out infinite; animation-delay: 0.2s; }
                        .content-block-3 { animation: fadeInUpLoop 4s ease-out infinite; animation-delay: 0.4s; }
                        
                        .floating-element { animation: badgeAppear 4s ease-out infinite; transform-origin: center; }
                        .spark { animation: flyOut 4s ease-out infinite; fill: #F59E0B; }
                    `}
                </style>

                {/* Browser Window Frame */}
                <g className="browser-window">
                    <rect x="50" y="50" width="300" height="200" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="2" />
                    <rect x="50" y="50" width="300" height="24" rx="8" fill="#0F172A" /> {/* Title Bar */}
                    <rect x="50" y="70" width="300" height="4" fill="#0F172A" /> {/* Fix corner radius overlap */}

                    {/* Window Controls */}
                    <circle cx="65" cy="62" r="3" fill="#EF4444" />
                    <circle cx="75" cy="62" r="3" fill="#F59E0B" />
                    <circle cx="85" cy="62" r="3" fill="#10B981" />
                </g>

                {/* App Interface */}
                <g clipPath="url(#screen-clip)">
                    {/* Header */}
                    <rect className="header" x="50" y="74" width="300" height="30" fill="#334155" />
                    <rect className="header" x="280" y="82" width="60" height="14" rx="4" fill="#3B82F6" />

                    {/* Sidebar */}
                    <rect className="sidebar" x="50" y="104" width="60" height="146" fill="#1e293b" fillOpacity="0.5" />
                    <rect className="sidebar" x="60" y="114" width="40" height="6" rx="2" fill="#475569" />
                    <rect className="sidebar" x="60" y="126" width="30" height="6" rx="2" fill="#475569" />
                    <rect className="sidebar" x="60" y="138" width="36" height="6" rx="2" fill="#475569" />

                    {/* Main Content Area */}
                    <g transform="translate(120, 114)">
                        {/* Hero Section */}
                        <rect className="content-block-1" x="0" y="0" width="220" height="60" rx="4" fill="#3B82F6" fillOpacity="0.2" />
                        <rect className="content-block-1" x="10" y="10" width="100" height="10" rx="2" fill="#3B82F6" />
                        <rect className="content-block-1" x="10" y="26" width="160" height="6" rx="2" fill="#60A5FA" />

                        {/* Grid Content */}
                        <rect className="content-block-2" x="0" y="70" width="105" height="66" rx="4" fill="#334155" />
                        <rect className="content-block-3" x="115" y="70" width="105" height="66" rx="4" fill="#334155" />

                        {/* Detail Lines in Grid */}
                        <g className="content-block-2">
                            <rect x="10" y="80" width="40" height="8" rx="2" fill="#475569" />
                            <rect x="10" y="94" width="85" height="4" rx="2" fill="#475569" />
                            <rect x="10" y="102" width="60" height="4" rx="2" fill="#475569" />
                        </g>
                    </g>
                </g>

                {/* Floating Badge & Fireworks - Moved outside clip path */}
                <g className="floating-element">
                    {/* Sparks */}
                    <g transform="translate(10, 10) rotate(0)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(45)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(90)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(135)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(180)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(225)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(270)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                    <g transform="translate(10, 10) rotate(315)"><circle cx="0" cy="0" r="3" className="spark" /></g>
                </g>

                <defs>
                    <clipPath id="screen-clip">
                        <rect x="50" y="74" width="300" height="176" rx="0" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}