const Task = require('../models/Task');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError,BadRequestError } = require('../errors');


const getAllTasks = async (req, res) => {
    const tasks = await Task.find({ createdBy: req.user.userId }).sort('createdAt');
    return res.status(StatusCodes.OK).json({
        userId:req.user.userId,
        tasks
    });
}

const getSingleTask = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const task = await Task.findOne({ _id: id,createdBy:userId });
    if (!task) {
        throw new NotFoundError(`no such task with ${id}`);
    }
    return res.status(StatusCodes.OK).json(task);
}

const createSingleTask = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const task = await Task.create({
        ...req.body
    })
    return res.status(StatusCodes.CREATED).json(task);
}

const updateSingleTask = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        userId
    } = req.user;
    const {
        name,
        completed
    } = req.body;
    const task = await Task.findOne({
        _id: id,
        createdBy: userId
    });
    if (task) {
        if (name != undefined) {
            const newTask = await Task.findOneAndUpdate({
                        _id: id,
                        createdBy: userId
                    }, {
                name,
                completed
            }, {
                new: true,
                runValidators: true
            });
            return res.status(StatusCodes.OK).json({
                task: newTask
            });
        } else {
            throw new BadRequestError('missing field(s)');
        }
    } else {
        throw new NotFoundError(`no task with such ${id}`);
    }
}

const deleteSingleTask = async (req, res) => {
    const {
        id
    } = req.params;
    const task = await Task.findOneAndDelete({
        _id: id
    });
    if (!task) {
       throw new NotFoundError(`no task with such ${id}`);
    }
    return res.status(StatusCodes.OK).json({
        task
    });
}

module.exports = {
    getAllTasks,
    getSingleTask,
    createSingleTask,
    updateSingleTask,
    deleteSingleTask,
}