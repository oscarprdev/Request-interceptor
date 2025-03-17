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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleCollectionsService = exports.RuleCollectionsService = void 0;
const environment_1 = require("@/config/environment");
const pg_1 = require("pg");
class RuleCollectionsService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: environment_1.config.databaseUrl,
        });
    }
    countRulesByCollection(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countQuery = `
      SELECT COUNT(*) AS count
      FROM collection_rules
      WHERE "collectionId" = $1
    `;
                const result = yield this.pool.query(countQuery, [collectionId]);
                return parseInt(result.rows[0].count, 10);
            }
            catch (error) {
                console.error('Error counting rules by collection');
                throw error;
            }
        });
    }
    assignRuleToCollection(ruleId, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO collection_rules ("collectionId", "ruleId", "createdAt", "updatedAt") 
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT ("collectionId", "ruleId") DO NOTHING
      `;
                const values = [collectionId, ruleId];
                const result = yield this.pool.query(query, values);
                if (!result || !result.rowCount) {
                    yield this.pool.query('DELETE FROM rules WHERE "ruleId" = $1', [ruleId]);
                }
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error in assignRuleToCollection:', error);
                throw error;
            }
        });
    }
}
exports.RuleCollectionsService = RuleCollectionsService;
exports.ruleCollectionsService = new RuleCollectionsService();
//# sourceMappingURL=ruleCollectionsService.js.map