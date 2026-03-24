export default function Footer() {
  return (
    <footer className="bg-gaff-slate text-gray-400 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-semibold mb-3">Gaff.ie</h4>
          <p className="text-sm leading-relaxed">
            Making housing in Ireland fair, transparent, and trustworthy.
          </p>
          <p className="text-xs mt-3 text-gray-500">
            Registered in Ireland 🇮🇪
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Tenants</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/search" className="hover:text-white transition-colors">Search properties</a></li>
            <li><a href="/auth/register" className="hover:text-white transition-colors">Get verified</a></li>
            <li><a href="/rights" className="hover:text-white transition-colors">Know your rights (RTB)</a></li>
            <li><a href="/hap" className="hover:text-white transition-colors">HAP guide</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Landlords</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/listing/new" className="hover:text-white transition-colors">List for free</a></li>
            <li><a href="/auth/register" className="hover:text-white transition-colors">Verify your property</a></li>
            <li><a href="/dashboard" className="hover:text-white transition-colors">Landlord dashboard</a></li>
            <li><a href="/pricing" className="hover:text-white transition-colors">Premium plans</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/about" className="hover:text-white transition-colors">About us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors">Privacy policy</a></li>
            <li><a href="/terms" className="hover:text-white transition-colors">Terms of service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-center">
          <span>© 2026 Gaff.ie. All rights reserved. Made in Ireland 🇮🇪</span>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🛡️ Zero scam tolerance</span>
            <span>🔒 Data protected under GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
