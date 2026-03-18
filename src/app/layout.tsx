import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastCompanyAI — AI 代码生成平台",
  description: "用自然语言构建你的应用。AI 驱动的下一代全栈代码生成平台，支持实时预览。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-noise">
        {/* Aurora background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
          <div className="bg-grid absolute inset-0" />
        </div>

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
