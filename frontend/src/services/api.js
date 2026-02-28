// src/services/api.js
const BASE_URL = 'http://localhost:5000/api';

export const api = {
    // User APIs
    registerUser: (userData) => fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(res => res.json()),
    
    loginUser: (email) => fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(res => res.json()),
    
    getUser: (id) => fetch(`${BASE_URL}/users/profile/${id}`).then(res => res.json()),
    
    getUserStats: (userId) => fetch(`${BASE_URL}/users/dashboard/${userId}`).then(res => res.json()),
    
    addXP: (userId, xpGained) => fetch(`${BASE_URL}/users/add-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, xpGained })
    }).then(res => res.json()),
    
    // Community APIs
    getPosts: () => fetch(`${BASE_URL}/community`).then(res => res.json()),
    
    createPost: (postData) => fetch(`${BASE_URL}/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    }).then(res => res.json()),
    
    // Leaderboard APIs
    getLeaderboard: () => fetch(`${BASE_URL}/leaderboard/global`).then(res => res.json()),
    
    getDeptLeaderboard: (dept) => fetch(`${BASE_URL}/leaderboard/dept/${dept}`).then(res => res.json()),
    
    // Badge APIs
    checkBadges: (userId) => fetch(`${BASE_URL}/badges/check/${userId}`).then(res => res.json())
};

// Export individual functions for named imports
export const registerUser = (userData) => fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
}).then(res => res.json());

export const loginUser = (email) => fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
}).then(res => res.json());

export const getUser = (id) => fetch(`${BASE_URL}/users/profile/${id}`).then(res => res.json());

export const getUserStats = (userId) => fetch(`${BASE_URL}/users/dashboard/${userId}`).then(res => res.json());

export const addXP = (userId, xpGained) => fetch(`${BASE_URL}/users/add-xp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, xpGained })
}).then(res => res.json());

export const fetchCommunityPosts = () => fetch(`${BASE_URL}/community`).then(res => res.json());

export const createPost = (postData) => fetch(`${BASE_URL}/community`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
}).then(res => res.json());

export const fetchLeaderboard = () => fetch(`${BASE_URL}/leaderboard/global`).then(res => res.json());

export const fetchLeaderboardByCategory = (dept) => fetch(`${BASE_URL}/leaderboard/dept/${dept}`).then(res => res.json());

export const checkBadges = (userId) => fetch(`${BASE_URL}/badges/check/${userId}`).then(res => res.json());

export const searchUsers = () => fetch(`${BASE_URL}/users/all`).then(res => res.json());

export const getUserById = (userId) => fetch(`${BASE_URL}/users/profile/${userId}`).then(res => res.json());

export const getPostById = (postId) => fetch(`${BASE_URL}/community/${postId}`).then(res => res.json());

export const addCommentToPost = (postId, userId, text) => fetch(`${BASE_URL}/community/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text })
}).then(res => res.json());

export const likePost = (postId, userId) => fetch(`${BASE_URL}/community/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
}).then(res => res.json());

export const deletePost = (postId, userId) => fetch(`${BASE_URL}/community/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
}).then(res => res.json());

// Daily Challenges
export const getDailyChallenge = () => fetch(`${BASE_URL}/challenges/today`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json());

export const submitChallenge = (userId, challengeId, solution) => fetch(`${BASE_URL}/challenges/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, challengeId, solution })
}).then(res => res.json());

// Contests
export const getAllContests = () => fetch(`${BASE_URL}/contests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json());

export const getContestById = (contestId) => fetch(`${BASE_URL}/contests/${contestId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json());

export const joinContest = (contestId, userId) => fetch(`${BASE_URL}/contests/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contestId, userId })
}).then(res => res.json());

export const leaveContest = (contestId, userId) => fetch(`${BASE_URL}/contests/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contestId, userId })
}).then(res => res.json());

// Recommendations
export const getRecommendations = (userId) => fetch(`${BASE_URL}/recommendations/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json());

export const getRecommendedCourses = (userId) => fetch(`${BASE_URL}/recommendations/${userId}/courses`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json());