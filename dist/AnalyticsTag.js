var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function getUserData() {
    return __awaiter(this, void 0, void 0, function () {
        var userData, ipResponse, ip, locationResponse, locationData, error_1, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = {
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
                                os: (function (userAgent) {
                                    if (userAgent.indexOf('Windows') !== -1)
                                        return 'Windows';
                                    if (userAgent.indexOf('Mac') !== -1)
                                        return 'MacOS';
                                    if (userAgent.indexOf('Linux') !== -1)
                                        return 'Linux';
                                    if (userAgent.indexOf('Android') !== -1)
                                        return 'Android';
                                    if (userAgent.indexOf('iOS') !== -1)
                                        return 'iOS';
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
                                    type: navigator.connection ? navigator.connection.type : 'unknown',
                                    speed: navigator.connection ? navigator.connection.downlink : null
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
                            doNotTrack: navigator.doNotTrack || window.doNotTrack || 'unspecified',
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
                                sessionStorage: (function () {
                                    try {
                                        return !!window.sessionStorage;
                                    }
                                    catch (e) {
                                        return false;
                                    }
                                })(),
                                memoryState: {}
                            },
                            persistent: {
                                localStorage: (function () {
                                    try {
                                        return !!window.localStorage;
                                    }
                                    catch (e) {
                                        return false;
                                    }
                                })(),
                                indexedDB: (function () {
                                    try {
                                        return !!window.indexedDB;
                                    }
                                    catch (e) {
                                        return false;
                                    }
                                })()
                            }
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/api/ip')];
                case 2:
                    ipResponse = _a.sent();
                    return [4 /*yield*/, ipResponse.json()];
                case 3:
                    ip = (_a.sent()).ip;
                    userData.technical.network.ip = ip;
                    return [4 /*yield*/, fetch("http://ip-api.com/json/".concat("91.235.65.0"))];
                case 4:
                    locationResponse = _a.sent();
                    return [4 /*yield*/, locationResponse.json()];
                case 5:
                    locationData = _a.sent();
                    userData.technical.network.location = {
                        country: locationData.country || null,
                        region: locationData.regionName || null,
                        city: locationData.city || null,
                        town: locationData.city || null, // IP-API doesn't provide town specifically
                        org: locationData.org || null,
                    };
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Failed to fetch location data:', error_1);
                    return [3 /*break*/, 7];
                case 7:
                    // Event listeners with proper type checking
                    document.addEventListener('click', function (event) {
                        var target = event.target;
                        userData.behavior.actions.clicks.push({
                            timestamp: new Date().toISOString(),
                            x: event.clientX,
                            y: event.clientY,
                            target: (target === null || target === void 0 ? void 0 : target.tagName) || 'unknown',
                            id: (target === null || target === void 0 ? void 0 : target.id) || null
                        });
                    });
                    document.addEventListener('scroll', (function () {
                        var timeout;
                        return function () {
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                                userData.behavior.actions.scrolls.push({
                                    timestamp: new Date().toISOString(),
                                    scrollX: window.scrollX,
                                    scrollY: window.scrollY,
                                    maxScroll: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                                });
                            }, 150);
                        };
                    })());
                    // Track page navigation
                    window.addEventListener('popstate', function () {
                        userData.behavior.session.navigation.push({
                            timestamp: new Date().toISOString(),
                            from: document.referrer,
                            to: window.location.href,
                            type: 'navigation'
                        });
                    });
                    // Form submission tracking
                    document.addEventListener('submit', function (event) {
                        var target = event.target;
                        var formId = (target === null || target === void 0 ? void 0 : target.id) || 'unnamed_form';
                        userData.behavior.actions.forms[formId] = {
                            timestamp: new Date().toISOString(),
                            fields: Array.from(target.elements)
                                .filter(function (element) {
                                return element instanceof HTMLInputElement && element.type !== 'password';
                            })
                                .map(function (element) { return ({
                                type: element.type || 'unknown',
                                name: element.name || 'unnamed',
                                filled: !!element.value
                            }); })
                        };
                    });
                    console.log(userData);
                    return [4 /*yield*/, fetch('http://localhost:3000/pageLog', {
                            method: 'POST',
                            body: JSON.stringify(userData)
                        })];
                case 8:
                    response = _a.sent();
                    console.log(response);
                    return [2 /*return*/];
            }
        });
    });
}
getUserData();
