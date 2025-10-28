import db from '../config/db.js'

export const fetchAllServices = async() => {
    try {
        const [rows] = await db.query("select * from Services");
        return rows;
    } catch (error) {
        console.log('Error: fetchAllServices function', error);
        return error;
    }
}

export const addNewService = async({service_name, price, description, status}) => {
    try {
        const [newService] = await db.query(
            `
            insert into Services (service_name, price, description, status, created_at) values (?, ?, ?, ?, now())
            `, [service_name, price, description, status]
        )
        const [rows] = await db.query("select * from Services where service_id = ?", [newService.insertId]);
        return rows[0];
    } catch (error) {
        console.log('Error: addNewService function', error);
        return error;
    }
}

export const updatingService = async(id, serviceData) => {
    try {
        const [existingService] = await db.query("select * from Services where service_id = ?", [id]);
        if(existingService.length === 0) {
            throw new Error(`Service with id ${id} not found.`);
        }
        const{service_name, price, description, status} = serviceData;
        await db.query(
            `
            update Services
                set service_name = ?,
                    price = ?,
                    description = ?,
                    status = ?,
                    updated_at = now()
                where service_id = ?
            `, [service_name, price, description, status, id]
        );
        const [updated] = await db.query("select * from Services where service_id = ?", [id]);
        return updated[0];
    } catch (error) {
        console.log('Error: updatingService function', error);
        return error;
    }
}

export const deletingService = async(id) => {
    try {
        const [existingService] = await db.query("select * from Services where service_id = ?", [id]);
        if(existingService.length === 0) {
            throw new Error(`Service with id ${id} not found.`);
        }
        await db.query(
            `
            delete from Services
            where service_id = ?
            `, [id]
        );
        return {message: `Service with id ${id} has been deleted.`};
    } catch (error) {
        console.log('Error: deletingService function', error);
        return error;
    }
}

export const fetchAllServiceOrders = async() => {
    try {
        const [rows] = await db.query(
            `
            select o.*, s.service_name, s.price, s.description 
            from ServiceOrdered o join Services s on o.service_id = s.service_id
            `
        );
        return rows;
    } catch (error) {
        console.log('Error: fetchAllServices function', error);
        return error;
    }
}