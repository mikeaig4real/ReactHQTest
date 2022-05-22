const {
    insertOneData,
    aggregateData,
} = require('../../db/connect');
const {
    UsersCollection
} = require('../../db/dbnames');



const find = async (filter, select) => {
    if (!filter) {
        throw new Error('filter is required');
    }
    try {
        const aggregation = [
            {
                $match: filter,
            },
            ...(select && Object.keys(select).length ? [{
                $project: select,
            }] : []),
        ]
        const { success, message, data } = await aggregateData(UsersCollection, aggregation);
        if (!success) {
            throw new Error(message);
        };
        return {
            error: false,
            data: data.length > 1 ? data : data[0]
        }
    } catch (error) {
        throw new Error(error);
    }
};

const create = async ({ firstName, lastName, email, phoneNo, course, accountNo }) => {
    if (!accountNo || !firstName || !(email || phoneNo) || !course) {
        throw new Error('Username, password, email are required');
    }
    try {
        const user = {
            firstName,
            email,
            course,
            accountNo,
            ...(lastName ? { lastName } : {}),
            ...(phoneNo ? { phoneNo } : {}),
        };
        const { success, message } = await insertOneData(UsersCollection, user);
        if (!success) {
            throw new Error(message);
        };
        return {
            error: false,
            message: 'User created successfully',
            data: user
        };
    } catch (error) {
        throw new Error(error);
    }
}



// export all functions
module.exports = {
    find,
    create,
}