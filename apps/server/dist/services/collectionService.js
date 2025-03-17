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
exports.collectionService = exports.CollectionService = void 0;
const pg_1 = require("pg");
const Collection_1 = __importDefault(require("@/models/Collection"));
const environment_1 = require("@/config/environment");
class CollectionService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: environment_1.config.databaseUrl,
        });
    }
    /**
     * Get all collections
     */
    list(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query;
                let params = [];
                if (userId) {
                    // Get collections for a specific user
                    query = `
          SELECT c.* FROM collections c
          JOIN user_collections uc ON c.id = uc."collectionId"
          WHERE uc."userId" = $1
          ORDER BY c."createdAt" DESC
        `;
                    params = [userId];
                }
                else {
                    // Get all collections
                    query = `
          SELECT * FROM collections 
          ORDER BY "createdAt" DESC
        `;
                }
                const result = yield this.pool.query(query, params);
                return result.rows.map(row => this.mapToCollection(row));
            }
            catch (error) {
                console.error('Error in findAll:', error);
                throw error;
            }
        });
    }
    /**
     * Get collection by ID
     */
    describe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT * FROM collections 
        WHERE id = $1
      `;
                const result = yield this.pool.query(query, [id]);
                if (result.rows.length === 0) {
                    return null;
                }
                return this.mapToCollection(result.rows[0]);
            }
            catch (error) {
                console.error('Error in findById:', error);
                throw error;
            }
        });
    }
    /**
     * Create a new collection
     */
    create(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO collections (
          name, 
          "isEnabled",
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, NOW(), NOW()) 
        RETURNING *
      `;
                const values = [collection.name, collection.isEnabled];
                const result = yield this.pool.query(query, values);
                return this.mapToCollection(result.rows[0]);
            }
            catch (error) {
                console.error('Error in create:', error);
                throw error;
            }
        });
    }
    /**
     * Update a collection
     */
    update(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCollection = yield this.describe(collection.id);
                if (!existingCollection) {
                    return null;
                }
                const query = `
        UPDATE collections 
        SET name = $1, "isEnabled" = $2, "updatedAt" = NOW()
        WHERE id = $3 
        RETURNING *
      `;
                const values = [collection.name, collection.isEnabled, collection.id];
                const result = yield this.pool.query(query, values);
                return this.mapToCollection(result.rows[0]);
            }
            catch (error) {
                console.error('Error in update:', error);
                throw error;
            }
        });
    }
    /**
     * Delete a collection
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCollection = yield this.describe(id);
                if (!existingCollection) {
                    return false;
                }
                const rulesQuery = `
        SELECT "ruleId" FROM collection_rules 
        WHERE "collectionId" = $1
      `;
                const rulesResult = yield this.pool.query(rulesQuery, [id]);
                const ruleIds = rulesResult.rows.map(row => row.ruleId);
                yield this.pool.query('DELETE FROM user_collections WHERE "collectionId" = $1', [id]);
                yield this.pool.query('DELETE FROM collection_rules WHERE "collectionId" = $1', [id]);
                for (const ruleId of ruleIds) {
                    yield this.pool.query('DELETE FROM rules WHERE id = $1', [ruleId]);
                }
                const query = `
        DELETE FROM collections 
        WHERE id = $1
      `;
                const result = yield this.pool.query(query, [id]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error in delete:', error);
                throw error;
            }
        });
    }
    mapToCollection(row) {
        return new Collection_1.default(row.id, row.name, row.isEnabled, row.createdAt, row.updatedAt);
    }
}
exports.CollectionService = CollectionService;
exports.collectionService = new CollectionService();
//# sourceMappingURL=collectionService.js.map