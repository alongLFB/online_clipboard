export function Footer() {
  return (
    <footer className="border-t border-border-default mt-auto">
      <div className="text-center mx-auto px-4 py-4">
        <p>© 2025 在线剪贴板. 保留所有权利.</p>
        <p>
          作者: <span className="text-fg-secondary">alongLFB</span> |
          <a
            href="https://github.com/alongLFB/online_clipboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            GitHub
          </a>
        </p>
        <p className="text-center text-sm text-fg-secondary">
          安全提示：请勿分享敏感信息，所有内容将在15分钟后自动删除
        </p>
      </div>
    </footer>
  );
}
