import Link from 'next/link';

const navItems = [
  { key: 'dashboard', label: 'Dashboard Ana Sayfasi', href: '/dashboard' },
  { key: 'chat-history', label: 'Sohbet Gecmisi', href: '/chat-history' },
  { key: 'appointments', label: 'Randevular', href: '/appointments' },
] as const;

type DashboardNavKey = typeof navItems[number]['key'];

type DashboardNavProps = {
  active: DashboardNavKey;
};

export default function DashboardNav({ active }: DashboardNavProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-base font-semibold text-slate-900">
              EasyChat Dashboard
            </Link>
            <p className="text-sm text-slate-500">
              Sohbet performansinizi ve randevu akisiniz tek yerden yonetin.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
