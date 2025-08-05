import { ClipboardView } from "@/components/clipboard/ClipboardView";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container mx-auto px-4 py-8">
      <ClipboardView id={id} />
    </main>
  );
}
