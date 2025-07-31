// components/Footer.tsx
import { FaFacebookMessenger, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Image from 'next/image';
;

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Image
                    src="/images/logo.png"
                    alt="HermesBot Logo"
                    width={100}
                    height={30}
                    className="h-15 w-auto" 
                />
                <span className="text-xl font-bold ml-0.1">HermesBot</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                AI-powered Facebook Chatbot solutions to help your business grow and engage customers 24/7.
              </p>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it works</a></li>
                  <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
  
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Trinityx. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
}
  