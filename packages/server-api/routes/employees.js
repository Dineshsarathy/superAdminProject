const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const Employee = require('../models/Employee');


//get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get one employee

router.get('/:id', async (req, res) => {
    try {
        const employee= await Employee.findById(req.params.id);
 
        if (!employee) {
            res.status(404).json({message:"Employee Not Found"})
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Search route
router.get("/search", async (req, res) => {
    const query = req.query.query;
  
    try {
      const employee = await Employee.find({
        $or: [
          { Employee_name: { $regex: query, $options: "i" } }, // Case-insensitive match
          { Email_id: { $regex: query, $options: "i" } },
          { Employee_id: { $regex: query, $options: "i" } },
        ],
      });
  
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to search employees" });
    }
  });


//create an employee
router.post('/', async (req, res) => {
    const employee = new Employee({
        Employee_id: req.body.Employee_id,
        Employee_name: req.body.Employee_name,
        Password:req.body.Password,
        Email_id: req.body.Email_id,
        Employee_status: req.body.Employee_status,
        Mac_address: req.body.Mac_address,
        Phone_number: req.body.Phone_number
    });
    try {
        const newEmp = await employee.save();
        res.status(201).json(newEmp);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//Update employee
router.put('/:id', async (req, res) => {
    try {
        // Find employee by ID
        const employee = await Employee.findById(req.params.id);

        // Check if the employee exists
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        // Update fields only if provided in req.body
        employee.Employee_id = req.body.Employee_id || employee.Employee_id;
        employee.Employee_name = req.body.Employee_name || employee.Employee_name;
        employee.Password = req.body.Password || employee.Password;
        employee.Email_id = req.body.Email_id || employee.Email_id;
        employee.Employee_status = req.body.Employee_status !== undefined ? req.body.Employee_status : employee.Employee_status;
        employee.Mac_address = req.body.Mac_address || employee.Mac_address;
        employee.Phone_number = req.body. Phone_number || employee.Phone_number;
        // Set UpdatedAt field to current time
        employee.UpdatedAt = Date.now();

        // Save updated employee to the database
        const UpdatedEmp = await employee.save();
        
        // Respond with the updated employee
        res.json(UpdatedEmp);

    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
});


//Delete an Employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            return res.status(404).json({message: "Employee not found!"})
        }
        await Employee.findByIdAndDelete(employee._id)
        res.json({message: `Employee ${employee.Employee_id} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;