import { Router, Request, Response } from 'express';
import {User, IUser} from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const router : Router = Router();


router.post("/api/user/register", async (req: Request, res: Response) => {

    try {

        const user: IUser = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            isAdmin: req.body.isAdmin  
        });

        const salt: string = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.send(user);



    } catch (error: any) {
        if (error.code === 11000) {
            res.status(403).send("User already registered.");
        }else {
            res.status(500).send("Error: " + error);
        }
        
    }

});


export default router;