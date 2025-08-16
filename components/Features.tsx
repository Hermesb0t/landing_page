// components/Features.tsx
export default function Features() {
    return (
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-900 max-w-3xl mx-auto">
              Everything you need to automate and enhance your Facebook Messenger experience
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-robot text-blue-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">AI-Powered Responses</h3>
              <p className="text-gray-600">
                Our chatbots understand natural language and provide intelligent, context-aware responses to customer inquiries.
              </p>
            </div>
  
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-green-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">Instant Setup</h3>
              <p className="text-gray-600">
                Get started in minutes with our easy-to-use platform. No coding required - just connect to your Facebook Page.
              </p>
            </div>
  
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-purple-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track conversations, measure performance, and gain insights to optimize your chatbot strategy.
              </p>
            </div>
  
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-shopping-cart text-yellow-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">E-commerce Integration</h3>
              <p className="text-gray-600">
                Enable customers to browse products, check prices, and make purchases directly through Messenger.
              </p>
            </div>
  
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-calendar-alt text-red-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">Appointment Scheduling</h3>
              <p className="text-gray-600">
                Let customers book appointments, check availability, and receive reminders - all within Messenger.
              </p>
            </div>
  
            <div className="feature-card bg-white p-8 rounded-xl shadow-md transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-headset text-indigo-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-900 mb-3">Human Handoff</h3>
              <p className="text-gray-600">Seamlessly transfer complex inquiries to your human support team when needed.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  