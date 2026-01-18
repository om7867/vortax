import api from './api';

const dashboardService = {
    /**
     * Get complete unified dashboard (all modules)
     * @returns {Promise<object>} Complete dashboard data
     */
    getCompleteDashboard: async () => {
        const response = await api.get('/api/dashboard/complete');
        return response.data;
    }
};

export default dashboardService;
