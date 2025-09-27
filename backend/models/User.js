const { getSupabase } = require("../config/database");
const crypto = require("crypto");

class User {
  static async createTable() {
    console.log("📋 User table should be created in Supabase Dashboard");
    console.log("📋 Run the following SQL in your Supabase SQL Editor:");
    console.log(`
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed)
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true);
    `);
  }

  static async hashPassword(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex");
      crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ":" + derivedKey.toString("hex"));
      });
    });
  }

  static async verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");
      crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString("hex"));
      });
    });
  }

  static async create(userData) {
    const supabase = getSupabase();
    
    try {
      const passwordHash = await this.hashPassword(userData.password);
      
      const { data, error } = await supabase
        .from("users")
        .insert([{
          email: userData.email,
          password_hash: passwordHash
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { id: data.id, email: data.email };
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  static async findByEmail(email) {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") { // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error finding user by email:", err);
      throw err;
    }
  }
}

module.exports = User;