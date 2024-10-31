import {Request, Response} from 'express'
import {v4 as uuidv4} from 'uuid'

import { AppDataSource } from '../data-source'
import { User } from '../entity'

const UserRepository = AppDataSource.getRepository(User)

async function getAllUsers(req: Request, res: Response) {
    const allUsers = await UserRepository.find({})

    res.status(200).json({
        message: "All users retrieved",
        allUsers
    })
}

async function addUser(req: Request, res: Response) {
    const {name, email} = req.body

    if (!name) {
        res.status(400).json({
            message: "All users should have name provided"
        })
        return
    }
    
    if (!email) {
        res.status(400).json({
            message: "All users should have email provided"
        })
        return 
    }

    const user = new User()
    user.user_id = uuidv4()
    user.name = name
    user.email = email

    await UserRepository.save(user)

    res.status(200).json({
        message: "New user created"
    })
}

export {getAllUsers, addUser}