// CORS Proxy Handler for Live Sports API
class CORSProxyManager {
    constructor() {
        this.proxyUrls = [
            'https://api.allorigins.win/get?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxyIndex = 0;
    }

    async fetchWithProxy(url, options = {}) {
        // First try direct fetch (in case CORS is not an issue)
        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors'
            });
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.log('Direct fetch failed, trying proxy...');
        }

        // Try with proxy services
        for (let i = 0; i < this.proxyUrls.length; i++) {
            try {
                const proxyUrl = this.proxyUrls[this.currentProxyIndex];
                let proxiedUrl;
                
                if (proxyUrl.includes('allorigins')) {
                    proxiedUrl = `${proxyUrl}${encodeURIComponent(url)}`;
                    const response = await fetch(proxiedUrl);
                    if (response.ok) {
                        const data = await response.json();
                        // allorigins returns the response in a 'contents' field
                        return {
                            ok: true,
                            json: () => Promise.resolve(JSON.parse(data.contents))
                        };
                    }
                } else {
                    proxiedUrl = `${proxyUrl}${url}`;
                    const response = await fetch(proxiedUrl, options);
                    if (response.ok) {
                        return response;
                    }
                }
            } catch (error) {
                console.log(`Proxy ${this.currentProxyIndex} failed:`, error);
            }
            
            this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
        }

        throw new Error('All proxy attempts failed');
    }
}

// Export for use in other scripts
window.CORSProxyManager = CORSProxyManager; 