// Team Logo Management System
class TeamLogoManager {
    constructor() {
        this.logoStorage = 'spl_team_logos';
        this.defaultLogos = this.getDefaultLogos();
    }

    // Default logos for common Saudi Premier League teams
    getDefaultLogos() {
        return {
            // Add team logos here when available
            // Format: 'team_id': 'logo_url'
            // Example:
            // '1': 'images/teams/al-hilal.png',
            // '2': 'images/teams/al-nassr.png',
            // '3': 'images/teams/al-ahli.png',
            // '4': 'images/teams/al-ittihad.png',
            // '5': 'images/teams/al-shabab.png',
            // '6': 'images/teams/al-taawoun.png',
            // '7': 'images/teams/al-ettifaq.png',
            // '8': 'images/teams/al-fateh.png',
            // '9': 'images/teams/al-feiha.png',
            // '10': 'images/teams/al-raed.png',
            // '11': 'images/teams/al-khaleej.png',
            // '12': 'images/teams/al-hazem.png',
            // '13': 'images/teams/al-tai.png',
            // '14': 'images/teams/al-wehda.png',
            // '15': 'images/teams/al-riyadh.png',
            // '16': 'images/teams/al-okhdood.png',
            // '17': 'images/teams/al-akhdoud.png',
            // '18': 'images/teams/al-batin.png'
        };
    }

    // Get stored logos from localStorage
    getStoredLogos() {
        try {
            const stored = localStorage.getItem(this.logoStorage);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error reading stored logos:', error);
            return {};
        }
    }

    // Save logos to localStorage
    saveLogos(logos) {
        try {
            localStorage.setItem(this.logoStorage, JSON.stringify(logos));
            console.log('✅ Team logos saved to storage');
        } catch (error) {
            console.error('Error saving logos:', error);
        }
    }

    // Get logo for a team (checks stored, then default, then returns null)
    getTeamLogo(teamId) {
        const stored = this.getStoredLogos();
        const teamIdStr = teamId.toString();
        
        return stored[teamIdStr] || this.defaultLogos[teamIdStr] || null;
    }

    // Add or update a team logo
    setTeamLogo(teamId, logoUrl) {
        const stored = this.getStoredLogos();
        stored[teamId.toString()] = logoUrl;
        this.saveLogos(stored);
        
        // Update the cached teams data if it exists
        this.updateCachedTeamLogo(teamId, logoUrl);
        
        console.log(`✅ Logo updated for team ${teamId}: ${logoUrl}`);
    }

    // Update the cached teams data with new logo
    updateCachedTeamLogo(teamId, logoUrl) {
        try {
            const cacheManager = window.MatchesCacheManager ? new window.MatchesCacheManager() : null;
            if (!cacheManager) return;

            const cachedData = cacheManager.getCachedData();
            if (cachedData && cachedData.teams && cachedData.teams[teamId]) {
                cachedData.teams[teamId].logo = logoUrl;
                cacheManager.saveToCache(cachedData.matches, cachedData.teams);
                console.log(`✅ Updated cached team data for team ${teamId}`);
            }
        } catch (error) {
            console.error('Error updating cached team logo:', error);
        }
    }

    // Bulk update logos
    setMultipleLogos(logoMap) {
        const stored = this.getStoredLogos();
        Object.assign(stored, logoMap);
        this.saveLogos(stored);
        
        // Update cached data for each team
        Object.entries(logoMap).forEach(([teamId, logoUrl]) => {
            this.updateCachedTeamLogo(teamId, logoUrl);
        });
        
        console.log(`✅ Updated ${Object.keys(logoMap).length} team logos`);
    }

    // Remove a team logo
    removeTeamLogo(teamId) {
        const stored = this.getStoredLogos();
        delete stored[teamId.toString()];
        this.saveLogos(stored);
        
        this.updateCachedTeamLogo(teamId, null);
        console.log(`🗑️ Removed logo for team ${teamId}`);
    }

    // Get all logos
    getAllLogos() {
        return { ...this.defaultLogos, ...this.getStoredLogos() };
    }

    // Clear all stored logos (keeps defaults)
    clearStoredLogos() {
        localStorage.removeItem(this.logoStorage);
        console.log('🗑️ Cleared all stored team logos');
    }

    // Apply logos to teams data
    applyLogosToTeams(teams) {
        const allLogos = this.getAllLogos();
        
        Object.keys(teams).forEach(teamId => {
            const logo = allLogos[teamId];
            if (logo) {
                teams[teamId].logo = logo;
            }
        });
        
        return teams;
    }

    // Helper method to list teams without logos
    getTeamsWithoutLogos(teams) {
        const allLogos = this.getAllLogos();
        const teamsWithoutLogos = [];
        
        Object.entries(teams).forEach(([teamId, team]) => {
            if (!allLogos[teamId]) {
                teamsWithoutLogos.push({
                    id: teamId,
                    name: team.name
                });
            }
        });
        
        return teamsWithoutLogos;
    }

    // Debug method to show current state
    debugInfo() {
        const stored = this.getStoredLogos();
        const all = this.getAllLogos();
        
        console.log('🔍 Team Logo Manager Debug Info:');
        console.log('Default logos:', Object.keys(this.defaultLogos).length);
        console.log('Stored logos:', Object.keys(stored).length);
        console.log('Total logos:', Object.keys(all).length);
        console.log('All logos:', all);
        
        return {
            defaultCount: Object.keys(this.defaultLogos).length,
            storedCount: Object.keys(stored).length,
            totalCount: Object.keys(all).length,
            logos: all
        };
    }
}

// Export for use in other scripts
window.TeamLogoManager = TeamLogoManager;

// Console helper functions for easy logo management
window.addTeamLogo = function(teamId, logoUrl) {
    const manager = new TeamLogoManager();
    manager.setTeamLogo(teamId, logoUrl);
};

window.addMultipleLogos = function(logoMap) {
    const manager = new TeamLogoManager();
    manager.setMultipleLogos(logoMap);
};

window.listTeamsWithoutLogos = function() {
    const manager = new TeamLogoManager();
    const cacheManager = new MatchesCacheManager();
    const cachedData = cacheManager.getCachedData();
    
    if (cachedData && cachedData.teams) {
        const teamsWithoutLogos = manager.getTeamsWithoutLogos(cachedData.teams);
        console.log('Teams without logos:', teamsWithoutLogos);
        return teamsWithoutLogos;
    } else {
        console.log('No cached team data available');
        return [];
    }
};

window.showLogoDebugInfo = function() {
    const manager = new TeamLogoManager();
    return manager.debugInfo();
}; 