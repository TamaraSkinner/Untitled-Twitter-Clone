const pool = require('../db/db');

class UserBuilder {
    constructor() {
        this.userData = {};
    }

    setInfo(id, username, email, passwordHash) {
        this.userData.id = id;
        this.userData.username = username;
        this.userData.email = email;
        this.userData.passwordHash = passwordHash;
        return this;
    }

    build() {
        return new User(this.userData);
    }
}

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.passwordHash = userData.passwordHash;
    }

    async save() {
        try {
            await pool.query('BEGIN');

            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [this.email]);
            if (existingUser.rows.length > 0) {
                throw new Error('User already exists');
            }

            // Insert new user
            const newUser = await pool.query(
                'INSERT INTO users (wizard_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
                [this.username, this.email, this.passwordHash]
            );
            
            this.id = newUser.rows[0].id;
            await pool.query('COMMIT');
            return this.id;
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    }

    // Method to get user by email
    static async getByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return null;
        }
        const userData = result.rows[0];
        return new UserBuilder()
            .setInfo(userData.id, userData.wizard_name, userData.email, userData.password_hash)
            .build();
    }
}

module.exports = {User, UserBuilder};