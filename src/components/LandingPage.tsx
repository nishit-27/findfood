import { Link } from 'react-router-dom';
import { Camera, Utensils, BarChart, Shield, ArrowRight, Star, Users, Award, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
        <nav className="absolute top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CalorieTracker</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-block bg-purple-100 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-purple-600 text-sm font-medium">
                    AI-Powered Nutrition Tracking
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight">
                  Track Your Calories with{' '}
                  <span className="text-purple-600 relative">
                    AI Precision
                    <svg className="absolute w-full h-3 -bottom-2 left-0 text-purple-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                      <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Transform your nutrition journey with our AI-powered calorie tracking app.
                  Simply snap a photo of your food and let our advanced AI do the rest.
                </p>

                <div className="flex justify-center space-x-4 pt-4">
                  <Link
                    to="/register"
                    className="bg-purple-600 text-white px-8 py-3.5 rounded-full hover:bg-purple-700 transition-colors flex items-center text-lg shadow-md hover:shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <a
                    href="#features"
                    className="border-2 border-purple-200 text-gray-700 px-8 py-3.5 rounded-full hover:border-purple-300 hover:bg-purple-50 transition-all text-lg"
                  >
                    Learn More
                  </a>
                </div>

                <div className="pt-12 flex justify-center items-center space-x-8">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-2 text-gray-600">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="ml-2 text-gray-600">10K+ Users</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="ml-2 text-gray-600">#1 in Nutrition</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Your Health Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to maintain a healthy lifestyle, all in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Camera className="h-8 w-8 text-purple-600" />,
                title: "Snap & Track",
                description: "Take a photo of your meal and get instant nutritional information powered by advanced AI technology."
              },
              {
                icon: <BarChart className="h-8 w-8 text-purple-600" />,
                title: "Detailed Analytics",
                description: "View comprehensive reports of your daily and weekly nutrition intake with beautiful visualizations."
              },
              {
                icon: <Shield className="h-8 w-8 text-purple-600" />,
                title: "Privacy First",
                description: "Your data is encrypted and securely stored with industry-standard protection protocols."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-purple-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Health Enthusiasts</h2>
            <p className="text-gray-600">See what our users have to say about their journey with CalorieTracker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fitness Trainer",
                content: "The AI accuracy in identifying foods is incredible. It's made tracking my clients' nutrition so much easier!"
              },
              {
                name: "Mike Chen",
                role: "Health Enthusiast",
                content: "I've tried many calorie tracking apps, but this is by far the most user-friendly and accurate one."
              },
              {
                name: "Emma Davis",
                role: "Nutritionist",
                content: "The detailed nutrition breakdown helps me provide better guidance to my patients. A game-changer!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Start Your Health Journey Today
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their lifestyle with CalorieTracker.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full hover:bg-purple-50 transition-colors text-lg font-semibold shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions? Our team is here to help you on your journey to better health.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-gray-600">support@calorietracker.com</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-8 rounded-2xl">
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-600"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-600"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-600"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Utensils className="h-6 w-6 text-purple-600" />
                <span className="ml-2 text-lg font-bold">CalorieTracker</span>
              </div>
              <p className="text-gray-600 text-sm">Making healthy eating easier with AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="/careers" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-gray-900">Terms</a></li>
                <li><a href="/security" className="text-gray-600 hover:text-gray-900">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} CalorieTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 