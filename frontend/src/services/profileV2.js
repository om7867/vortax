import api from './api';

/**
 * Profile V2 API Service
 * 
 * Handles all requests related to MODULE 2: Profile, Skills & Certifications.
 * Uses strict database-first endpoints (/api/v2/*).
 */

const profileV2Service = {
    // --- Profile Operations ---

    /**
     * Fetch full user profile including skills, certifications, and completion status.
     */
    getFullProfile: async () => {
        const response = await api.get('/api/v2/profile/me');
        return response.data;
    },

    /**
     * Create or update basic user profile.
     * @param {Object} data - { full_name, education_level, field_of_study, domain_interest, target_role, experience_level, years_of_experience, location }
     */
    updateProfile: async (data) => {
        const response = await api.post('/api/v2/profile', data);
        return response.data;
    },

    /**
     * Get profile completion score and missing sections.
     */
    getCompletionStatus: async () => {
        const response = await api.get('/api/v2/profile/completion-status');
        return response.data;
    },

    // --- Skills Operations ---

    /**
     * List all skills from the master catalog.
     * @param {string} domain - Optional domain filter (healthcare, agriculture, urban, common)
     */
    getAvailableSkills: async (domain = '') => {
        const response = await api.get(`/api/v2/skills/available${domain ? `?domain=${domain}` : ''}`);
        return response.data;
    },

    /**
     * Add or update a skill for the current user.
     * @param {string} skillId - UUID of the skill from master catalog
     * @param {number} rating - Self-rating (1-5)
     */
    addUserSkill: async (skillId, rating) => {
        const response = await api.post('/api/v2/skills/add', {
            skill_id: skillId,
            self_rating: rating
        });
        return response.data;
    },

    /**
     * Fetch user's personal skill list.
     */
    getMySkills: async () => {
        const response = await api.get('/api/v2/skills/my');
        return response.data;
    },

    // --- Certification Operations ---

    /**
     * Add a new certification record.
     * @param {Object} data - { name, issuing_organization, credential_id, issue_date, expiry_date, verification_url, domain }
     */
    addCertification: async (data) => {
        const response = await api.post('/api/v2/certifications/add', data);
        return response.data;
    },

    /**
     * Fetch user's certification records.
     */
    getMyCertifications: async () => {
        const response = await api.get('/api/v2/certifications/my');
        return response.data;
    },

    /**
     * Check if user is eligible for skill tests (70%+ score).
     */
    checkEligibility: async () => {
        const response = await api.get('/api/v2/profile/eligibility');
        return response.data;
    }
};

export default profileV2Service;
