import './globals.css';

export const metadata = {
  title: 'Todo 应用原型',
  description: '一个简洁美观的待办事项管理应用',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}