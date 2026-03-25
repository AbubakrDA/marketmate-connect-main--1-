import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">M</div>
              <span className="font-bold text-foreground">{t('app_name')}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('hero_subtitle')}</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('explore')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/marketplace" className="hover:text-foreground">{t('marketplace')}</Link>
              <Link to="/businesses" className="hover:text-foreground">{t('businesses')}</Link>
              <Link to="/map" className="hover:text-foreground">{t('map')}</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('categories')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/marketplace?category=Clinics" className="hover:text-foreground">{t('clinics')}</Link>
              <Link to="/marketplace?category=Real+Estate" className="hover:text-foreground">{t('real_estate')}</Link>
              <Link to="/marketplace?category=Fashion" className="hover:text-foreground">{t('fashion')}</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t('for_business')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/register/business" className="hover:text-foreground">{t('register_business')}</Link>
              <Link to="/login" className="hover:text-foreground">{t('business_login')}</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t('app_name')}. {t('all_rights')}
        </div>
      </div>
    </footer>
  );
};
