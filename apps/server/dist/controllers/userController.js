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
exports.UserController = void 0;
const User_1 = __importDefault(require("@/models/User"));
class UserController {
    constructor(userRepository, collectionRepository) {
        this.userRepository = userRepository;
        this.collectionRepository = collectionRepository;
    }
    /**
     * Get user by ID
     * @route GET /api/v1/users/:id
     */
    findById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield this.userRepository.findById(id);
                if (!user) {
                    return res.status(200).json({
                        success: true,
                        data: null,
                    });
                }
                res.status(200).json({
                    success: true,
                    data: user,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Create a new user
     * @route POST /api/v1/users
     */
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const newUser = new User_1.default(userId);
                const user = yield this.userRepository.create(newUser);
                res.status(201).json({
                    success: true,
                    data: user,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Delete a user
     * @route DELETE /api/v1/users/:id
     */
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const success = yield this.userRepository.delete(id);
                if (!success) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found',
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
     * Get collections for a user
     * @route GET /api/v1/users/:id/collections
     */
    getUserCollections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                // Check if user exists
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found',
                    });
                }
                // Get collection IDs for this user
                const collectionIds = yield this.userRepository.getCollectionsByUserId(userId);
                // If no collections, return empty array
                if (collectionIds.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: [],
                    });
                }
                // Get full collection objects
                const collectionsPromises = collectionIds.map(id => this.collectionRepository.describe(id));
                const collections = yield Promise.all(collectionsPromises);
                // Filter out any null results (in case a collection was deleted)
                const validCollections = collections.filter(collection => collection !== null);
                res.status(200).json({
                    success: true,
                    data: validCollections,
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Assign a collection to a user
     * @route POST /api/v1/users/:userId/collections/:collectionId
     */
    assignCollectionToUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, collectionId } = req.params;
                // Check if user exists
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found',
                    });
                }
                // Check if collection exists
                const collection = yield this.collectionRepository.describe(collectionId);
                if (!collection) {
                    return res.status(404).json({
                        success: false,
                        error: 'Collection not found',
                    });
                }
                // Assign collection to user
                const success = yield this.userRepository.assignCollectionToUser(userId, collectionId);
                res.status(200).json({
                    success: true,
                    data: { assigned: success },
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
    /**
     * Remove a collection from a user
     * @route DELETE /api/v1/users/:userId/collections/:collectionId
     */
    removeCollectionFromUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, collectionId } = req.params;
                // Check if user exists
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found',
                    });
                }
                // Remove collection from user
                const success = yield this.userRepository.removeCollectionFromUser(userId, collectionId);
                if (!success) {
                    return res.status(404).json({
                        success: false,
                        error: 'Collection not assigned to user',
                    });
                }
                res.status(200).json({
                    success: true,
                    data: { removed: true },
                });
            }
            catch (error) {
                next && next(error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map