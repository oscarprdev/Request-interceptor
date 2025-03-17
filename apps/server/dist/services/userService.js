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
exports.userService = exports.UserService = void 0;
const pg_1 = require("pg");
const User_1 = __importDefault(require("@/models/User"));
const environment_1 = require("@/config/environment");
class UserService {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: environment_1.config.databaseUrl,
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT * FROM users 
        WHERE id = $1
      `;
                const result = yield this.pool.query(query, [id]);
                if (result.rows.length === 0) {
                    return null;
                }
                return this.mapToUser(result.rows[0]);
            }
            catch (error) {
                console.error('Error in findById:', error);
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT * FROM users 
        WHERE email = $1
      `;
                const result = yield this.pool.query(query, [email]);
                if (result.rows.length === 0) {
                    return null;
                }
                return this.mapToUser(result.rows[0]);
            }
            catch (error) {
                console.error('Error in findByEmail:', error);
                throw error;
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO users (
          id,
          "createdAt",
          "updatedAt"
        ) 
        VALUES ($1, NOW(), NOW()) 
        RETURNING *
      `;
                const values = [user.id];
                const result = yield this.pool.query(query, values);
                return this.mapToUser(result.rows[0]);
            }
            catch (error) {
                console.error('Error in create:', error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.findById(id);
                if (!existingUser) {
                    return false;
                }
                yield this.pool.query('DELETE FROM user_collections WHERE "userId" = $1', [id]);
                yield this.pool.query('DELETE FROM user_rules WHERE "userId" = $1', [id]);
                const query = `
        DELETE FROM users 
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
    getCollectionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT "collectionId" FROM user_collections
        WHERE "userId" = $1
      `;
                const result = yield this.pool.query(query, [userId]);
                return result.rows.map(row => row.collectionId);
            }
            catch (error) {
                console.error('Error in getCollectionsByUserId:', error);
                throw error;
            }
        });
    }
    assignCollectionToUser(userId, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        INSERT INTO user_collections ("userId", "collectionId", "createdAt", "updatedAt")
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT ("userId", "collectionId") DO NOTHING
        RETURNING *
      `;
                const result = yield this.pool.query(query, [userId, collectionId]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error in assignCollectionToUser:', error);
                throw error;
            }
        });
    }
    removeCollectionFromUser(userId, collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        DELETE FROM user_collections
        WHERE "userId" = $1 AND "collectionId" = $2
      `;
                const result = yield this.pool.query(query, [userId, collectionId]);
                return result.rowCount !== null && result.rowCount > 0;
            }
            catch (error) {
                console.error('Error in removeCollectionFromUser:', error);
                throw error;
            }
        });
    }
    mapToUser(row) {
        return new User_1.default(row.id, row.createdAt, row.updatedAt);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map