"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeNames, localeEmojis, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Handle locale prefix
    const currentLocale = locale;
    let newPath = pathname;

    // Remove current locale prefix if present
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.slice(`/${currentLocale}`.length) || "/";
    }

    // Add new locale prefix (unless it's the default 'ja')
    if (newLocale !== "ja") {
      newPath = `/${newLocale}${newPath}`;
    }

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-mononoke-kurogane/30 border border-mononoke-giniro/20">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
            ${
              locale === loc
                ? "bg-gradient-shrine text-white shadow-glow-sakura"
                : "text-mononoke-giniro hover:text-white hover:bg-mononoke-murasaki/20"
            }
          `}
          aria-label={`Switch to ${localeNames[loc]}`}
        >
          <span className="mr-1.5">{localeEmojis[loc]}</span>
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}
