// Matches Cache Manager for Daily API Calls
class MatchesCacheManager {
    constructor() {
        this.cacheKey = 'spl_matches_cache';
        this.teamsKey = 'spl_teams_cache';
        this.lastUpdateKey = 'spl_last_update';
        this.apiUrl = 'https://livescore-api.com/api-client/fixtures/matches.json?competition_id=313&key=hhmh4yWmEp2Hl87V&secret=KvT5UNx6UTHodFjuXGM1eInT8qAtzHok';
        this.corsProxy = new CORSProxyManager();
        this.cacheExpiryHours = 24; // 24 hours
    }

    // Check if cache is valid (less than 24 hours old)
    isCacheValid() {
        const lastUpdate = localStorage.getItem(this.lastUpdateKey);
        if (!lastUpdate) return false;

        const lastUpdateTime = new Date(lastUpdate);
        const now = new Date();
        const hoursDiff = (now - lastUpdateTime) / (1000 * 60 * 60);

        return hoursDiff < this.cacheExpiryHours;
    }

    // Get cached data
    getCachedData() {
        try {
            const matchesData = localStorage.getItem(this.cacheKey);
            const teamsData = localStorage.getItem(this.teamsKey);
            
            if (matchesData && teamsData) {
                return {
                    matches: JSON.parse(matchesData),
                    teams: JSON.parse(teamsData),
                    fromCache: true
                };
            }
        } catch (error) {
            console.error('Error reading cache:', error);
        }
        return null;
    }

    // Save data to cache
    saveToCache(matches, teams) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(matches));
            localStorage.setItem(this.teamsKey, JSON.stringify(teams));
            localStorage.setItem(this.lastUpdateKey, new Date().toISOString());
            console.log('✅ Match data cached successfully');
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    // Extract teams data from matches
    extractTeamsData(fixtures) {
        const teams = {};
        
        fixtures.forEach(match => {
            // Home team
            if (!teams[match.home_id]) {
                teams[match.home_id] = {
                    id: match.home_id,
                    name: match.home_name,
                    translations: match.home_translations || {},
                    logo: null // Will be added by logo manager
                };
            }

            // Away team
            if (!teams[match.away_id]) {
                teams[match.away_id] = {
                    id: match.away_id,
                    name: match.away_name,
                    translations: match.away_translations || {},
                    logo: null // Will be added by logo manager
                };
            }
        });

        // Apply logos if logo manager is available
        if (window.TeamLogoManager) {
            const logoManager = new window.TeamLogoManager();
            logoManager.applyLogosToTeams(teams);
        }

        return teams;
    }

    // Fetch fresh data from API
    async fetchFreshData() {
        try {
            console.log('🔄 Fetching fresh match data from API...');
            const response = await this.corsProxy.fetchWithProxy(this.apiUrl);
            const data = await response.json();
            
            if (data.success && data.data.fixtures.length > 0) {
                const matches = data.data.fixtures.map(match => ({
                    ...match,
                    matchDateTime: new Date(`${match.date}T${match.time}`)
                }));

                const teams = this.extractTeamsData(data.data.fixtures);
                
                // Save to cache
                this.saveToCache(matches, teams);
                
                console.log('✅ Fresh data fetched and cached');
                console.log(`📊 ${matches.length} matches and ${Object.keys(teams).length} teams cached`);
                
                return { matches, teams, fromCache: false };
            } else {
                throw new Error('No matches found in API response');
            }
        } catch (error) {
            console.error('❌ Error fetching fresh data:', error);
            throw error;
        }
    }

    // Main method to get data (cache-first approach)
    async getData() {
        // Check if we have valid cached data
        if (this.isCacheValid()) {
            const cachedData = this.getCachedData();
            if (cachedData) {
                console.log('✅ Using cached match data');
                return cachedData;
            }
        }

        // Cache is invalid or doesn't exist, fetch fresh data
        console.log('🔄 Cache expired or missing, fetching fresh data...');
        return await this.fetchFreshData();
    }

    // Force refresh (for manual updates)
    async forceRefresh() {
        console.log('🔄 Force refreshing match data...');
        return await this.fetchFreshData();
    }

    // Get team info by ID
    getTeamInfo(teamId, teams) {
        return teams[teamId] || {
            id: teamId,
            name: 'Unknown Team',
            logo: null
        };
    }

    // Clear cache (for debugging)
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.teamsKey);
        localStorage.removeItem(this.lastUpdateKey);
        console.log('🗑️ Cache cleared');
    }

    // Get cache info for debugging
    getCacheInfo() {
        const lastUpdate = localStorage.getItem(this.lastUpdateKey);
        const matchesCount = this.getCachedData()?.matches?.length || 0;
        const teamsCount = Object.keys(this.getCachedData()?.teams || {}).length;
        
        return {
            lastUpdate: lastUpdate ? new Date(lastUpdate) : null,
            matchesCount,
            teamsCount,
            isValid: this.isCacheValid()
        };
    }

    // Schedule daily update check
    scheduleDailyUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Midnight

        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        setTimeout(() => {
            this.forceRefresh().catch(console.error);
            
            // Set up daily interval
            setInterval(() => {
                this.forceRefresh().catch(console.error);
            }, 24 * 60 * 60 * 1000); // 24 hours
            
        }, msUntilMidnight);

        console.log(`⏰ Daily update scheduled for midnight (${msUntilMidnight / 1000 / 60} minutes from now)`);
    }
}

// Export for use in other scripts
window.MatchesCacheManager = MatchesCacheManager; 