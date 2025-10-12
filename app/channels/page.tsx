import Link from "next/link";
import { FaFacebookMessenger, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ChannelsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Choose Your Channel</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {/* Messenger */}
        <Link href="/permissions" className="group">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center cursor-pointer border hover:border-indigo-500">
            <div className="flex justify-center mb-4">
              <FaFacebookMessenger size={48} className="opacity-60"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
              Messenger
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Automate chats and engage with your Messenger audience.
            </p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              Connect
            </button>
          </div>
        </Link>

        {/* Instagram */}
        <div className="p-6 bg-gray-100 rounded-2xl shadow text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <FaInstagram size={48} className="opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-gray-500">Instagram</h3>
          <p className="text-sm text-gray-400 mt-2">
            Coming soon — stay tuned!
          </p>
          <button
            disabled
            className="mt-4 px-4 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        {/* WhatsApp */}
        <div className="p-6 bg-gray-100 rounded-2xl shadow text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <FaWhatsapp size={48} className="opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-gray-500">WhatsApp</h3>
          <p className="text-sm text-gray-400 mt-2">
            Coming soon — stay tuned!
          </p>
          <button
            disabled
            className="mt-4 px-4 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </main>
  );
}
