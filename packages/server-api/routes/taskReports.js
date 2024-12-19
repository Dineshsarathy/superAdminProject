const express = require('express');
const router = express.Router();
const TaskReports = require('../models/TaskReports');
const Employee = require('../models/Employee');

//get all Task Reports

router.get('/', async (req, res) => {
    try {
        const taskreport = await TaskReports.find();
        res.json(taskreport)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get tasks by id
router.get('/:id', async (req, res) => {
    try {
        const taskreport = await TaskReports.findById(req.params.id);
        if (!TaskReports) {
            res.status(404).json({message:"Task report not found"})
        }
    } catch (error) {
        res.status(404).json({message:"Task report not found"})
    }
})

//Create an Task
router.post('/', async (req, res) => {
    const taskreport = new TaskReports({
        Employee:req.body.Employee,
        Task_Id:req.body.Task_Id,
        AssignedTask:req.body.AssignedTask,
        AssignedBy:req.body.Bug_Id,
        AssignedDate:req.body.AssignedDate,
        DueDate:req.body.DueDate,
        CompletedDate:req.body.CompletedDate,
        Delay:req.body.Delay,
    });
    try {
        const newTask= await taskreport.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.put('/:id', async (req, res) => {
    try {
        const taskreport= await TaskReports.findById(req.params.id)
        if (!taskreport) {
            return res.status(404).json({ message: "Task-Report Not Found" });
        }

        taskreport.Employee = req.body.Employee || bugreport.Employee;
        taskreport.Task_Id = req.body.Task_Id || bugreport.Task_Id;
        taskreport.AssignedTask = req.body.AssignedTask || bugreport.AssignedTask;
        taskreport.AssignedBy = req.body.AssignedBy || bugreport.AssignedBy;
        taskreport.AssignedDate = req.body.AssignedDate || bugreport.AssignedDate;
        taskreport.DueDate = req.body.DueDate || bugreport.DueDate;
        taskreport.CompletedDate = req.body.CompletedDate || bugreport.CompletedDate;
        taskreport.Delay = req.body.Delay || bugreport.Delay;

        taskreport.updatedAt = Date.now();

        const updatedTask = await taskreport.save();

        res.json(updatedTask);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Delete a task

router.delete('/:id', async (req, res) => {
    try {
        const taskreport = await TaskReports.findById(req.params.id);
        if(!TaskReports){
            return res.status(404).json({message: "Selected task is not found!"})
        }
        await TaskReports.findByIdAndDelete(taskreport._id)
        res.json({message: `Task-report is deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// fetch template by employee
router.get('/employees/:empId', async (req,res) => {
    try {
        const empId=req.params.empId;
        //Validate Category Id

        const empExist = await Employee.findById(empId)
        if(!empExist){
           return res.status(400).json({message:'Invalid Employee Id'});
        }

        //fetch template

            const taskReport= await TaskReports.find({Employee:empId}).populate({
                path: 'Employee',
                select: 'Employee_id' // Only include the Admin_id field from the referenced document
            });
            res.status(200).json(taskReport)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})

module.exports = router;