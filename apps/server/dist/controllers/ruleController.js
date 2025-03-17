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
exports.RuleController = void 0;
const Rule_1 = __importDefault(require("@/models/Rule"));
class RuleController {
    constructor(ruleRepository, collectionRepository, ruleCollectionsRepository) {
        this.ruleRepository = ruleRepository;
        this.collectionRepository = collectionRepository;
        this.ruleCollectionsRepository = ruleCollectionsRepository;
    }
    /**
     * Get all rules with pagination
     * @route GET /api/v1/rules
     */
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                const rules = yield this.ruleRepository.list({ page, limit });
                res.status(200).json(Object.assign({ success: true }, rules));
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Get rule by ID
     * @route GET /api/v1/rules/:id
     */
    describe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const rule = yield this.ruleRepository.describe(id);
                if (!rule) {
                    return res.status(404).json({
                        success: false,
                        error: 'Rule not found',
                    });
                }
                res.status(200).json({
                    success: true,
                    data: rule,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Create a new rule
     * @route POST /api/v1/rules
     */
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionId = req.params.collectionId;
                const collection = yield this.collectionRepository.describe(collectionId);
                if (!collection) {
                    return res.status(404).json({
                        success: false,
                        error: 'Collection not found',
                    });
                }
                const { id, title, urlFilter, requestMethods, redirectUrl, isEnabled, priority, actionType } = req.body;
                const defaultResourcesTypes = ['xmlhttprequest'];
                const newRule = new Rule_1.default(id, title, priority, urlFilter, defaultResourcesTypes, requestMethods, actionType, redirectUrl, isEnabled);
                const rule = yield this.ruleRepository.create(newRule);
                yield this.ruleCollectionsRepository.assignRuleToCollection(rule.id, collection.id);
                res.status(201).json({
                    success: true,
                    data: rule,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Update a rule
     * @route PUT /api/v1/rules/:id
     */
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, title, priority, urlFilter, requestMethods, redirectUrl, isEnabled, actionType } = req.body;
                const currentRule = yield this.ruleRepository.describe(id);
                if (!currentRule) {
                    return res.status(404).json({
                        success: false,
                        error: 'Rule not found',
                    });
                }
                const ruleUpdated = new Rule_1.default(id, title, priority, urlFilter, currentRule.resourceTypes, requestMethods, actionType, redirectUrl, isEnabled);
                const rule = yield this.ruleRepository.update(ruleUpdated);
                if (!rule) {
                    return res.status(404).json({
                        success: false,
                        error: 'Rule not found',
                    });
                }
                res.status(200).json({
                    success: true,
                    data: rule,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Delete a rule
     * @route DELETE /api/v1/rules/:id
     */
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const success = yield this.ruleRepository.delete(id);
                if (!success) {
                    return res.status(404).json({
                        success: false,
                        error: 'Rule not found',
                    });
                }
                res.status(200).json({
                    success: true,
                    data: {},
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Get rules by collection ID
     * @route GET /api/v1/rules/collection/:collectionId
     */
    listByCollectionId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionId = req.params.collectionId;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                const rules = yield this.ruleRepository.listByCollectionId(collectionId, { page, limit });
                res.status(200).json(Object.assign({ success: true }, rules));
            }
            catch (error) {
                next && next(error);
            }
        });
    }
}
exports.RuleController = RuleController;
//# sourceMappingURL=ruleController.js.map