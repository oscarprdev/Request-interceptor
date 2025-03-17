"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const environment_1 = require("./config/environment");
const errorHandler_1 = require("./middleware/errorHandler");
const initDb_1 = __importDefault(require("./scripts/initDb"));
const routes_1 = __importDefault(require("./routes"));
// Initialize express app
const app = (0, express_1.default)();
const port = environment_1.config.port;
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, helmet_1.default)()); // Security headers
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json()); // Parse JSON bodies
// Routes
app.use(routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize database tables
        yield (0, initDb_1.default)();
        console.log('Database tables initialized successfully.');
        // Start listening
        app.listen(port, () => {
            console.log(`Server running on port ${port} in ${environment_1.config.nodeEnv} mode`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
// Export for Vercel
exports.default = app;
//# sourceMappingURL=index.js.map