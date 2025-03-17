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
exports.CollectionController = void 0;
const Collection_1 = __importDefault(require("@/models/Collection"));
class CollectionController {
    constructor(collectionRepository, userRepository) {
        this.collectionRepository = collectionRepository;
        this.userRepository = userRepository;
    }
    /**
     * Get all collections
     * @route GET /api/v1/collections
     */
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers.authorization;
                const collections = userId
                    ? yield this.collectionRepository.list(userId)
                    : yield this.collectionRepository.list();
                res.status(200).json({
                    success: true,
                    data: collections,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Get collection by ID
     * @route GET /api/v1/collections/:id
     */
    describe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const collection = yield this.collectionRepository.describe(id);
                if (!collection) {
                    res.status(404).json({
                        success: false,
                        error: 'Collection not found',
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: collection,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Create a new collection
     * @route POST /api/v1/collections
     */
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers.authorization;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        error: 'User ID is required',
                    });
                }
                const { id, name, isEnabled } = req.body;
                const validCollection = new Collection_1.default(id, name, isEnabled);
                const collection = yield this.collectionRepository.create(validCollection);
                yield this.userRepository.assignCollectionToUser(userId, collection.id);
                res.status(201).json({
                    success: true,
                    data: collection,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Update a collection
     * @route PUT /api/v1/collections/:id
     */
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, isEnabled } = req.body;
                const validCollection = new Collection_1.default(id, name, isEnabled);
                const collection = yield this.collectionRepository.update(validCollection);
                if (!collection) {
                    res.status(404).json({
                        success: false,
                        error: 'Collection not found',
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: collection,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Delete a collection
     * @route DELETE /api/v1/collections/:id
     */
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const success = yield this.collectionRepository.delete(id);
                if (!success) {
                    res.status(404).json({
                        success: false,
                        error: 'Collection not found',
                    });
                    return;
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
}
exports.CollectionController = CollectionController;
//# sourceMappingURL=collectionController.js.map