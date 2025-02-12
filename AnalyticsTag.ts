// Add interfaces for our data structures
interface NetworkConnection {
    type: string;
    downlink: number;
}

interface NavigationEvent {
    timestamp: string;
    from: string;
    to: string;
    type: string;
}

interface ClickEvent {
    timestamp: string;
    x: number;
    y: number;
    target: string;
    id: string | null;
}

interface ScrollEvent {
    timestamp: string;
    scrollX: number;
    scrollY: number;
    maxScroll: number;
}

interface FormField {
    type: string;
    name: string;
    filled: boolean;
}

interface FormSubmission {
    timestamp: string;
    fields: FormField[];
}

interface UserData {
    technical: {
        httpHeaders: {
            userAgent: string;
            accept: string;
            referer: string;
            language: string;
            url: string;
        };
        browserAttributes: {
            screenResolution: {
                width: number;
                height: number;
            };
            timeZone: string;
            plugins: {
                pdf: boolean;
                flash: boolean;
            };
            os: string;
        };
        network: {
            ip: string | null;
            location: {
                country: string | null;
                region: string | null;
                city: string | null;
                town: string | null;
                org: string | null;
            };
            connection: {
                type: string;
                speed: number | null;
            };
        };
    };
    behavior: {
        session: {
            entryPoint: string;
            startTime: string;
            navigation: NavigationEvent[];
            interactions: any[];
        };
        actions: {
            clicks: ClickEvent[];
            scrolls: ScrollEvent[];
            forms: Record<string, FormSubmission>;
            searches: any[];
        };
    };
    privacy: {
        doNotTrack: string | null;
        cookiesEnabled: boolean;
        adBlocker: boolean;
        consent: {
            cookies: boolean | null;
            tracking: boolean | null;
            analytics: boolean | null;
        };
    };
    retention: {
        temporary: {
            sessionStorage: boolean;
            memoryState: Record<string, any>;
        };
        persistent: {
            localStorage: boolean;
            indexedDB: boolean;
        };
    };
}

async function getUserData(): Promise<UserData> {
    // User data collection structure populated with browser APIs
    const userData: UserData = {
        // Technical information
        technical: {
            httpHeaders: {
                userAgent: navigator.userAgent,
                accept: '*/*', // Cannot reliably get Accept header from client-side
                referer: document.referrer,
                language: navigator.language,
                url: window.location.href,
            },
            browserAttributes: {
                screenResolution: {
                    width: window.screen.width,
                    height: window.screen.height
                },
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                plugins: {
                    pdf: navigator.plugins.namedItem('PDF Viewer') !== null,
                    flash: navigator.plugins.namedItem('Shockwave Flash') !== null
                },
                os: ((userAgent) => {
                    if (userAgent.indexOf('Windows') !== -1) return 'Windows';
                    if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
                    if (userAgent.indexOf('Linux') !== -1) return 'Linux';
                    if (userAgent.indexOf('Android') !== -1) return 'Android';
                    if (userAgent.indexOf('iOS') !== -1) return 'iOS';
                    return 'Unknown';
                })(navigator.userAgent)
            },
            network: {
                ip: null,
                location: {
                    country: null,
                    region: null,
                    city: null,
                    town: null,
                    org: null,
                },
                connection: {
                    type: (navigator as any).connection ? (navigator as any).connection.type : 'unknown',
                    speed: (navigator as any).connection ? (navigator as any).connection.downlink : null
                }
            }
        },

        // Behavioral data
        behavior: {
            session: {
                entryPoint: document.referrer || window.location.href,
                startTime: new Date().toISOString(),
                navigation: [],
                interactions: []
            },
            actions: {
                clicks: [],
                scrolls: [],
                forms: {},
                searches: []
            }
        },

        // Privacy settings
        privacy: {
            doNotTrack: navigator.doNotTrack || (window as any).doNotTrack || 'unspecified',
            cookiesEnabled: navigator.cookieEnabled,
            adBlocker: false, // Needs additional detection logic
            consent: {
                cookies: null,
                tracking: null,
                analytics: null
            }
        },

        // Data retention
        retention: {
            temporary: {
                sessionStorage: (() => {
                    try {
                        return !!window.sessionStorage;
                    } catch (e) {
                        return false;
                    }
                })(),
                memoryState: {}
            },
            persistent: {
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
            }
        }
    };

    // Fetch IP and location data
    try {
        const ipResponse = await fetch('/api/ip');
        const { ip } = await ipResponse.json();
        userData.technical.network.ip = ip;

        // Fetch location data using IP-API
        const locationResponse = await fetch(`http://ip-api.com/json/${"91.235.65.0"}`);
        const locationData = await locationResponse.json();
        
        userData.technical.network.location = {
            country: locationData.country || null,
            region: locationData.regionName || null,
            city: locationData.city || null,
            town: locationData.city || null, // IP-API doesn't provide town specifically
            org: locationData.org || null,
        };
    } catch (error) {
        console.error('Failed to fetch location data:', error);
    }

    // Event listeners with proper type checking
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        userData.behavior.actions.clicks.push({
            timestamp: new Date().toISOString(),
            x: event.clientX,
            y: event.clientY,
            target: target?.tagName || 'unknown',
            id: target?.id || null
        });
    });

    document.addEventListener('scroll', (() => {
        let timeout: ReturnType<typeof setTimeout>;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                userData.behavior.actions.scrolls.push({
                    timestamp: new Date().toISOString(),
                    scrollX: window.scrollX,
                    scrollY: window.scrollY,
                    maxScroll: Math.max(
                        document.body.scrollHeight,
                        document.documentElement.scrollHeight
                    )
                });
            }, 150);
        };
    })());

    // Track page navigation
    window.addEventListener('popstate', () => {
        userData.behavior.session.navigation.push({
            timestamp: new Date().toISOString(),
            from: document.referrer,
            to: window.location.href,
            type: 'navigation'
        });
    });

    // Form submission tracking
    document.addEventListener('submit', (event: SubmitEvent) => {
        const target = event.target as HTMLFormElement;
        const formId = target?.id || 'unnamed_form';
        userData.behavior.actions.forms[formId] = {
            timestamp: new Date().toISOString(),
            fields: Array.from(target.elements)
                .filter((element): element is HTMLInputElement => 
                    element instanceof HTMLInputElement && element.type !== 'password'
                )
                .map(element => ({
                    type: element.type || 'unknown',
                    name: element.name || 'unnamed',
                    filled: !!element.value
                }))
        };
    });
    console.log(userData);

    const response = await fetch('http://localhost:3000/pageLog', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    console.log(response);
}

getUserData();