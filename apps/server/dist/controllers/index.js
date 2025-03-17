"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.ruleCollectionsController = exports.collectionController = exports.ruleController = void 0;
const ruleService_1 = require("@/services/ruleService");
const collectionService_1 = require("@/services/collectionService");
const ruleCollectionsService_1 = require("@/services/ruleCollectionsService");
const userService_1 = require("@/services/userService");
const ruleController_1 = require("./ruleController");
const collectionController_1 = require("./collectionController");
const ruleCollectionsController_1 = require("./ruleCollectionsController");
const userController_1 = require("./userController");
exports.ruleController = new ruleController_1.RuleController(ruleService_1.ruleService, collectionService_1.collectionService, ruleCollectionsService_1.ruleCollectionsService);
exports.collectionController = new collectionController_1.CollectionController(collectionService_1.collectionService, userService_1.userService);
exports.ruleCollectionsController = new ruleCollectionsController_1.RuleCollectionsController(ruleCollectionsService_1.ruleCollectionsService);
exports.userController = new userController_1.UserController(userService_1.userService, collectionService_1.collectionService);
//# sourceMappingURL=index.js.map