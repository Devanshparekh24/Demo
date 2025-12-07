import dbConnection from '../dbConnection';

class UserModel {
    // Get all users
    static async findAll(filters = {}) {
        let query = "SELECT * FROM Users WHERE 1=1";

        if (filters.active !== undefined) {
            query += ` AND is_active = ${filters.active ? 1 : 0}`;
        }
        if (filters.role) {
            query += ` AND role = '${filters.role}'`;
        }

        query += " ORDER BY id";
        return await dbConnection.executeQuery(query);
    }

    // Get user by ID
    static async findById(id) {
        const query = `SELECT * FROM Users WHERE id = ${id}`;
        const result = await dbConnection.executeQuery(query);
        const data = result.recordset || result;
        return data[0] || null;
    }

    // Get user by email
    static async findByEmail(email) {
        const query = `SELECT * FROM Users WHERE email = '${email}'`;
        const result = await dbConnection.executeQuery(query);
        const data = result.recordset || result;
        return data[0] || null;
    }

    // Create new user
    static async create(userData) {
        const { name, email, phone, role, department, is_active } = userData;
        const query = `
            INSERT INTO Users (name, email, phone, role, department, is_active, created_at)
            VALUES ('${name}', '${email}', '${phone}', '${role}', '${department}', ${is_active ? 1 : 0}, GETDATE())
        `;
        await dbConnection.executeQuery(query);
        return { success: true, message: "User created successfully" };
    }

    // Update user
    static async update(id, userData) {
        const updates = [];
        if (userData.name) updates.push(`name = '${userData.name}'`);
        if (userData.email) updates.push(`email = '${userData.email}'`);
        if (userData.phone) updates.push(`phone = '${userData.phone}'`);
        if (userData.role) updates.push(`role = '${userData.role}'`);
        if (userData.department) updates.push(`department = '${userData.department}'`);
        if (userData.is_active !== undefined) updates.push(`is_active = ${userData.is_active ? 1 : 0}`);

        if (updates.length === 0) return { success: false, message: "No fields to update" };

        const query = `UPDATE Users SET ${updates.join(', ')}, updated_at = GETDATE() WHERE id = ${id}`;
        await dbConnection.executeQuery(query);
        return { success: true, message: "User updated successfully" };
    }
}

export default UserModel;
