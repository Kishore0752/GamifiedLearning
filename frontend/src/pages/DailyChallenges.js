import React, { useState, useEffect } from 'react';
import { getDailyChallenge, submitChallenge } from '../services/api';

export default function DailyChallenges() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userSolution, setUserSolution] = useState('');
  const [result, setResult] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName');

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  // Timer countdown for next challenge
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDailyChallenge = async () => {
    try {
      setLoading(true);
      const data = await getDailyChallenge();
      setChallenge(data);
      setUserSolution('');
      setResult(null);
      setAttempted(false);
    } catch (error) {
      console.error('Failed to load challenge:', error);
      alert('Failed to load today\'s challenge. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();

    if (!userSolution.trim()) {
      alert('Please enter your solution');
      return;
    }

    if (!currentUserId) {
      alert('Please log in to submit');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitChallenge({
        userId: currentUserId,
        challengeId: challenge._id,
        solution: userSolution.trim()
      });

      setResult(response);
      setAttempted(true);

      if (response.correct) {
        alert(`🎉 Correct! You earned ${response.xpEarned} XP!`);
      } else {
        alert(`❌ Incorrect. Try again!\n${response.feedback || 'Check your logic.'}`);
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      alert('Failed to submit solution. Make sure backend is running!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">🎮</div>
          <p className="text-slate-400">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-5xl font-black mb-2">
          <span className="gradient-text">🏆 Daily Challenge</span>
        </h1>
        <p className="text-slate-400">Solve one puzzle every day and earn XP</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Challenge */}
        <div className="lg:col-span-2 space-y-6">
          {challenge && (
            <div className="glass-card p-8 animate-fade-in">
              {/* Challenge Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {challenge.title}
                  </h2>
                  <div className="flex gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      challenge.difficulty === 'Easy' 
                        ? 'bg-green-600/20 border border-green-500/50 text-green-300'
                        : challenge.difficulty === 'Medium'
                        ? 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-300'
                        : 'bg-red-600/20 border border-red-500/50 text-red-300'
                    }`}>
                      {challenge.difficulty} Level
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600/20 border border-indigo-500/50 text-indigo-300">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Challenge Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-200 mb-3">Problem Statement</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {challenge.description}
                </p>
              </div>

              {/* Examples */}
              {challenge.examples && challenge.examples.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-200 mb-3">Examples</h3>
                  <div className="space-y-3">
                    {challenge.examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-2">
                          <span className="font-semibold">Input:</span> {example.input}
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold">Output:</span> {example.output}
                        </p>
                        {example.explanation && (
                          <p className="text-sm text-slate-400 mt-2">
                            <span className="font-semibold">Explanation:</span> {example.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {challenge.hints && challenge.hints.length > 0 && (
                <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-300 mb-2">💡 Hints</h3>
                  <ul className="text-sm text-blue-200 space-y-1">
                    {challenge.hints.map((hint, idx) => (
                      <li key={idx}>• {hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solution Form */}
              <form onSubmit={handleSubmitSolution} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Your Solution
                  </label>
                  <textarea
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    placeholder="Enter your solution here..."
                    className="input-enhanced w-full px-4 py-3 resize-none"
                    rows="6"
                    disabled={attempted && result?.correct}
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Enter your answer/solution. Format depends on the problem.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || (attempted && result?.correct)}
                  className="w-full btn-gradient font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span> Checking...
                    </>
                  ) : attempted && result?.correct ? (
                    <>
                      <span>✅</span> Solved Today!
                    </>
                  ) : (
                    <>
                      <span>🚀</span> Submit Solution
                    </>
                  )}
                </button>
              </form>

              {/* Result Display */}
              {attempted && result && (
                <div className={`p-4 rounded-lg mt-6 ${
                  result.correct
                    ? 'bg-green-600/20 border border-green-500/50'
                    : 'bg-red-600/20 border border-red-500/50'
                }`}>
                  <p className={`font-semibold text-lg ${
                    result.correct ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {result.correct ? '🎉 Congratulations!' : '❌ Not Quite Right'}
                  </p>
                  {result.feedback && (
                    <p className={`text-sm mt-2 ${
                      result.correct ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {result.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Time Until Next Challenge */}
          {timeRemaining && (
            <div className="glass-card p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-200 mb-4">
                ⏰ Time Until Next Challenge
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-3xl font-black text-indigo-400">
                    {timeRemaining.hours.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Hours</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-indigo-400">
                    {timeRemaining.minutes.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Minutes</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-indigo-400">
                    {timeRemaining.seconds.toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Seconds</p>
                </div>
              </div>
            </div>
          )}

          {/* Challenge Info */}
          <div className="glass-card p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-200 mb-4">ℹ️ Challenge Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 uppercase">Category</p>
                <p className="text-sm text-slate-200 font-semibold">
                  {challenge?.category || 'General'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Difficulty</p>
                <p className="text-sm text-slate-200 font-semibold">
                  {challenge?.difficulty || 'Medium'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">XP Reward</p>
                <p className="text-sm text-indigo-300 font-bold">
                  +{challenge?.xpReward || 50} XP
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Solve Rate</p>
                <p className="text-sm text-slate-200 font-semibold">
                  {challenge?.solveCount || 0} solved today
                </p>
              </div>
            </div>
          </div>

          {/* Your Status */}
          {currentUserName && (
            <div className="glass-card p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-200 mb-4">👤 Your Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {currentUserName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  {currentUserName}
                </span>
              </div>
              {attempted && result ? (
                <div className={`p-3 rounded-lg text-center text-sm font-bold ${
                  result.correct
                    ? 'bg-green-600/20 border border-green-500/50 text-green-300'
                    : 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-300'
                }`}>
                  {result.correct ? '✅ Solved' : '⚠️ Attempted'}
                </div>
              ) : (
                <div className="p-3 rounded-lg text-center text-sm font-bold bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  ❓ Not Attempted
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
