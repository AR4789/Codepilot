import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useGuest } from '../contexts/GuestContext';
import GitHubIntegration from './GitHubIntegration';
import UserAvatar from './UserAvatar';
import { toast } from 'react-toastify';
import {
  Copy,
  Download,
  Code,
  Github,
  Sparkles,
  CreditCard,
  Sun,
  Moon,
  Coins,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('code-review');
  const [correctedCode, setCorrectedCode] = useState('');

  const { user, logout, updateUserCredits } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { guestCredits, isGuestLimitReached, decrementGuestCredit } = useGuest();

  const tabs = [
    { id: 'code-review', name: 'Code Review', icon: Code },
    { id: 'github-integration', name: 'GitHub Repos', icon: Github },
  ];

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to review');
      return;
    }

    // Check credits for both authenticated and guest users
    if (user) {
      if (user.credits <= 0) {
        toast.error('Insufficient credits. Please purchase more credits to continue.');
        setShowCreditsModal(true);
        return;
      }
    } else {
      if (isGuestLimitReached) {
        toast.error('Guest limit reached! Sign up to get 20 free credits and continue using CodePilot.');
        return;
      }

      if (guestCredits <= 0) {
        toast.error('Guest credits exhausted! Create an account to get 20 free credits.');
        return;
      }
    }

    setLoading(true);
    setReview('');

    try {
      const response = await axios.post('http://localhost:5000/api/review', {
        code,
        language,
      });

      // Get the review text from backend
      const reviewText = response.data.review;
      const correctedCode = response.data.correctedCode;
      setReview(reviewText);
      setCorrectedCode(correctedCode);

      if (user) {
        if (response.data.creditsRemaining !== undefined) {
          updateUserCredits(response.data.creditsRemaining);
          toast.success(`Review completed! ${response.data.creditsRemaining} credits remaining.`);
        } else {
          // Refresh user data to get updated credits
          try {
            const userResponse = await axios.get('http://localhost:5000/api/auth/me');
            updateUserCredits(userResponse.data.credits);
            toast.success(`Review completed! ${userResponse.data.credits} credits remaining.`);
          } catch (userError) {
            toast.success('Review completed!');
          }
        }
      } else {
        const creditUsed = decrementGuestCredit();
        if (creditUsed) {
          const remaining = guestCredits - 1;
          if (remaining > 0) {
            toast.success(`Review completed! ${remaining} guest credits remaining. Sign up for 20 free credits!`);
          } else {
            toast.warning('Review completed! This was your last guest credit. Sign up now to continue!');
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to get code review';
      toast.error(errorMessage);

      if (errorMessage.includes('credits') || errorMessage.includes('Insufficient')) {
        if (user) {
          setShowCreditsModal(true);
        } else {
          toast.error('Guest credits exhausted! Create an account to continue.');
        }
      }
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  const downloadFile = (filename, code) => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('File downloaded successfully!');
  };

  const handlePurchaseCredits = async (credits, price) => {
    try {
      const response = await axios.post('http://localhost:5000/api/credits/purchase', {
        credits,
        price,
      });

      if (response.data.success) {
        updateUserCredits(response.data.newBalance);
        toast.success(`Successfully purchased ${credits} credits!`);
        setShowCreditsModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to purchase credits');
    }
  };


const languageExtensionMap = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  csharp: 'cs',
  cpp: 'cpp',
  c: 'c',
  ruby: 'rb',
  go: 'go',
  rust: 'rs',
  kotlin: 'kt',
  php: 'php',
  html: 'html',
  css: 'css',
  json: 'json',
  xml: 'xml',
  shell: 'sh',
  sql: 'sql',
  react: 'jsx',
  tsx: 'tsx',
  default: 'txt',
};

const getExtension = (lang) => {
  return languageExtensionMap[lang.toLowerCase()] || languageExtensionMap.default;
};


const downloadCode = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};


  return (
    <div className={`min-h-screen transition-colors ${isDark
      ? 'bg-gray-900 text-gray-100'
      : 'bg-gray-50 text-gray-900'
      }`}>
      {/* Header */}
      <header className={`border-b transition-colors ${isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodePilot
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {user.credits} credits
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors ${isDark
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                      }`}
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <UserAvatar />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${guestCredits <= 1
                    ? 'bg-red-100 dark:bg-red-900'
                    : guestCredits <= 2
                      ? 'bg-yellow-100 dark:bg-yellow-900'
                      : 'bg-green-100 dark:bg-green-900'
                    }`}>
                    <Coins className={`h-4 w-4 ${guestCredits <= 1
                      ? 'text-red-600'
                      : guestCredits <= 2
                        ? 'text-yellow-600'
                        : 'text-green-600'
                      }`} />
                    <span className={`text-sm font-medium ${guestCredits <= 1
                      ? 'text-red-800 dark:text-red-200'
                      : guestCredits <= 2
                        ? 'text-yellow-800 dark:text-yellow-200'
                        : 'text-green-800 dark:text-green-200'
                      }`}>
                      {guestCredits} guest credits
                    </span>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors ${isDark
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                      }`}
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">
                      Guest Mode - Limited Features
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => window.location.href = '/register'}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white rounded-lg transition-all duration-300"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Guest Credits Exhausted Banner */}
          {!user && isGuestLimitReached && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Guest Credits Exhausted!</h3>
                    <p className="text-blue-100">
                      Sign up now to get 20 free credits and unlock unlimited reviews
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/register'}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Low Credits Warning for Guests */}
          {!user && !isGuestLimitReached && guestCredits <= 2 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Only {guestCredits} credits left!</h4>
                    <p className="text-yellow-100 text-sm">
                      Sign up to get 20 free credits and never run out
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/register'}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  Get 20 Free Credits
                </button>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Code Review Platform
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get instant feedback on your code and GitHub repositories from our advanced AI reviewer
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'code-review' && (
            <div className="space-y-6">
              {/* Code Input Section */}
              <div className={`rounded-xl border p-6 shadow-lg ${isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
                }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Your Code</span>
                    </h3>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium">Language:</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      >
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    className={`w-full h-64 p-4 rounded-lg border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder="Paste your code here for AI review..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {user ? (
                        <span className="text-gray-500">{user.credits} credits remaining</span>
                      ) : (
                        <div className="flex flex-col space-y-1">
                          <span className={`${guestCredits <= 1
                            ? 'text-red-600 font-medium'
                            : guestCredits <= 2
                              ? 'text-yellow-600 font-medium'
                              : 'text-gray-500'
                            }`}>
                            {guestCredits} guest credits remaining
                          </span>
                          {guestCredits <= 2 && (
                            <span className="text-blue-600 text-xs font-medium">
                              Sign up for 20 free credits! 🚀
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !code.trim() || (!user && isGuestLimitReached)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{loading ? 'Analyzing...' : 'Review Code'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Results */}
              {review && correctedCode && (
                <div className="space-y-6">
                  {/* AI Review */}
                  <div className={`rounded-xl border p-6 shadow-lg ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <span>AI Review Results</span>
                      </h3>
                    </div>
                    <div className="flex space-x-4">
                      {/* Suggestions Box */}
                      <div className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Suggestions:</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(review)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Copy Suggestions"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => downloadFile(`review_${language}_${Date.now()}.txt`, review)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Download Suggestions"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className={`whitespace-pre-wrap text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {review.split('\n').map((line, i) => (
                            line.match(/^\d+\./) ? (
                              <p key={i} className="mb-1">{line}</p>
                            ) : (
                              <p key={i}>{line}</p>
                            )
                          ))}
                        </div>
                      </div>


                      {/* Corrected Code Box */}
                      <div className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Corrected Code:</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(correctedCode)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Copy Corrected Code"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                          onClick={() => {
                                const ext = getExtension(language);
                                downloadCode(`corrected_${language}_${Date.now()}.${ext}`, correctedCode);
                              }}                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Download Corrected Code"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <pre className={`whitespace-pre-wrap text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {correctedCode ? (
                            correctedCode
                          ) : (
                            <span className="text-gray-500">No corrected code provided in response</span>
                          )}
                        </pre>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'github-integration' && (
            <GitHubIntegration />
          )}
        </div>
      </main>

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="text-center mb-6">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Purchase Credits</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                You need credits to continue using CodePilot
              </p>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => handlePurchaseCredits(100, 50)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isDark
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">100 Credits</div>
                    <div className="text-sm text-gray-500">Perfect for regular use</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">₹50</div>
                </div>
              </div>

              <div
                onClick={() => handlePurchaseCredits(250, 120)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isDark
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">250 Credits</div>
                    <div className="text-sm text-gray-500">Best value - Save ₹5!</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">₹120</div>
                </div>
              </div>

              <div
                onClick={() => handlePurchaseCredits(500, 200)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isDark
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">500 Credits</div>
                    <div className="text-sm text-gray-500">For power users - Save ₹50!</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">₹200</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCreditsModal(false)}
              className={`w-full mt-6 py-2 px-4 rounded-lg border transition-colors ${isDark
                ? 'border-gray-600 hover:bg-gray-700'
                : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
