"use client";

import React from "react";

interface AdBannerProps {
  className?: string;
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = "",
  label = "Sponsored Gaming Partner",
}) => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 250px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #container-2b2b0152bf2e6dc65de7161495e8eb8e {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div id="container-2b2b0152bf2e6dc65de7161495e8eb8e"></div>
  <script async="async" data-cfasync="false" src="https://pl31721005.profitableratecpmnetwork.com/2b2b0152bf2e6dc65de7161495e8eb8e/invoke.js"></script>
</body>
</html>`;

  return (
    <div
      className={`my-4 w-full flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface/70 p-3 shadow-lg backdrop-blur-sm ${className}`}
    >
      <div className="w-full flex items-center justify-between pb-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 px-1">
        <span className="text-accent-purple flex items-center gap-1.5 font-bold">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-purple animate-pulse"></span>
          {label}
        </span>
        <span className="text-gray-500 font-mono text-[9px]">Advertisement</span>
      </div>

      <div className="w-full overflow-hidden flex justify-center items-center min-h-[250px]">
        <iframe
          srcDoc={htmlContent}
          title="Gaming Advertisement"
          className="w-full max-w-[728px] h-[260px] border-0"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
};

export default AdBanner;
