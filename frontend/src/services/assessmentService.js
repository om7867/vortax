import api from './api';

const assessmentService = {
    /**
     * Start a new assessment.
     * @param {string} domainOverride - Optional domain to test
     * @returns {Promise<object>} Test session data (id, questions)
     */
    startAssessment: async (domainOverride = null) => {
        const payload = domainOverride ? { domain: domainOverride } : {};
        const response = await api.post('/api/v3/assessments/start', payload);
        return response.data;
    },

    /**
     * Submit answers for assessment.
     * @param {string} testId 
     * @param {Array<{question_id: string, selected_option_index: number}>} answers 
     * @returns {Promise<object>} Test results
     */
    submitAssessment: async (testId, answers) => {
        const payload = {
            test_id: testId,
            answers: answers
        };
        const response = await api.post('/api/v3/assessments/submit', payload);
        return response.data;
    },

    /**
     * Get results for a specific test.
     * @param {string} testId 
     * @returns {Promise<object>} detailed results
     */
    getResult: async (testId) => {
        const response = await api.get(`/api/v3/assessments/result/${testId}`);
        return response.data;
    }
};

export default assessmentService;
