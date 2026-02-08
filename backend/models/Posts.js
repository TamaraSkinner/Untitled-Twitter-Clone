const pool = require('../db/db');

class PostBuilder {
    constructor() {
        this.postData = {};
    }

    setInfo(id, userId, content, createdAt) {
        this.postData.id = id;
        this.postData.userId = userId;
        this.postData.content = content;
        this.postData.createdAt = createdAt;
        return this;
    }

    build() {
        return new Post(this.postData);
    }
}

class Post {
    constructor(postData) {
        this.id = postData.id;
        this.userId = postData.userId;
        this.content = postData.content;
        this.createdAt = postData.createdAt || new Date();
    }

    async save() {
        try {
            console.log("userId:", this.userId);
            console.log("content:", this.content);
            if (!this.userId || !this.content) {
                throw new Error('User ID and content are required to save a post');
            }
            await pool.query('BEGIN');
            const result = await pool.query(
                'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING id',
                [this.userId, this.content]
            );
            this.id = result.rows[0].id;
            await pool.query('COMMIT');
            return this.id;
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    }

    static async find() {
        try {
            const result = await pool.query(
                `SELECT posts.*, users.wizard_name 
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                ORDER BY created_at DESC LIMIT 20`
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { PostBuilder, Post };
