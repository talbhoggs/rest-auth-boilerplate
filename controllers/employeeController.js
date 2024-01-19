const fsPromises = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

// need to move this to a different file.
const data = {
  employees: require('../model/employees.json'),
  setEmployees(data) {
    this.employees = data;
  },
};

const getEmployees = async (req, res, next) => {
  res.status(200).json({
    successful: true,
    timestamp: Date.now(),
    status: 200,
    data: data.employees,
  });
};

const getEmployee = async (req, res, next) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id),
  );
  if (!employee) {
    return res.status(400).json({
      error: `Employee ID ${req.params.id} not found `,
      timestamp: Date.now(),
      status: 400,
    });
  }

  res.status(200).json({
    successful: true,
    timestamp: Date.now(),
    status: 200,
    data: employee,
  });
};

const deleteEmployee = async (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id),
  );

  if (!employee) {
    return res.status(400).json({
      error: `Employee ID ${req.params.id} not found `,
      timestamp: Date.now(),
      status: 400,
    });
  }

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id),
  );
  data.setEmployees([...filteredArray]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'employees.json'),
    JSON.stringify(data.employees),
  );

  res.status(200).json({
    successful: true,
    message: 'Resource delete successfully!',
    timestamp: Date.now(),
    status: 200,
    data: data.employees,
  });
};

// createEmployee
const createEmployee = async (req, res) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({
      error: 'First Name, Last Name and Email are required fields',
      timestamp: Date.now(),
      status: 400,
    });
  }

  // check for duplicate
  const duplicate = data.employees.find((employee) => employee.email === email);

  if (duplicate) {
    return res.status(400).json({
      error: 'Email has already been taken',
      timestamp: Date.now(),
      status: 400,
    });
  }

  // save
  const randomId = crypto.webcrypto.getRandomValues(new Uint32Array(10))[0];
  const newEmployee = {
    id: randomId,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };
  const updatedEmployees = [...data.employees, newEmployee];

  data.setEmployees(updatedEmployees);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'employees.json'),
    JSON.stringify(updatedEmployees),
  );
  res.status(201).json({
    successful: true,
    message: 'Created successfully!',
    timestamp: Date.now(),
    status: 201,
    data: newEmployee,
  });
};

// TODOS:
// updateEmployee
const updateEmployee = async (req, res) => {
  const existingEmployee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id),
  );

  if (!existingEmployee) {
    return res.status(400).json({
      error: `Employee ID ${req.params.id} not found `,
      timestamp: Date.now(),
      status: 400,
    });
  }

  // validation
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({
      error: 'First Name, Last Name and Email are required fields',
      timestamp: Date.now(),
      status: 400,
    });
  }

  const updatedEmployee = { ...existingEmployee, ...req.body };
  const updatedEmployees = data.employees.map((emp) => {
    if (emp.id === parseInt(req.params.id)) {
      emp = updatedEmployee;
    }
    return emp;
  });
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'employees.json'),
    JSON.stringify(updatedEmployees),
  );

  res.status(200).json({
    successful: true,
    message: 'Employee fields updated successfully!',
    timestamp: Date.now(),
    status: 200,
    data: updatedEmployee,
  });
};

module.exports = {
  getEmployees,
  getEmployee,
  deleteEmployee,
  createEmployee,
  updateEmployee,
};
