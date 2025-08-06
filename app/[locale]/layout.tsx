import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientThemeProvider } from "@/components/providers/theme-provider-client";
import "../globals.css";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const title = (messages.app?.title as string) || "Online Clipboard";
  const description =
    (messages.app?.description as string) || "Share text content quickly";

  return {
    title: `${title} - ${locale === "zh" ? "中文" : "English"}`,
    description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params to get the locale
  const { locale } = await params;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientThemeProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <Toaster position="top-center" />
          </ClientThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
