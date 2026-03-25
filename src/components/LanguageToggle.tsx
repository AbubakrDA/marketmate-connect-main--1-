import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { lang, setLang } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="gap-1"
    >
      <Globe className="h-4 w-4" />
      {lang === 'en' ? 'عربي' : 'EN'}
    </Button>
  );
};
