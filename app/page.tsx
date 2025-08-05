import { ClipboardForm } from '@/components/clipboard/ClipboardForm';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">在线剪贴板</h1>
        <p className="text-gray-600">快速分享文本内容，15分钟后自动删除</p>
      </div>
      <ClipboardForm />
    </main>
  );
}
