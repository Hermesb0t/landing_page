// components/HowItWorks.tsx
export default function HowItWorks() {
    return (
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get your Facebook chatbot up and running in just 3 simple steps</p>
          </div>
  
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Facebook Messenger"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
  
            <div className="md:w-1/2 md:pl-12">
              {[{
                num: '1',
                title: 'Connect Your Facebook Page',
                desc: 'Authorize our platform to access your Facebook Business Page with just a few clicks.',
              },{
                num: '2',
                title: 'Customize Your Chatbot',
                desc: "Use our intuitive builder to create conversation flows, set up responses, and personalize your bot's personality.",
              },{
                num: '3',
                title: 'Go Live & Engage Customers',
                desc: 'Activate your chatbot and start engaging with customers instantly. Monitor performance and make adjustments as needed.',
              }].map(({ num, title, desc }) => (
                <div key={num} className="mb-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-500 text-white  rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">{num}</div>
                    <div>
                      <h3 className="text-xl font-semibold dark:text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-600">{desc}</p>
                    </div>
                  </div>
                  {num !== '3' && <hr className="border-dashed border-blue-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  