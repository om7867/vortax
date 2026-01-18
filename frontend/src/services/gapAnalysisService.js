import api from './api';

const gapAnalysisService = {
    /**
     * Run gap analysis for current user (Module 5)
     * @returns {Promise<object>} Gap analysis results
     */
    evaluateGapAnalysis: async () => {
        const response = await api.post('/api/v5/gap-analysis/evaluate');
        return response.data;
    },

    /**
     * Get gap analysis summary
     * @returns {Promise<object>} Summary with readiness percentage and skill gaps
     */
    getSummary: async () => {
        const response = await api.get('/api/v5/gap-analysis/summary');
        return response.data;
    },

    /**
     * Get radar chart data
     * @returns {Promise<object>} Radar chart dataset
     */
    getRadarData: async () => {
        const response = await api.get('/api/v5/gap-analysis/radar-data');
        return response.data;
    },

    /**
     * Get missing/partial skills (for recommendations)
     * @returns {Promise<object>} Missing and partial skills
     */
    getMissingSkills: async () => {
        const response = await api.get('/api/v5/gap-analysis/missing-skills');
        return response.data;
    },

    /**
     * Mark analysis as viewed
     * @returns {Promise<object>} Success message
     */
    markViewed: async () => {
        const response = await api.post('/api/v5/gap-analysis/mark-viewed');
        return response.data;
    }
};

export default gapAnalysisService;
