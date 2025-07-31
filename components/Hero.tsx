// components/Hero.tsx
export default function Hero() {
    return (
      <section id="hero" className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Your Business with AI-Powered Facebook Chatbots
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Engage customers 24/7, automate responses, and boost conversions with our intelligent chatbot solutions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#contact"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg text-center transition-all"
                >
                  Get Started
                </a>
                <a
                  href="#how-it-works"
                  className="border-2 border-white hover:bg-white hover:bg-opacity-10 font-semibold py-3 px-6 rounded-lg text-center transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative max-w-md">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-400 rounded-full opacity-20"></div>
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden" style={{ width: 300, height: 500 }}>
                  <div className="bg-gray-100 p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <i className="fab fa-facebook-messenger text-sm"></i>
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-sm">Hermes Bot</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                  </div>
                  <div className="p-4 h-96 overflow-y-auto">
                    <div className="flex mb-4">
                      <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Hi there! How can I help you today?</p>
                      </div>
                    </div>
                    <div className="flex mb-4 justify-end">
                      <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                        <p className="text-sm">I&apos;d like to know about your pricing</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">
                          We offer flexible plans starting at $29/month. Would you like me to send you more details?
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                        <div className="flex space-x-2">
                          <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded">Yes, please</button>
                          <button className="border border-gray-300 text-xs px-3 py-1 rounded">Maybe later</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="ml-2 bg-blue-500 text-white rounded-full p-2">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  