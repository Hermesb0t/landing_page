// components/Pricing.tsx
export default function Pricing() {
    return (
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent pricing with plans to fit businesses of all sizes
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <p className="text-gray-600 mb-6">Ideal for small businesses just getting started.</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal">/month</span></div>
              <ul className="mb-8 space-y-3 text-gray-600 flex-1">
                <li>Up to 1,000 messages/month</li>
                <li>Basic AI responses</li>
                <li>Email support</li>
              </ul>
              <button className="bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all">
                Choose Basic
              </button>
            </div>
  
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Pro</h3>
              <p className="text-gray-600 mb-6">For growing businesses that need more features.</p>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg font-normal">/month</span></div>
              <ul className="mb-8 space-y-3 text-gray-600 flex-1">
                <li>Up to 10,000 messages/month</li>
                <li>Advanced AI & analytics</li>
                <li>Priority email support</li>
              </ul>
              <button className="bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all">
                Choose Pro
              </button>
            </div>
  
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <p className="text-gray-600 mb-6">Custom solutions for large businesses and agencies.</p>
              <div className="text-4xl font-bold mb-6">Contact Us</div>
              <ul className="mb-8 space-y-3 text-gray-600 flex-1">
                <li>Unlimited messages</li>
                <li>Dedicated account manager</li>
                <li>24/7 phone support</li>
              </ul>
              <button className="bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  