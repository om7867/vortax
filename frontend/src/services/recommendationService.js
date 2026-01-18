import api from './api';

const recommendationService = {
    /**
     * Get tailored recommendations summary
     */
    getRecommendations: async () => {
        const response = await api.get('/api/v6/recommendations/');
        return response.data;
    },

    /**
     * Generate personalized month-wise roadmap
     */
    getRoadmap: async () => {
        const response = await api.get('/api/v6/recommendations/roadmap');
        return response.data;
    },

    /**
     * Add resource to user's learning plan
     */
    addToPlan: async (resourceId) => {
        const response = await api.post('/api/v6/recommendations/add-to-plan', { resource_id: resourceId });
        return response.data;
    },

    /**
     * Get job recommendations (gated)
     */
    getJobs: async () => {
        const response = await api.get('/api/v6/recommendations/jobs');
        return response.data;
    },

    /**
     * Update learning progress hours
     */
    updateProgress: async (skillId, hours) => {
        const response = await api.post('/api/v6/recommendations/progress/update', {
            skill_id: skillId,
            completed_hours: hours
        });
        return response.data;
    },

    /**
     * Get learning progress summary
     */
    getProgressSummary: async () => {
        const response = await api.get('/api/v6/recommendations/progress/summary');
        return response.data;
    }
};

export default recommendationService;
