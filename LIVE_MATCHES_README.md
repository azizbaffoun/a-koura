# Live Matches Caching System

## Overview
This system implements a daily caching mechanism for Saudi Premier League match data, reducing API calls and improving performance. Instead of making API calls for every visitor, the system:

1. **Caches data for 24 hours** - Only one API call per day
2. **Stores team information** - Preserves team data from API
3. **Supports team logos** - Easy logo management system
4. **Auto-updates at midnight** - Scheduled daily refresh
5. **Serves cached data** - Fast loading for all visitors

## Files Structure

```
js/
├── cors-proxy.js          # CORS proxy for API calls
├── matches-cache.js       # Main caching system
├── team-logos.js          # Logo management system
└── live-matches.js        # UI integration and display
```

## How It Works

### 1. Cache Management (`matches-cache.js`)
- **MatchesCacheManager** class handles all caching logic
- Stores match data and team information in localStorage
- Checks cache validity (24-hour expiry)
- Automatically fetches fresh data when cache expires
- Schedules daily updates at midnight

### 2. Team Logo System (`team-logos.js`)
- **TeamLogoManager** class manages team logos
- Stores logos separately from match data
- Supports both default and custom logos
- Easy console commands for logo management

### 3. Live Display (`live-matches.js`)
- **LiveMatchesManager** integrates with cache system
- Updates countdown timer with real team names
- Populates Future Matches section
- Uses English team names from API
- Displays team logos when available

## Adding Team Logos

### Method 1: Console Commands (Easiest)
Open browser console and use these commands:

```javascript
// Add a single team logo
addTeamLogo('123', 'images/teams/al-hilal.png');

// Add multiple logos at once
addMultipleLogos({
    '123': 'images/teams/al-hilal.png',
    '124': 'images/teams/al-nassr.png',
    '125': 'images/teams/al-ahli.png'
});

// List teams that don't have logos yet
listTeamsWithoutLogos();

// Show debug info about logos
showLogoDebugInfo();
```

### Method 2: Direct Code (For bulk setup)
Edit `team-logos.js` and add logos to the `getDefaultLogos()` method:

```javascript
getDefaultLogos() {
    return {
        '123': 'images/teams/al-hilal.png',
        '124': 'images/teams/al-nassr.png',
        '125': 'images/teams/al-ahli.png',
        // ... add more teams
    };
}
```

## Cache Information

### Storage Keys
- `spl_matches_cache` - Match data
- `spl_teams_cache` - Team information with English names
- `spl_last_update` - Last cache update timestamp
- `spl_team_logos` - Team logo URLs

### Cache Behavior
- **Valid for 24 hours** from last update
- **Auto-refresh at midnight** (scheduled)
- **Fallback to API** if cache is invalid
- **Manual refresh** available via retry button

## Console Debug Commands

```javascript
// Cache management
const cache = new MatchesCacheManager();
cache.getCacheInfo();           // Show cache status
cache.clearCache();             // Clear all cached data
cache.forceRefresh();           // Force API refresh

// Logo management
const logos = new TeamLogoManager();
logos.debugInfo();              // Show logo status
logos.clearStoredLogos();       // Clear custom logos
```

## API Data Structure

The system preserves all original API data including:
- Team names (English)
- Team translations (stored but not displayed)
- Match dates and times
- Competition information
- Round information
- Location data

## Performance Benefits

### Before (Per-Visitor API Calls)
- ❌ API call for every page load
- ❌ Slower loading times
- ❌ Higher server load
- ❌ Potential rate limiting

### After (Daily Caching)
- ✅ One API call per day
- ✅ Instant loading from cache
- ✅ Reduced server load
- ✅ Better user experience
- ✅ Team data preserved
- ✅ Logo support ready

## Hosting Considerations

### Firebase Hosting
- Static files work perfectly
- localStorage persists across sessions
- No server-side requirements
- Easy deployment

### Other Static Hosts
- Works with any static hosting provider
- No backend dependencies
- Client-side caching only

## Troubleshooting

### Cache Not Working
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check if cache has expired
4. Try manual refresh

### Missing Arabic Names
- Arabic names come from API `translations.ar` field
- Falls back to English name if Arabic not available
- Check API response structure

### Logos Not Showing
1. Verify logo URLs are correct
2. Check if images exist at specified paths
3. Use console commands to debug logo storage
4. Ensure team-logos.js is loaded before matches-cache.js

## Future Enhancements

- [ ] Admin panel for logo management
- [ ] Automatic logo fetching from external sources
- [ ] Match result caching
- [ ] Player information caching
- [ ] Multiple language support
- [ ] Offline mode support 