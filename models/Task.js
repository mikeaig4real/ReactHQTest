const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    name: {
            required: [true, 'A name is needed'],
            type: String,
            maxLength: [30, 'name length cannot be bigger than 30'],
            trim: true,
        },
    completed: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        required: [true,'provide user please'],
        type: mongoose.Types.ObjectId,
        ref:'User',
    }
    }, {
        writeConcern: {
            w: 'majority',
            j: true,
            wtimeout: 1000
    },
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);