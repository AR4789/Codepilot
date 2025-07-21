import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGuest } from '../contexts/GuestContext';
import { Github, Folder, FileText, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const GitHubIntegration = () => {
  const { user } = useAuth();
  const { guestCredits, decrementGuestCredit, isGuestLimitReached } = useGuest();
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repoData, setRepoData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Repository size categories
  const getRepoSize = (fileCount) => {
    if (fileCount <= 10) return { size: 'Small', credits: 5, color: 'text-green-600' };
    if (fileCount <= 50) return { size: 'Medium', credits: 15, color: 'text-yellow-600' };
    return { size: 'Large', credits: 30, color: 'text-red-600' };
  };

  const parseGitHubUrl = (url) => {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
    return null;
  };

  const fetchRepoInfo = async (owner, repo) => {
    try {
      // Simulate GitHub API call (in real implementation, you'd use GitHub API)
      const mockRepoData = {
        name: repo,
        owner: owner,
        description: `${repo} repository`,
        language: 'JavaScript',
        fileCount: Math.floor(Math.random() * 100) + 5, // Random file count for demo
        size: Math.floor(Math.random() * 1000) + 100, // KB
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      return mockRepoData;
    } catch (error) {
      throw new Error('Failed to fetch repository information');
    }
  };

const analyzeRepository = async () => {
  if (!githubUrl.trim()) {
    toast.error('Please enter a GitHub repository URL');
    return;
  }

  const parsedUrl = parseGitHubUrl(githubUrl);
  if (!parsedUrl) {
    toast.error('Please enter a valid GitHub repository URL');
    return;
  }

  setIsAnalyzing(true);

  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: githubUrl, // Send the URL or relevant code
        language: 'JavaScript', // Specify the language
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setAnalysisResult(data);
      toast.success('Repository analyzed successfully!');
    } else {
      toast.error(data.error || 'Failed to analyze repository');
    }
  } catch (error) {
    toast.error('An error occurred while analyzing the repository');
  } finally {
    setIsAnalyzing(false);
  }
};


  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const downloadCode = (filename, code) => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* GitHub URL Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Github className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            GitHub Repository Analysis
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <button
            onClick={analyzeRepository}
            disabled={isAnalyzing || (!user && isGuestLimitReached)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing Repository...</span>
              </>
            ) : (
              <>
                <Github className="h-5 w-5" />
                <span>Analyze Repository</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Repository Information */}
      {repoData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Repository Information
            </h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${repoData.sizeInfo.color} bg-gray-100 dark:bg-gray-700`}>
              {repoData.sizeInfo.size} Repository - {repoData.sizeInfo.credits} Credits
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Folder className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Repository</p>
                <p className="font-medium text-gray-900 dark:text-white">{repoData.owner}/{repoData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Files</p>
                <p className="font-medium text-gray-900 dark:text-white">{repoData.fileCount}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                <p className="font-medium text-gray-900 dark:text-white">{repoData.language}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Summary
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analysisResult.summary.totalFiles}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Files Analyzed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analysisResult.summary.linesOfCode.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Lines of Code</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {analysisResult.summary.issues}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Issues Found</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {analysisResult.summary.suggestions}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Suggestions</div>
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Issues & Suggestions
            </h4>
            
            <div className="space-y-4">
              {analysisResult.issues.map((issue, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className={`h-5 w-5 ${
                        issue.severity === 'High' ? 'text-red-500' :
                        issue.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {issue.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {issue.file}:{issue.line}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {issue.message}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Code */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Improved Code
            </h4>
            
            <div className="space-y-6">
              {Object.entries(analysisResult.improvedCode).map(([filename, code]) => (
                <div key={filename} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{filename}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(code)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadCode(filename, code)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubIntegration;
