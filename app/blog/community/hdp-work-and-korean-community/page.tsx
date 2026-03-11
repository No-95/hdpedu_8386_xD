import Link from "next/link";

export default function HdpWorkAndKoreanCommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-700">
          Community Hub
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          HDP Work & Korean Community
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-700">
          Chao mung ban den voi cong dong HDP Work & Korean Community. Day la noi ket noi hoc vien,
          nguoi di lam va nhung ai dang quan tam den tieng Han, viec lam va cuoc song tai Han Quoc.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Viec lam</h2>
            <p className="mt-2 text-sm text-gray-600">Cap nhat co hoi viec lam va kinh nghiem phong van.</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Tieng Han</h2>
            <p className="mt-2 text-sm text-gray-600">Chia se tai lieu, meo hoc va tips giao tiep thuc te.</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Ket noi</h2>
            <p className="mt-2 text-sm text-gray-600">Trao doi voi cong dong, tim dong hanh va mentor.</p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-xl bg-rose-600 px-5 py-3 text-white font-medium hover:bg-rose-700 transition-colors"
          >
            Kham pha Blog HDP
          </Link>
        </div>
      </div>
    </div>
  );
}
