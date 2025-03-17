"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const router = (0, express_1.Router)();
router.get('/:id', controllers_1.userController.findById.bind(controllers_1.userController));
router.post('/', controllers_1.userController.create.bind(controllers_1.userController));
router.delete('/:id', controllers_1.userController.delete.bind(controllers_1.userController));
// Collection management routes
router.get('/:id/collections', controllers_1.userController.getUserCollections.bind(controllers_1.userController));
router.post('/:userId/collections/:collectionId', controllers_1.userController.assignCollectionToUser.bind(controllers_1.userController));
router.delete('/:userId/collections/:collectionId', controllers_1.userController.removeCollectionFromUser.bind(controllers_1.userController));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map