"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("@/config/environment");
exports.corsMiddleware = (0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin)
            return callback(null, true);
        // Check if the origin is allowed
        if (environment_1.config.allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        else {
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
});
//# sourceMappingURL=cors.js.map