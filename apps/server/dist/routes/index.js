"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ruleRoutes_1 = __importDefault(require("./ruleRoutes"));
const collectionRoutes_1 = __importDefault(require("./collectionRoutes"));
const ruleCollectionsRoutes_1 = __importDefault(require("./ruleCollectionsRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const router = (0, express_1.Router)();
const COMMON_ROUTE = '/api/v1';
router.use(`${COMMON_ROUTE}/rules`, ruleRoutes_1.default);
router.use(`${COMMON_ROUTE}/collections`, collectionRoutes_1.default);
router.use(`${COMMON_ROUTE}/rules-collections`, ruleCollectionsRoutes_1.default);
router.use(`${COMMON_ROUTE}/users`, userRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map