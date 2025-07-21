import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import UserAvatar from './UserAvatar';
import { 
  Code, 
  Zap, 
  Shield, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Github, 
  Chrome,
  Sparkles,
  Target,
  Clock,
  Award
} from 'lucide-react';

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Reviews",
      description: "Get instant, intelligent code reviews powered by advanced AI technology"
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: "GitHub Integration",
      description: "Connect your repositories for comprehensive codebase analysis"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security Analysis",
      description: "Identify vulnerabilities and security issues in your code"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Best Practices",
      description: "Learn industry standards and improve code quality"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Instant Feedback",
      description: "Get reviews in seconds, not hours or days"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Metrics",
      description: "Track code quality improvements over time"
    }
  ];

  const pricingPlans = [
    {
      name: "Guest",
      price: "Free",
      credits: "5 Credits",
      features: [
        "Basic code review",
        "Syntax analysis",
        "Simple suggestions",
        "Limited features"
      ],
      buttonText: "Try Now",
      buttonLink: "/dashboard",
      popular: false
    },
    {
      name: "Starter",
      price: "₹50",
      credits: "100 Credits",
      features: [
        "Advanced AI reviews",
        "GitHub integration",
        "Security analysis",
        "Best practice suggestions",
        "Code improvement tips",
        "Priority support"
      ],
      buttonText: "Get Started",
      buttonLink: "/register",
      popular: true
    },
    {
      name: "Pro",
      price: "₹200",
      credits: "500 Credits",
      features: [
        "Everything in Starter",
        "Repository analysis",
        "Team collaboration",
        "Custom rules",
        "Advanced metrics",
        "24/7 support"
      ],
      buttonText: "Go Pro",
      buttonLink: "/register",
      popular: false
    }
  ];

  const repoSizes = [
    {
      size: "Small Repository",
      credits: "5 Credits",
      description: "Up to 10 files, perfect for small projects",
      icon: "📁"
    },
    {
      size: "Medium Repository",
      credits: "15 Credits",
      description: "Up to 50 files, ideal for growing projects",
      icon: "📂"
    },
    {
      size: "Large Repository",
      credits: "30 Credits",
      description: "50+ files, comprehensive enterprise analysis",
      icon: "🗂️"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePilot
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <UserAvatar />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Code Reviews
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your code quality with intelligent AI reviews. Get instant feedback, 
              security analysis, and best practice suggestions for your projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Try Free Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  Get 20 Free Credits
                </Link>
              )}
            </div>
            
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>5 Free Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodePilot?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of code review with our advanced AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repository Pricing Section */}
      <section className="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GitHub</span> Repository Reviews
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect your GitHub repositories for comprehensive code analysis with transparent pricing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {repoSizes.map((repo, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4 text-center">{repo.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-center">{repo.size}</h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">
                  {repo.credits}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center">{repo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Simple, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start free, upgrade when you're ready.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <div className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{plan.credits}</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={plan.buttonLink}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Code?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust CodePilot for intelligent code reviews
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Sign Up Now
                </Link>
              )}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodePilot
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 CodePilot. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
