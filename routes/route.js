const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployee,
    deleteEmployee,
    createEmployee,
    updateEmployee,
} = require('../controllers/employeeController');
const {
    signUp,
    getUsers,
    signIn,
    refreshToken,
} = require('../controllers/authController');

const {
    createEmployee: createEmployee2,
    getEmployees: getEmployees2,
    getEmployee: getEmployee2,
    deleteEmployee: deleteEmployee2,
    updateEmployee: updateEmployee2,
} = require('../controllers/employee');

const {
    signUp: signUp2,
    signIn: signIn2,
    refreshToken: refreshToken2,
} = require('../controllers/auth');

const verifyToken = require('../middleware/auth');
const verifyRoles = require('../middleware/authorization');
const ROLES_LIST = require('../config/roles');
router.post('/api/signup', signUp);
router.post('/api/signin', signIn);
router.get('/api/users', verifyToken, verifyRoles(ROLES_LIST.Admin), getUsers);
router.post('/api/refreshtoken', refreshToken);

router.get(
    '/api/employees',
    verifyToken,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
    getEmployees,
);
router.get(
    '/api/employees/:id',
    verifyToken,
    verifyRoles(ROLES_LIST.Admin),
    getEmployee,
);
router.delete(
    '/api/employees/:id',
    verifyToken,
    verifyRoles(ROLES_LIST.Admin),
    deleteEmployee,
);
router.post('/api/employees', verifyToken, createEmployee);
router.put('/api/employees/:id', verifyToken, updateEmployee);

// version
router.post('/api/v2/employees', createEmployee2);
router.get('/api/v2/employees',verifyToken, verifyRoles(ROLES_LIST.Admin), getEmployees2);
router.get('/api/v2/employees/:id', getEmployee2);
router.delete('/api/v2/employees/:id', verifyToken, verifyRoles(ROLES_LIST.Admin), deleteEmployee2);
router.put('/api/v2/employees/:id', updateEmployee2);

// version
router.post('/api/v2/signup', signUp2);
router.post('/api/v2/signin', signIn2);
router.post('/api/v2/refreshtoken', refreshToken2);

module.exports = router;
