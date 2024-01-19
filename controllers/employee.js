const employee = require('../model/Employees');

const createEmployee = async (req, res, next) => {
    const {firstname, lastname, email} = req.body;

    if (!firstname || !lastname || !email) {
        return res.status(400).json({
            error: 'First Name, Last Name and Email are required fields',
            timestamp: Date.now(),
            status: 400,
        });
    }

    const existingEmployee = await employee.findOne({email: email});

    if (existingEmployee) {
        return res.status(400).json({
            error: 'Email has already been taken',
            timestamp: Date.now(),
            status: 400,
        });
    }

    const newEmployee = await employee.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
    });

    delete newEmployee.__v;

    res.status(201).json({
        successful: true,
        message: 'Created successfully!',
        timestamp: Date.now(),
        status: 201,
        data: newEmployee,
    });
};

const updateEmployee = async (req, res, next) => {
    try {
        let existingEmployee = await employee.findOne({_id: req.params.id});

        if (!existingEmployee) {
            return res.status(400).json({
                error: `Employee ID ${req.params.id} not found `,
                timestamp: Date.now(),
                status: 400,
            });
        }

        // validation
        const {firstname, lastname} = req.body;

        if (firstname) {
            existingEmployee.firstname = firstname;
        }

        if (lastname) {
            existingEmployee.lastname = lastname;
        }

        const result = await existingEmployee.save();

        res.status(200).json({
            successful: true,
            message: `Employee fields updated successfully!`,
            timestamp: Date.now(),
            status: 200,
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            timestamp: Date.now(),
            status: 400,
        });
    }
};

const getEmployees = async (req, res, next) => {
    const employees = await employee.find();
    // only show this 3 fields
    //const formatedEmployess = employees.map(({_id, firstname, lastname})=> {return {_id, firstname, lastname}});

    res.status(200).json({
        successful: true,
        timestamp: Date.now(),
        status: 200,
        data: employees,
    });
};

const getEmployee = async (req, res, next) => {
    try {
        const existingEmployee = await employee.findOne({_id: req.params.id});

        if (!existingEmployee) {
            return res.status(400).json({
                error: 'Employee not found',
                timestamp: Date.now(),
                status: 400,
            });
        }
        res.status(200).json({
            successful: true,
            timestamp: Date.now(),
            status: 200,
            data: existingEmployee,
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            timestamp: Date.now(),
            status: 400,
        });
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const existingEmployee = await employee.findOne({_id: req.params.id});

        if (!existingEmployee) {
            return res.status(400).json({
                error: 'Employee not found',
                timestamp: Date.now(),
                status: 400,
            });
        }
        const {_id, firstname, lastname} = existingEmployee;
        const formatedEmployee = {_id, firstname, lastname};
        await existingEmployee.deleteOne();

        res.status(200).json({
            successful: true,
            message: `Employee ${formatedEmployee._id} deleted successfully`,
            timestamp: Date.now(),
            status: 200,
            data: formatedEmployee,
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message,
            timestamp: Date.now(),
            status: 400,
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    deleteEmployee,
    updateEmployee,
};
