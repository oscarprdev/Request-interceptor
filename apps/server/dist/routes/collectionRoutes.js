"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const router = (0, express_1.Router)();
router.get('/', controllers_1.collectionController.list.bind(controllers_1.collectionController));
router.post('/', controllers_1.collectionController.create.bind(controllers_1.collectionController));
router.put('/', controllers_1.collectionController.update.bind(controllers_1.collectionController));
router.get('/:id', controllers_1.collectionController.describe.bind(controllers_1.collectionController));
router.delete('/:id', controllers_1.collectionController.delete.bind(controllers_1.collectionController));
exports.default = router;
//# sourceMappingURL=collectionRoutes.js.map