"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const router = (0, express_1.Router)();
router.get('/', controllers_1.ruleController.list.bind(controllers_1.ruleController));
router.put('/', controllers_1.ruleController.update.bind(controllers_1.ruleController));
router.get('/:id', controllers_1.ruleController.describe.bind(controllers_1.ruleController));
router.delete('/:id', controllers_1.ruleController.delete.bind(controllers_1.ruleController));
router.post('/:collectionId', controllers_1.ruleController.create.bind(controllers_1.ruleController));
router.get('/collection/:collectionId', controllers_1.ruleController.listByCollectionId.bind(controllers_1.ruleController));
exports.default = router;
//# sourceMappingURL=ruleRoutes.js.map