const mongoose = require('mongoose');
const {Schema} = mongoose;

const employeeSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
        timestamps: true,
    },
);

module.exports = mongoose.model('Employee', employeeSchema);
