// src/components/GoogleTranslate.tsx
import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const GoogleTranslate = () => {
  const translateTo = (lang: string) => {
    const googtrans = lang === 'en' ? '/en/en' : '/en/hi';
    document.cookie = `googtrans=${googtrans}; path=/; max-age=86400`;
    window.location.reload();
  };

  useEffect(() => {
    const scriptId = 'google-translate-script';

    // Prevent loading script multiple times
    if (document.getElementById(scriptId)) {
      return;
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element_hidden'
        );
      }
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  // Inject global styles to hide the annoying banner
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'google-translate-hide-banner';
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-banner-frame {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
      }
      
      body {
        top: 0 !important;
        margin-top: 0 !important;
      }

      .skiptranslate {
        display: none !important;
      }

      iframe.goog-te-banner-frame {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('google-translate-hide-banner');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  return (
    <>
      {/* Clean Language Switcher Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => translateTo('en')}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition active:scale-95"
        >
          English
        </button>
        <button
          onClick={() => translateTo('hi')}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition active:scale-95"
        >
          हिंदी
        </button>
      </div>

      {/* Hidden container required by Google Translate */}
      <div id="google_translate_element_hidden" className="hidden"></div>
    </>
  );
};

export default GoogleTranslate;