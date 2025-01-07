import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { validateToken } from '../middleware/validateToken'


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


router.post("/api/user/login",
    body("username").trim().escape(),
    body("password").escape(),
    async (req: Request, res: Response) => {
    

    try {
        const user: IUser | null = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send("Email not found");
            return;
        }

        const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(401).send("Invalid password");
            return;
        }

        const token: string = jwt.sign(
            { _id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({token});
        return;
    } catch (error: any) {
        res.status(500).send("Error: " + error);
    }
});



router.get("/api/user/profile", validateToken, async (req: Request, res: Response) => {
    res.send(req.body);
});


export default router;