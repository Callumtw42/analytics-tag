// Add interfaces for our data structures

interface UserData {
    userAgent: string;
    referer: string;
    language: string;
    url: string;
    screenHeight: number;
    screenWidth: number;
    timeZone: string;
    os: string;
    ip: string | null;
    location: {
        country: string | null;
        region: string | null;
        city: string | null;
        town: string | null;
        org: string | null;
    };
    connectionType: string | null;
    connectionSpeed: number | null;
    entryPoint: string;
    loadTimestamp: string;
    doNotTrack: string;
    cookiesEnabled: boolean;
    sessionStorage: boolean;
    localStorage: boolean;
    indexedDB: boolean; 
}

export async function logUserData() {
    // User data collection structure populated with browser APIs
    const userData: UserData = {
        userAgent: navigator.userAgent,
        referer: document.referrer,
        language: navigator.language,
        url: window.location.href,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        os: ((userAgent) => {
            if (userAgent.indexOf('Windows') !== -1) return 'Windows';
            if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
            if (userAgent.indexOf('Linux') !== -1) return 'Linux';
            if (userAgent.indexOf('Android') !== -1) return 'Android';
            if (userAgent.indexOf('iOS') !== -1) return 'iOS';
            return 'Unknown';
        })(navigator.userAgent),
        ip: null,
        location: {
            country: null,
            region: null,
            city: null,
            town: null,
            org: null,
        },
        connectionType: (navigator as any).connection ? (navigator as any).connection.type : 'unknown',
        connectionSpeed: (navigator as any).connection ? (navigator as any).connection.downlink : null,
        entryPoint: document.referrer || window.location.href,
        loadTimestamp: new Date().toISOString(),
        doNotTrack: navigator.doNotTrack || (window as any).doNotTrack || 'unspecified',
        cookiesEnabled: navigator.cookieEnabled,
        sessionStorage: (() => {
            try {
                return !!window.sessionStorage;
            } catch (e) {
                return false;
            }
        })(),
        localStorage: (() => {
            try {
                return !!window.localStorage;
            } catch (e) {
                return false;
            }
        })(),
        indexedDB: (() => {
            try {
                return !!window.indexedDB;
            } catch (e) {
                return false;
            }
        })()
    };

    // Fetch IP and location data
    try {
        const ipResponse = await fetch('https://api.ipify.org');
        const ip = await ipResponse.text();
        userData.ip = ip;

    } catch (error) {
        console.error('Failed to fetch location data:', error);
    }

    await fetch('http://localhost:3000/pageLog', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

logUserData();