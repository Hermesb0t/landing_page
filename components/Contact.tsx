// components/Contact.tsx
export default function Contact() {
    return (
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex">
            {/* Contact Info */}
                <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Have questions or want to learn more about our chatbot solutions? Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <span className="text-blue-600 text-lg">📧</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email Us</h4>
                        <p className="text-gray-600">info@hermesbot.me</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <span className="text-blue-600 text-lg">📞</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Call Us</h4>
                        <p className="text-gray-600">+976 88080854</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <span className="text-blue-600 text-lg">📍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Visit Us</h4>
                        <p className="text-gray-600">Ulaanbaatar, Mongolia</p>
                      </div>
                    </div>
                  </div>
                </div>
            {/* Contact Form */}
            <div className="md:w-1/2">
                <form
                    action="https://formspree.io/f/mldllndn" 
                    method="POST"
                    className="space-y-6"
                >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="_replyto"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Send Message
                    </button>
                </form>
            </div>
          </div>
        </div>
      </section>
    )
  }
  