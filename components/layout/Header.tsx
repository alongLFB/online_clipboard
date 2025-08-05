export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-xl font-bold">
            在线剪贴板
          </a>
          <p className="text-sm text-gray-600">
            快速分享，15分钟自动删除
          </p>
        </div>
      </div>
    </header>
  );
}