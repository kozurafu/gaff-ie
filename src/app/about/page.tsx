import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Gaff.ie — Irish Property, Done Right',
  description: 'Gaff.ie is the Irish property platform built to fix what Daft.ie gets wrong. Verification-first, free listings, working messaging, and AI scam detection.',
};

const values = [
  { icon: '🛡️', title: 'Verification First', desc: 'Every landlord verified. Every listing real. No more guessing if that €800/mo 2-bed in Dublin 4 actually exists.' },
  { icon: '💶', title: 'Free Basic Listings', desc: "Daft charges €135–€999 to list a property. We believe listing should be free. Always. Premium features available if you want them." },
  { icon: '💬', title: 'Messaging That Works', desc: "Daft's messaging is famously broken. Ours actually delivers messages, tracks read receipts, and keeps conversations organised." },
  { icon: '🤖', title: 'AI Scam Detection', desc: 'Our scam detection AI analyses every listing for red flags — suspicious pricing, duplicate images, off-platform payment requests — before it goes live.' },
];

const stats = [
  { value: '€0', label: 'To list a property' },
  { value: '100%', label: 'Landlord verification' },
  { value: '< 1min', label: 'Average response time' },
  { value: '32', label: 'Counties covered' },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gaff-slate to-gray-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Irish Property,<br />
            <span className="text-gaff-teal-light">Done Right</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Gaff.ie is the property platform Ireland deserves. Built in 2026 by people who were sick of fake listings, broken messaging, and paying a fortune just to advertise a spare room.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-gaff-teal">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate text-center mb-12">Why We Built Gaff.ie</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(v => (
              <div key={v.title} className="p-6 rounded-2xl border border-gray-100 hover:border-gaff-teal/30 transition-colors">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gaff-slate text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gaff-slate mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              In 2026, we looked at the Irish rental market and saw a system that wasn&apos;t working for anyone. Tenants were wading through fake listings, paying application fees for properties that didn&apos;t exist, and never hearing back from landlords. Landlords were paying hundreds of euros just to list a property, dealing with no-show viewings and zero screening tools.
            </p>
            <p>
              Daft.ie — the incumbent — had become complacent. Broken messaging, no verification, and a pricing model that made listing a single property cost more than a month&apos;s Netflix subscription. We knew there had to be a better way.
            </p>
            <p>
              So we built Gaff.ie. A platform where every landlord is verified, every listing is real, messaging actually works, and AI catches scams before they reach tenants. And yes — basic listings are free. Because charging someone €135 to post a rental ad in a housing crisis is, frankly, taking the piss.
            </p>
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gaff-slate mb-4">The Team</h2>
          <p className="text-gray-500 mb-10">Built in Ireland, for Ireland.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Coming Soon', role: 'Founder & CEO' },
              { name: 'Coming Soon', role: 'CTO' },
              { name: 'Coming Soon', role: 'Head of Trust & Safety' },
            ].map((m, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50">
                <div className="w-16 h-16 rounded-full bg-gaff-teal/10 mx-auto mb-3 flex items-center justify-center text-gaff-teal text-2xl">👤</div>
                <div className="font-semibold text-gaff-slate">{m.name}</div>
                <div className="text-sm text-gray-500">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
