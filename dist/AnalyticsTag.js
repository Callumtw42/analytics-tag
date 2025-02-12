// Add interfaces for our data structures
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
function logUserData() {
    return __awaiter(this, void 0, void 0, function () {
        var userData, ipResponse, ip, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = {
                        userAgent: navigator.userAgent,
                        referer: document.referrer,
                        language: navigator.language,
                        url: window.location.href,
                        screenHeight: window.screen.height,
                        screenWidth: window.screen.width,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
                        })(navigator.userAgent),
                        ip: null,
                        location: {
                            country: null,
                            region: null,
                            city: null,
                            town: null,
                            org: null,
                        },
                        connectionType: navigator.connection ? navigator.connection.type : 'unknown',
                        connectionSpeed: navigator.connection ? navigator.connection.downlink : null,
                        entryPoint: document.referrer || window.location.href,
                        loadTimestamp: new Date().toISOString(),
                        doNotTrack: navigator.doNotTrack || window.doNotTrack || 'unspecified',
                        cookiesEnabled: navigator.cookieEnabled,
                        sessionStorage: (function () {
                            try {
                                return !!window.sessionStorage;
                            }
                            catch (e) {
                                return false;
                            }
                        })(),
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
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('https://api.ipify.org')];
                case 2:
                    ipResponse = _a.sent();
                    return [4 /*yield*/, ipResponse.text()];
                case 3:
                    ip = _a.sent();
                    userData.ip = ip;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to fetch location data:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, fetch('http://localhost:3000/pageLog', {
                        method: 'POST',
                        body: JSON.stringify(userData)
                    })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
logUserData();
