import DashboardNav from '../components/DashboardNav';

type CalendarEvent = {
  day: number;
  title: string;
  time: string;
  attendee: string;
  channel: string;
  isNew?: boolean;
};

type CalendarCell = {
  key: number;
  label: number | null;
  isToday: boolean;
  events: CalendarEvent[];
};

const monthNames = ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'];
const monthShortNames = ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const weekdayLabels = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cts', 'Paz'];

function buildCalendar(year: number, month: number, events: CalendarEvent[], today: Date): { cells: CalendarCell[]; label: string } {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const eventMap: Record<number, CalendarEvent[]> = {};
  for (const event of events) {
    if (!eventMap[event.day]) {
      eventMap[event.day] = [];
    }
    eventMap[event.day].push(event);
  }

  const cells: CalendarCell[] = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - offset + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;

    return {
      key: index,
      label: inMonth ? dayNumber : null,
      isToday: inMonth && dayNumber === today.getDate(),
      events: inMonth ? eventMap[dayNumber] ?? [] : [],
    };
  });

  return {
    cells,
    label: `${monthNames[month]} ${year}`,
  };
}

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const sampleAppointments: CalendarEvent[] = [
  { day: 4, title: 'EasyChat tanisma', time: '09:30', attendee: 'Ayse Yilmaz', channel: 'Google Meet', isNew: true },
  { day: 7, title: 'Destek otomasyonu', time: '11:00', attendee: 'Mert Kaya', channel: 'Zoom' },
  { day: 12, title: 'Enterprise sunumu', time: '14:30', attendee: 'Selin Aydin', channel: 'Ofis' },
  { day: 18, title: 'Teknik kurulum', time: '10:00', attendee: 'Onur Demir', channel: 'Google Meet' },
  { day: 24, title: 'Aylik degerlendirme', time: '16:00', attendee: 'Cozum ekibi', channel: 'Google Meet' },
];

const { cells: calendarCells, label: calendarLabel } = buildCalendar(currentYear, currentMonth, sampleAppointments, now);

const upcomingAppointments = sampleAppointments
  .slice()
  .sort((a, b) => a.day - b.day)
  .map((event) => ({
    ...event,
    dateLabel: `${event.day} ${monthShortNames[currentMonth]}`,
  }))
  .slice(0, 6);

const upcomingCount = sampleAppointments.filter((event) => event.day >= now.getDate()).length;
const nextSevenDaysCount = sampleAppointments.filter((event) => event.day >= now.getDate() && event.day < now.getDate() + 7).length;
const newRequestsCount = sampleAppointments.filter((event) => event.isNew).length;

const appointmentMetrics = [
  {
    label: 'Planli gorusme',
    value: sampleAppointments.length.toString(),
    helper: 'Bu ay',
  },
  {
    label: 'Bu hafta',
    value: nextSevenDaysCount.toString(),
    helper: '7 gunluk pencere',
  },
  {
    label: 'Bekleyen',
    value: upcomingCount.toString(),
    helper: 'Bugunden itibaren',
  },
  {
    label: 'Yeni talep',
    value: newRequestsCount.toString(),
    helper: 'Son 24 saat',
  },
];

const teamAvailability = [
  { name: 'Ayse Yilmaz', role: 'Satis', status: 'Musait', shift: '09:00 - 17:00', indicator: 'bg-emerald-500' },
  { name: 'Mert Kaya', role: 'Destek', status: 'Toplanti', shift: '11:00 - 12:30', indicator: 'bg-amber-500' },
  { name: 'Selin Aydin', role: 'Operasyon', status: 'Tatilde', shift: 'Donus 23 Eyl', indicator: 'bg-slate-300' },
];

const meetingTemplates = [
  { name: '30 dk tanisma', duration: '30 dk', channel: 'Google Meet', note: 'Standart demo akisi icin ideal.' },
  { name: '60 dk ayrintili sunum', duration: '60 dk', channel: 'Ofis / Zoom', note: 'Cozum detaylari ve fiyatlama.' },
  { name: 'Onboarding calistayi', duration: '90 dk', channel: 'Google Meet', note: 'Teknik ekip ile gecis planlama.' },
];

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardNav active="appointments" />
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Randevu merkezi
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Randevu planlamasi</h1>
              <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
                Google Calendar baglantisi aktif hale geldiginde, EasyChat uzerinden gelen demo talepleri otomatik olarak takviminize eklenecek.
              </p>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Takvim gorunumu</h2>
                    <p className="text-sm text-slate-500">Planli gorusmeleri haftalik bazda inceleyin.</p>
                  </div>
                  <span className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {calendarLabel}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {weekdayLabels.map((label) => (
                      <span key={label} className="py-2">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {calendarCells.map((cell) => {
                      const hasLabel = cell.label !== null;
                      return (
                        <div
                          key={cell.key}
                          className={`relative flex min-h-[92px] flex-col rounded-xl border text-left text-xs transition ${
                            hasLabel ? 'border-slate-200 bg-white hover:border-indigo-200' : 'border-transparent bg-transparent'
                          } ${cell.isToday ? 'border-indigo-500 shadow-md shadow-indigo-200' : ''}`}
                        >
                          {hasLabel && (
                            <>
                              <span className={`px-3 pt-3 text-sm font-semibold ${cell.isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                                {cell.label}
                              </span>
                              <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
                                {cell.events.slice(0, 2).map((event) => (
                                  <span
                                    key={`${event.title}-${event.time}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                                    {event.time}
                                  </span>
                                ))}
                                {cell.events.length > 2 && (
                                  <span className="text-[11px] font-medium text-indigo-500">+{cell.events.length - 2} daha</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Gelecek randevular</h2>
                    <p className="text-sm text-slate-500">Takvime dusen gorusmelerin hiza ozetini goruntuleyin.</p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                    Takvimi yenile
                  </button>
                </div>
                <div className="mt-6 space-y-3">
                  {upcomingAppointments.map((event) => (
                    <div key={`${event.title}-${event.day}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">
                          {event.dateLabel} · {event.time} · {event.channel}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p className="font-semibold uppercase tracking-wide">Yetkili</p>
                        <p>{event.attendee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Randevu metrikleri</h2>
                <p className="text-sm text-slate-500">Son aktiviteleri ve kapasiteyi izleyin.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {appointmentMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-400">{metric.helper}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Toplanti sablonlari</h2>
                    <p className="text-sm text-slate-500">Hazir akislari kullanarak hizlica davet olusturun.</p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                    Yeni sablon
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {meetingTemplates.map((template) => (
                    <div key={template.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{template.duration}</p>
                        <p className="text-sm text-slate-500">Kanal: {template.channel}</p>
                        <p className="text-sm text-slate-500">{template.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Ekip uygunlugu</h2>
                <p className="text-sm text-slate-500">Demo sunumlarini paylastiginiz ekiplerin durumunu takip edin.</p>
                <div className="mt-5 space-y-3">
                  {teamAvailability.map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${member.indicator}`}></span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{member.status}</p>
                        <p className="text-xs text-slate-400">{member.shift}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
