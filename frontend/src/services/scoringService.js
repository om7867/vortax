import api from './api';

const scoringService = {
    /**
     * Evaluate a submitted test (Module 4)
     * @param {string} testId 
     * @returns {Promise<object>} Evaluation results
     */
    evaluateTest: async (testId) => {
        const response = await api.post(`/api/v4/scoring/evaluate/${testId}`);
        return response.data;
    },

    /**
     * Get user's overall scoring summary
     * @returns {Promise<object>} Score summary with skill breakdown
     */
    getSummary: async () => {
        const response = await api.get('/api/v4/scoring/summary');
        return response.data;
    },

    /**
     * Get historical progression for a specific skill
     * @param {string} skillId 
     * @returns {Promise<object>} Skill history data
     */
    getSkillHistory: async (skillId) => {
        const response = await api.get(`/api/v4/scoring/history/${skillId}`);
        return response.data;
    }
};

export default scoringService;
