"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const router = (0, express_1.Router)();
router.get('/count/:collectionId', controllers_1.ruleCollectionsController.countRulesByCollection.bind(controllers_1.ruleCollectionsController));
exports.default = router;
//# sourceMappingURL=ruleCollectionsRoutes.js.map