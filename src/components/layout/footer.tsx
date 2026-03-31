import Link from 'next/link';
import { APP_CONFIG, ROUTES } from '@/constants';

/**
 * Main footer component
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { href: ROUTES.SHOP.PRODUCTS, label: 'Todos los productos' },
      { href: ROUTES.SHOP.SEARCH, label: 'Buscar' },
    ],
    account: [
      { href: ROUTES.USER.PROFILE, label: 'Mi cuenta' },
      { href: ROUTES.USER.ORDERS, label: 'Mis pedidos' },
      { href: ROUTES.USER.WISHLIST, label: 'Lista de deseos' },
    ],
    help: [
      { href: ROUTES.STATIC.FAQ, label: 'Preguntas frecuentes' },
      { href: ROUTES.STATIC.CONTACT, label: 'Contacto' },
    ],
    legal: [
      { href: ROUTES.STATIC.TERMS, label: 'Términos y condiciones' },
      { href: ROUTES.STATIC.PRIVACY, label: 'Política de privacidad' },
    ],
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Tienda</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Mi cuenta</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Ayuda</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} {APP_CONFIG.NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
