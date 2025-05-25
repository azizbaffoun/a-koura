// Live Matches API Integration with Caching
class LiveMatchesManager {
    constructor() {
        this.countdownInterval = null;
        this.refreshInterval = null;
        this.nextMatch = null;
        this.upcomingMatches = [];
        this.teams = {};
        this.cacheManager = new MatchesCacheManager();
        this.init();
    }

    async init() {
        this.showLoadingState();
        try {
            await this.loadMatchData();
            this.updateMatchDisplay();
            this.startCountdown();
            this.startCacheRefreshTimer();
            this.hideLoadingState();
            console.log('Live matches system initialized successfully');
            console.log('Next match:', this.nextMatch?.home_name, 'vs', this.nextMatch?.away_name);
            console.log('Total upcoming matches:', this.upcomingMatches?.length || 0);
            
            // Schedule daily updates
            this.cacheManager.scheduleDailyUpdate();
        } catch (error) {
            console.error('Error initializing live matches:', error);
            this.hideLoadingState();
            this.showErrorState(error);
            this.showFallbackData();
        }
    }

    startCacheRefreshTimer() {
        // Check cache every hour (but only refresh if needed)
        this.refreshInterval = setInterval(async () => {
            try {
                console.log('Checking cache validity...');
                if (!this.cacheManager.isCacheValid()) {
                    console.log('Cache expired, refreshing...');
                    await this.loadMatchData();
                    this.updateMatchDisplay();
                    this.startCountdown();
                    console.log('Match data refreshed from cache');
                }
            } catch (error) {
                console.error('Error checking cache:', error);
            }
        }, 60 * 60 * 1000); // 1 hour
    }

    showLoadingState() {
        const timerWrapper = document.querySelector('.timer-wrapper');
        if (timerWrapper) {
            timerWrapper.classList.add('loading');
        }
        
        const matchesTable = document.querySelector('.matches-table');
        if (matchesTable) {
            matchesTable.classList.add('loading');
        }
    }

    hideLoadingState() {
        const timerWrapper = document.querySelector('.timer-wrapper');
        if (timerWrapper) {
            timerWrapper.classList.remove('loading');
        }
        
        const matchesTable = document.querySelector('.matches-table');
        if (matchesTable) {
            matchesTable.classList.remove('loading');
        }
    }

    async loadMatchData() {
        try {
            console.log('🔄 Loading match data...');
            const data = await this.cacheManager.getData();
            this.teams = data.teams;
            
            console.log('📊 Raw data received:', {
                matches: data.matches?.length || 0,
                teams: Object.keys(data.teams || {}).length,
                fromCache: data.fromCache
            });
            
            if (data.matches && data.matches.length > 0) {
                // Convert date strings back to Date objects if needed
                const matches = data.matches.map(match => ({
                    ...match,
                    matchDateTime: new Date(match.matchDateTime)
                }));
                
                console.log('📅 Sample match data:', matches[0]);
                
                this.nextMatch = this.findNextMatch(matches);
                console.log(`📊 Loaded ${matches.length} matches from ${data.fromCache ? 'cache' : 'API'}`);
                console.log('🎯 Next match found:', this.nextMatch?.home_name, 'vs', this.nextMatch?.away_name);
                console.log('📋 Total upcoming matches:', this.upcomingMatches?.length || 0);
                
                return this.nextMatch;
            } else {
                throw new Error('No matches found in cached data');
            }
        } catch (error) {
            console.error('❌ Error loading match data:', error);
            throw error;
        }
    }

    findNextMatch(fixtures) {
        const now = new Date();
        
        // Convert fixtures to Date objects and sort by date/time
        const upcomingMatches = fixtures
            .map(match => ({
                ...match,
                matchDateTime: new Date(`${match.date}T${match.time}`)
            }))
            .filter(match => match.matchDateTime > now)
            .sort((a, b) => a.matchDateTime - b.matchDateTime);

        // Store all upcoming matches for the Future Matches section
        this.upcomingMatches = upcomingMatches;
        
        return upcomingMatches.length > 0 ? upcomingMatches[0] : fixtures[0];
    }

    updateMatchDisplay() {
        if (!this.nextMatch) return;

        // Get team info with Arabic names
        const homeTeam = this.cacheManager.getTeamInfo(this.nextMatch.home_id, this.teams);
        const awayTeam = this.cacheManager.getTeamInfo(this.nextMatch.away_id, this.teams);

        // Update team names with animation (use English names)
        const homeTeamElement = document.querySelector('[data-w-id="95f7e6c9-9b2c-e6a7-0137-5e4b464ede50"]');
        const awayTeamElement = document.querySelector('[data-w-id="1602bf02-8b37-4379-a9a8-9787bdb087c7"]');
        
        if (homeTeamElement) {
            homeTeamElement.setAttribute('data-wg-notranslate', 'false');
            this.animateTextUpdate(homeTeamElement, homeTeam.name);
        }
        
        if (awayTeamElement) {
            awayTeamElement.setAttribute('data-wg-notranslate', 'false');
            this.animateTextUpdate(awayTeamElement, awayTeam.name);
        }

        // Update league info
        const leagueElement = document.querySelector('[data-w-id="94a13c46-e249-a18e-29ba-34851562e62a"]');
        if (leagueElement) {
            leagueElement.setAttribute('data-wg-notranslate', 'false');
            this.animateTextUpdate(leagueElement, `${this.nextMatch.competition.name} • Round ${this.nextMatch.round} • Next match`);
        }

        // Update Future Matches section
        this.updateFutureMatches();
    }

    updateFutureMatches() {
        // Get all upcoming matches from cache
        const allMatches = this.getAllUpcomingMatches();
        if (!allMatches || allMatches.length === 0) {
            console.log('No upcoming matches found');
            return;
        }

        this.upcomingMatches = allMatches; // Store for other methods
        console.log(`📅 Found ${allMatches.length} upcoming matches`);

        // Show all matches in the regular matches list (no featured section)
        const matchesToShow = allMatches.slice(0, 6); // Show up to 6 matches
        this.updateMatchesList(matchesToShow);
        
        console.log(`✅ Updated Future Matches: ${matchesToShow.length} matches`);
        
        // Force show the sections that might be hidden by Webflow animations
        this.showFutureMatchesSections();
    }

    showFutureMatchesSections() {
        console.log('👁️ Forcing visibility on Future Matches sections...');
        
        // Target specific Webflow animation elements by their data-w-id
        const webflowAnimationElements = [
            '[data-w-id="9e6f4900-86b9-8241-b057-1a0893834744"]', // Title wrapper
            '[data-w-id="fdc23f1b-15c5-53a8-6dc3-4368d023c747"]'  // Match row
        ];
        
        webflowAnimationElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('opacity', '1', 'important');
                element.style.setProperty('visibility', 'visible', 'important');
                element.style.setProperty('display', 'block', 'important');
                element.style.setProperty('transform', 'translateY(0)', 'important');
                console.log('✅ Forced visibility on:', selector);
            } else {
                console.log('❌ Element not found:', selector);
            }
        });
        
        // Force show the last-matches-section
        const lastMatchesSection = document.querySelector('.last-matches-section');
        if (lastMatchesSection) {
            lastMatchesSection.style.setProperty('opacity', '1', 'important');
            lastMatchesSection.style.setProperty('visibility', 'visible', 'important');
            lastMatchesSection.style.setProperty('display', 'block', 'important');
        }
        
        // Hide the featured section completely
        const featuredSection = document.querySelector('.next-match-collection-list-wrapper');
        if (featuredSection) {
            featuredSection.style.setProperty('display', 'none', 'important');
            console.log('✅ Hidden featured match section');
        }
        
        // Force show the matches list section
        const matchesSection = document.querySelector('.matches-collection-list-wrapper');
        if (matchesSection) {
            matchesSection.style.setProperty('opacity', '1', 'important');
            matchesSection.style.setProperty('visibility', 'visible', 'important');
            matchesSection.style.setProperty('display', 'block', 'important');
            
            // Force show the w-dyn-items container
            const dynItems = matchesSection.querySelector('.w-dyn-items');
            if (dynItems) {
                dynItems.style.setProperty('opacity', '1', 'important');
                dynItems.style.setProperty('visibility', 'visible', 'important');
                dynItems.style.setProperty('display', 'block', 'important');
            }
        }

        // Force show the matches table
        const matchesTable = document.querySelector('.matches-table');
        if (matchesTable) {
            matchesTable.style.setProperty('opacity', '1', 'important');
            matchesTable.style.setProperty('visibility', 'visible', 'important');
            matchesTable.style.setProperty('display', 'block', 'important');
        }
        
        // Force show all match rows and related elements
        const matchRows = document.querySelectorAll('.match-row, .next-match-row');
        matchRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.setProperty('opacity', '1', 'important');
                row.style.setProperty('visibility', 'visible', 'important');
                row.style.setProperty('display', 'flex', 'important');
                row.style.setProperty('transform', 'translateY(0)', 'important');
            }, index * 100); // Stagger the animation
        });
        
        console.log('👁️ Forced visibility on Future Matches sections with !important');
        
        // Debug what we actually have in the DOM
        setTimeout(() => {
            this.debugDOM();
        }, 1000);
    }

    getAllUpcomingMatches() {
        // Get all matches from cache and sort by date
        const cachedData = this.cacheManager.getCachedData();
        if (!cachedData || !cachedData.matches) return [];

        const now = new Date();
        return cachedData.matches
            .map(match => ({
                ...match,
                matchDateTime: new Date(match.matchDateTime)
            }))
            .filter(match => match.matchDateTime > now)
            .sort((a, b) => a.matchDateTime - b.matchDateTime);
    }

    updateNextMatchSection() {
        console.log('🔄 Updating next match section...');
        console.log('📋 Upcoming matches available:', this.upcomingMatches?.length || 0);
        
        if (!this.upcomingMatches || this.upcomingMatches.length < 1) {
            console.log('❌ No upcoming matches to display in featured section');
            return;
        }

        const nextMatch = this.upcomingMatches[0]; // First upcoming match (after countdown)
        console.log('🎯 Featured match:', nextMatch.home_name, 'vs', nextMatch.away_name);
        
        // Get team info
        const homeTeam = this.cacheManager.getTeamInfo(nextMatch.home_id, this.teams);
        const awayTeam = this.cacheManager.getTeamInfo(nextMatch.away_id, this.teams);
        
        // Update team names in the Future Matches section (the top featured match)
        const nextMatchSection = document.querySelector('.next-match-collection-list-wrapper .w-dyn-items');
        console.log('🎯 Next match section found:', !!nextMatchSection);
        
        if (nextMatchSection) {
            // Get all team elements and target them by index
            const teamElements = nextMatchSection.querySelectorAll('.teams-names .team');
            let homeTeamName = null;
            let awayTeamName = null;
            
            if (teamElements.length >= 2) {
                // First team (home)
                homeTeamName = teamElements[0].querySelector('.h4-table.w-dyn-bind-empty') || 
                              teamElements[0].querySelector('.h4-table');
                
                // Second team (away)
                awayTeamName = teamElements[1].querySelector('.h4-table.w-dyn-bind-empty') || 
                              teamElements[1].querySelector('.h4-table');
            }
            
            console.log('🔍 Elements found:', {
                teamElements: teamElements.length,
                homeTeamName: !!homeTeamName,
                awayTeamName: !!awayTeamName
            });
            
            if (homeTeamName) {
                console.log('✅ Updating home team:', homeTeam.name);
                homeTeamName.textContent = homeTeam.name;
                homeTeamName.classList.remove('w-dyn-bind-empty');
                homeTeamName.setAttribute('data-wg-notranslate', 'false');
            } else {
                console.log('❌ Home team name element not found');
            }
            if (awayTeamName) {
                console.log('✅ Updating away team:', awayTeam.name);
                awayTeamName.textContent = awayTeam.name;
                awayTeamName.classList.remove('w-dyn-bind-empty');
                awayTeamName.setAttribute('data-wg-notranslate', 'false');
            } else {
                console.log('❌ Away team name element not found');
            }

            // Update date and time - target the specific empty elements
            let dateElements = nextMatchSection.querySelectorAll('.match-date .uppercase-paragraph.w-dyn-bind-empty');
            
            // If no empty elements found, get all date elements
            if (dateElements.length === 0) {
                dateElements = nextMatchSection.querySelectorAll('.match-date .uppercase-paragraph.black-paragraph');
            }
            
            if (dateElements.length >= 2) {
                const matchDate = new Date(nextMatch.matchDateTime);
                dateElements[0].textContent = this.formatDate(matchDate);
                dateElements[0].classList.remove('w-dyn-bind-empty');
                dateElements[0].setAttribute('data-wg-notranslate', 'false');
                dateElements[1].textContent = this.formatTime(matchDate);
                dateElements[1].classList.remove('w-dyn-bind-empty');
                dateElements[1].setAttribute('data-wg-notranslate', 'false');
                
                console.log('✅ Updated match date and time:', this.formatDate(matchDate), this.formatTime(matchDate));
            } else {
                console.log('❌ Date elements not found, available elements:', dateElements.length);
            }
        }
    }

    updateMatchesList(matches) {
        const matchesContainer = document.querySelector('.matches-collection-list-wrapper .w-dyn-items');
        if (!matchesContainer) {
            console.log('❌ Matches container not found');
            return;
        }

        // First, try to update existing static elements if they exist
        this.updateExistingMatchElements(matches);

        // Then clear and create new elements
        matchesContainer.innerHTML = '';

        // Create match items, filtering out null elements
        let validMatchCount = 0;
        matches.forEach((match, index) => {
            const matchElement = this.createMatchElement(match, index);
            if (matchElement) { // Only append if element was created (not null)
                matchesContainer.appendChild(matchElement);
                validMatchCount++;
            }
        });
        
        console.log(`✅ Created ${validMatchCount} valid match elements in list`);
        
        // Hide the featured match section completely
        const featuredSection = document.querySelector('.next-match-collection-list-wrapper');
        if (featuredSection) {
            featuredSection.style.setProperty('display', 'none', 'important');
            console.log('✅ Hidden featured match section');
        }
    }

    updateExistingMatchElements(matches) {
        // Try to update the existing static match element if it exists
        const existingMatch = document.querySelector('.matches-collection-list-wrapper .collection-item-2');
        if (existingMatch && matches.length > 0) {
            const match = matches[0];
            const homeTeam = this.cacheManager.getTeamInfo(match.home_id, this.teams);
            const awayTeam = this.cacheManager.getTeamInfo(match.away_id, this.teams);
            const matchDate = new Date(match.matchDateTime);

            // Update team names
            const homeTeamName = existingMatch.querySelector('.teams-names .team:first-child .h4-table.w-dyn-bind-empty');
            const awayTeamName = existingMatch.querySelector('.teams-names .team:last-child .h4-table.w-dyn-bind-empty');
            
            if (homeTeamName) {
                homeTeamName.textContent = homeTeam.name;
                homeTeamName.classList.remove('w-dyn-bind-empty');
                homeTeamName.setAttribute('data-wg-notranslate', 'false');
            }
            if (awayTeamName) {
                awayTeamName.textContent = awayTeam.name;
                awayTeamName.classList.remove('w-dyn-bind-empty');
                awayTeamName.setAttribute('data-wg-notranslate', 'false');
            }

            // Update date and time
            const dateElements = existingMatch.querySelectorAll('.match-date .uppercase-paragraph.w-dyn-bind-empty');
            if (dateElements.length >= 2) {
                dateElements[0].textContent = this.formatDate(matchDate);
                dateElements[0].classList.remove('w-dyn-bind-empty');
                dateElements[0].setAttribute('data-wg-notranslate', 'false');
                dateElements[1].textContent = this.formatTime(matchDate);
                dateElements[1].classList.remove('w-dyn-bind-empty');
                dateElements[1].setAttribute('data-wg-notranslate', 'false');
            }

            // Show the match row
            const matchRow = existingMatch.querySelector('.match-row');
            if (matchRow) {
                matchRow.style.opacity = '1';
            }
        }
    }

    createMatchElement(match, index) {
        const matchDate = new Date(match.matchDateTime);
        const matchStatus = this.getMatchStatus(matchDate);
        
        // Get team info
        const homeTeam = this.cacheManager.getTeamInfo(match.home_id, this.teams);
        const awayTeam = this.cacheManager.getTeamInfo(match.away_id, this.teams);
        
        // Check if team names are valid (not null, undefined, or empty)
        const homeTeamName = homeTeam.name && homeTeam.name.trim() !== '' ? homeTeam.name : null;
        const awayTeamName = awayTeam.name && awayTeam.name.trim() !== '' ? awayTeam.name : null;
        
        // If either team name is missing, skip this match
        if (!homeTeamName || !awayTeamName) {
            console.log('⚠️ Skipping match with missing team names:', { home: homeTeamName, away: awayTeamName });
            return null;
        }
        
        const matchHTML = `
            <div role="listitem" class="collection-item-2 w-dyn-item">
                <div data-w-id="fdc23f1b-15c5-53a8-6dc3-4368d023c747" style="opacity:0" class="match-row home-1">
                    <div id="w-node-_0ff944be-9dd0-69f6-3bd6-a6b42ec90136-1c86bff2" class="teams-names home-1">
                        <div class="team">
                            <h4 class="h4-table" data-wg-notranslate="false">${homeTeamName}</h4>
                        </div>
                        <p class="uppercase-paragraph green-paragraph" data-wg-notranslate="false">VS</p>
                        <div class="team">
                            <h4 class="h4-table" data-wg-notranslate="false">${awayTeamName}</h4>
                        </div>
                    </div>
                    <div id="w-node-d7d0ef5d-d2b8-f99b-69f8-78def89498f2-1c86bff2" class="match-date">
                        <div class="rectangle left"></div>
                        <div class="rectangle left-bottom"></div>
                        <p class="uppercase-paragraph green-paragraph" data-wg-notranslate="false">${this.formatDate(matchDate)}</p>
                        <p class="brand-color-paragraph dot">•</p>
                        <p class="uppercase-paragraph green-paragraph" data-wg-notranslate="false">${this.formatTime(matchDate)}</p>
                        ${match.location ? `<p class="uppercase-paragraph green-paragraph" style="font-size: 10px; margin-top: 5px;" data-wg-notranslate="false">${match.location}</p>` : ''}
                    </div>
                    <!-- View Details button commented out
                    <div id="w-node-_633cd076-aa56-7d18-b16c-0c02f3ffaa34-1c86bff2" class="details-button-wrapper home-1">
                        <div class="rectangle left-bottom"></div>
                        <div class="rectangle left"></div>
                        <a href="#" class="secondary-button w-button">View Details</a>
                    </div>
                    -->
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = matchHTML;
        const matchElement = tempDiv.firstElementChild;

        // Add animation delay
        setTimeout(() => {
            const matchRow = matchElement.querySelector('.match-row');
            if (matchRow) {
                matchRow.style.opacity = '1';
            }
        }, index * 200);

        return matchElement;
    }

    formatDate(date) {
        const options = { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    formatTime(date) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        };
        return date.toLocaleTimeString('en-US', options);
    }

    getMatchStatus(matchDateTime) {
        const now = new Date();
        const timeDiff = matchDateTime - now;
        
        if (timeDiff <= 0) {
            // Check if match is within 2 hours (likely still ongoing)
            const hoursAgo = Math.abs(timeDiff) / (1000 * 60 * 60);
            if (hoursAgo <= 2) {
                return { status: 'live', text: 'LIVE', class: 'live-indicator' };
            } else {
                return { status: 'finished', text: 'FINISHED', class: 'finished-indicator' };
            }
        } else {
            const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
            
            if (daysUntil > 0) {
                return { status: 'upcoming', text: `${daysUntil}d`, class: 'upcoming-indicator' };
            } else if (hoursUntil > 0) {
                return { status: 'upcoming', text: `${hoursUntil}h`, class: 'upcoming-indicator' };
            } else {
                return { status: 'soon', text: 'SOON', class: 'soon-indicator' };
            }
        }
    }

    showErrorState(error) {
        // Show error message in the matches section
        const matchesContainer = document.querySelector('.matches-collection-list-wrapper .w-dyn-items');
        if (matchesContainer) {
            matchesContainer.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 20px;">
                    <p class="error-message">Unable to load live match data. Showing sample matches.</p>
                    <button onclick="window.liveMatchesManager.retryFetch()" class="secondary-button w-button" style="margin-top: 10px;">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    async retryFetch() {
        this.showLoadingState();
        try {
            // Force refresh from API
            await this.cacheManager.forceRefresh();
            await this.loadMatchData();
            this.updateMatchDisplay();
            this.startCountdown();
            this.hideLoadingState();
            
            // Remove error state
            const errorState = document.querySelector('.error-state');
            if (errorState) {
                errorState.remove();
            }
        } catch (error) {
            console.error('Retry failed:', error);
            this.hideLoadingState();
            this.showErrorState(error);
        }
    }

    animateTextUpdate(element, newText) {
        element.classList.add('team-updating');
        setTimeout(() => {
            element.textContent = newText;
            element.classList.remove('team-updating');
            element.classList.add('team-updated');
            setTimeout(() => {
                element.classList.remove('team-updated');
            }, 500);
        }, 250);
    }

    startCountdown() {
        if (!this.nextMatch) return;

        // Clear existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const targetDate = this.nextMatch.matchDateTime || new Date(`${this.nextMatch.date}T${this.nextMatch.time}`);
        
        this.countdownInterval = setInterval(() => {
            this.updateCountdown(targetDate);
        }, 1000);

        // Initial update
        this.updateCountdown(targetDate);
    }

    updateCountdown(targetDate) {
        const now = new Date();
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) {
            this.handleMatchStarted();
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Update countdown display
        this.updateCountdownDisplay(days, hours, minutes, seconds);
    }

    updateCountdownDisplay(days, hours, minutes, seconds) {
        // Get countdown elements
        const daysElement = document.querySelector('.timer-cell:nth-child(1) .h3-cta');
        const hoursElement = document.querySelector('.timer-cell:nth-child(3) .h3-cta');
        const minutesElement = document.querySelector('.timer-cell:nth-child(5) .h3-cta');
        const secondsElement = document.querySelector('.timer-cell:nth-child(7) .h3-cta');

        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    handleMatchStarted() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Update display to show match is live
        const leagueElement = document.querySelector('[data-w-id="94a13c46-e249-a18e-29ba-34851562e62a"]');
        if (leagueElement) {
            leagueElement.innerHTML = `<span class="live-indicator"></span>${this.nextMatch.competition.name} • LIVE NOW`;
        }

        // Set countdown to 00:00:00:00
        this.updateCountdownDisplay(0, 0, 0, 0);
    }

    showFallbackData() {
        // Show default data if API fails
        const homeTeamElement = document.querySelector('[data-w-id="95f7e6c9-9b2c-e6a7-0137-5e4b464ede50"]');
        const awayTeamElement = document.querySelector('[data-w-id="1602bf02-8b37-4379-a9a8-9787bdb087c7"]');
        
        if (homeTeamElement) homeTeamElement.textContent = 'Sports Vision';
        if (awayTeamElement) awayTeamElement.textContent = 'Upcoming Match';
        
        // Set a default countdown (e.g., 2 days from now)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        futureDate.setHours(18, 0, 0, 0);
        
        this.startCountdownWithDate(futureDate);

        // Create fallback matches for Future Matches section
        this.createFallbackMatches();
    }

    createFallbackMatches() {
        const fallbackMatches = [
            {
                home_name: 'Al Hilal',
                away_name: 'Al Nassr',
                matchDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
            },
            {
                home_name: 'Al Ittihad',
                away_name: 'Al Ahli',
                matchDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
            },
            {
                home_name: 'Al Shabab',
                away_name: 'Al Fateh',
                matchDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            },
            {
                home_name: 'Al Taawon',
                away_name: 'Al Ettifaq',
                matchDateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
            }
        ];

        // Update next match section with first fallback match
        const nextMatchSection = document.querySelector('.next-match-collection-list-wrapper .w-dyn-items');
        if (nextMatchSection && fallbackMatches.length > 0) {
            const firstMatch = fallbackMatches[0];
            const homeTeamName = nextMatchSection.querySelector('.teams-names .team:first-child .h4-table');
            const awayTeamName = nextMatchSection.querySelector('.teams-names .team:last-child .h4-table');
            
            if (homeTeamName) homeTeamName.textContent = firstMatch.home_name;
            if (awayTeamName) awayTeamName.textContent = firstMatch.away_name;

            const dateElements = nextMatchSection.querySelectorAll('.match-date .uppercase-paragraph');
            if (dateElements.length >= 2) {
                dateElements[0].textContent = this.formatDate(firstMatch.matchDateTime);
                dateElements[1].textContent = this.formatTime(firstMatch.matchDateTime);
            }
        }

        // Update matches list with remaining fallback matches
        this.updateMatchesList(fallbackMatches.slice(1));
    }

    startCountdownWithDate(targetDate) {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
            this.updateCountdown(targetDate);
        }, 1000);

        this.updateCountdown(targetDate);
    }

    // Debug method to check API and cache
    async debugAPI() {
        console.log('🔍 Debugging API and cache...');
        
        // Check cache info
        const cacheInfo = this.cacheManager.getCacheInfo();
        console.log('📊 Cache info:', cacheInfo);
        
        // Try to get fresh data
        try {
            const freshData = await this.cacheManager.forceRefresh();
            console.log('🔄 Fresh API data:', {
                matches: freshData.matches?.length || 0,
                teams: Object.keys(freshData.teams || {}).length,
                sampleMatch: freshData.matches?.[0]
            });
        } catch (error) {
            console.error('❌ API error:', error);
        }
    }

    // Debug method to check DOM elements
    debugDOM() {
        console.log('🔍 Debugging DOM elements...');
        
        // Check featured match section
        const featuredSection = document.querySelector('.next-match-collection-list-wrapper');
        console.log('Featured section found:', !!featuredSection);
        
        if (featuredSection) {
            const teamNames = featuredSection.querySelectorAll('.h4-table');
            console.log('Team name elements in featured:', teamNames.length);
            teamNames.forEach((el, i) => {
                console.log(`Team ${i + 1}:`, el.textContent, 'Visible:', el.offsetHeight > 0);
            });
        }
        
        // Check matches list section
        const matchesList = document.querySelector('.matches-collection-list-wrapper .w-dyn-items');
        console.log('Matches list found:', !!matchesList);
        
        if (matchesList) {
            const matchRows = matchesList.querySelectorAll('.match-row');
            console.log('Match rows found:', matchRows.length);
            matchRows.forEach((row, i) => {
                console.log(`Match ${i + 1}:`, {
                    opacity: row.style.opacity,
                    visible: row.offsetHeight > 0,
                    display: getComputedStyle(row).display
                });
            });
        }
        
        return {
            featuredSection: !!featuredSection,
            matchesList: !!matchesList,
            totalElements: document.querySelectorAll('.match-row').length
        };
    }

    // Debug method to test Future Matches section
    testFutureMatches() {
        console.log('🧪 Testing Future Matches section...');
        
        // Test data
        const testMatch = {
            home_id: '1',
            away_id: '2',
            home_name: 'Al Hilal',
            away_name: 'Al Nassr',
            date: '2024-01-15',
            time: '18:00',
            matchDateTime: new Date('2024-01-15T18:00:00')
        };
        
        this.upcomingMatches = [testMatch];
        this.teams = {
            '1': { id: '1', name: 'Al Hilal', logo: null },
            '2': { id: '2', name: 'Al Nassr', logo: null }
        };
        
        console.log('🧪 Test data set, updating sections...');
        this.updateNextMatchSection();
        this.updateMatchesList([testMatch]);
    }

    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.liveMatchesManager = new LiveMatchesManager();
    }, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.liveMatchesManager) {
        window.liveMatchesManager.destroy();
    }
}); 