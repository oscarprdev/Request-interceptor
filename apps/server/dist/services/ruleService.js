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
exports.ruleService = exports.RuleService = void 0;
const pg_1 = require("pg");
const Rule_1 = __importDefault(require("@/models/Rule"));
const environment_1 = require("@/config/environment");
class RuleService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: environment_1.config.databaseUrl,
        });
    }
    list(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (options === null || options === void 0 ? void 0 : options.page) || 1;
                const limit = (options === null || options === void 0 ? void 0 : options.limit) || 10;
                const offset = (page - 1) * limit;
                const countQuery = `SELECT COUNT(*) FROM rules`;
                const countResult = yield this.pool.query(countQuery);
                const total = parseInt(countResult.rows[0].count, 10);
                const query = `
        SELECT * FROM rules 
        ORDER BY "priority" DESC
        LIMIT $1 OFFSET $2
      `;
                const result = yield this.pool.query(query, [limit, offset]);
                const rules = result.rows.map(row => this.mapToRule(row));
                return {
                    data: rules,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }
            catch (error) {
                console.error('Error in list:', error);
                throw error;
            }
        });
    }
    describe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT * FROM rules 
        WHERE id = $1
      `;
                const result = yield this.pool.query(query, [id]);
                if (result.rows.length === 0) {
                    return null;
                }
                return this.mapToRule(result.rows[0]);
            }
            catch (error) {
                console.error('Error in describe:', error);
                throw error;
            }
        });
    }
    create(rule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO rules (
          id,
          title,
          priority, 
          "urlFilter", 
          "resourceTypes", 
          "requestMethods", 
          "actionType", 
          "redirectUrl", 
          "isEnabled",
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
        RETURNING *
      `;
                const values = [
                    rule.id,
                    rule.title,
                    rule.priority,
                    rule.urlFilter,
                    rule.resourceTypes,
                    rule.requestMethods,
                    rule.actionType,
                    rule.redirectUrl,
                    rule.isEnabled,
                ];
                const result = yield this.pool.query(query, values);
                return this.mapToRule(result.rows[0]);
            }
            catch (error) {
                console.error('Error in create:', error);
                throw error;
            }
        });
    }
    update(rule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRule = yield this.describe(rule.id);
                if (!existingRule) {
                    return null;
                }
                const query = `
        UPDATE rules 
        SET title = $1, 
        priority = $2, 
        "urlFilter" = $3, 
        "resourceTypes" = $4, 
        "requestMethods" = $5, 
        "actionType" = $6,
        "redirectUrl" = $7, 
        "isEnabled" = $8,
        "updatedAt" = NOW()
        WHERE id = $9
        RETURNING *
      `;
                const { id, title, priority, urlFilter, resourceTypes, requestMethods, actionType, redirectUrl, isEnabled, } = rule;
                const result = yield this.pool.query(query, [
                    title,
                    priority,
                    urlFilter,
                    resourceTypes,
                    requestMethods,
                    actionType,
                    redirectUrl,
                    isEnabled,
                    id,
                ]);
                return this.mapToRule(result.rows[0]);
            }
            catch (error) {
                console.error('Error in update:', error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRule = yield this.describe(id);
                if (!existingRule) {
                    return false;
                }
                // await this.pool.query('DELETE FROM user_rules WHERE "ruleId" = $1', [id]);
                yield this.pool.query('DELETE FROM collection_rules WHERE "ruleId" = $1', [id]);
                const query = `
        DELETE FROM rules 
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
    listByCollectionId(collectionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (options === null || options === void 0 ? void 0 : options.page) || 1;
                const limit = (options === null || options === void 0 ? void 0 : options.limit) || 10;
                const offset = (page - 1) * limit;
                const countQuery = `
        SELECT COUNT(*) 
        FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
      `;
                const countResult = yield this.pool.query(countQuery, [collectionId]);
                const total = parseInt(countResult.rows[0].count, 10);
                const query = `
        SELECT r.* FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
        ORDER BY r.priority ASC
        LIMIT $2 OFFSET $3
      `;
                const result = yield this.pool.query(query, [collectionId, limit, offset]);
                const rules = result.rows.map(row => this.mapToRule(row));
                return {
                    data: rules,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }
            catch (error) {
                console.error('Error in listByCollectionId:', error);
                throw error;
            }
        });
    }
    mapToRule(row) {
        return new Rule_1.default(row.id, row.title, row.priority, row.urlFilter, row.resourceTypes, row.requestMethods, row.actionType, row.redirectUrl, row.isEnabled, row.createdAt, row.updatedAt);
    }
}
exports.RuleService = RuleService;
exports.ruleService = new RuleService();
//# sourceMappingURL=ruleService.js.map