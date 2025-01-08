import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { Topic, ITopic } from '../models/Topic'
import { validateToken, validateAdmin } from '../middleware/validateToken'
import { loginValidation, registerValidation } from '../validators/inputValidation'


const router : Router = Router();


router.post("/api/user/register", registerValidation,async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
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
    loginValidation,
    async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }    
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
        const jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
        }
        const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2h"})


        res.status(200).json({success: true, token});
        return;
    } catch (error: any) {
        res.status(500).send("Error: " + error);
    }
});



router.get("/api/topics",  async (req: Request, res: Response) => {
    
    res.send(await Topic.find());
    
});

router.post("/api/topic", validateToken, async (req: Request, res: Response) => {
    /*
    const errors: Result<ValidationError> = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }*/
    console.log("jauu")
    try {
        const token: string | undefined = req.header('Authorization')?.split(' ')[1]
        if (!token) {
            res.status(401).json({ message: "Access denied" });
            return 
        }

        //dumb
        const decoded = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
        const username = decoded.username;

        const topic: ITopic = new Topic({
            title: req.body.title,
            content: req.body.content,
            username: username,
            date: new Date()
        });
        await topic.save();
        res.status(200).send({topic});
    } catch (error: any) {
        res.status(500).send("Error: " + error);
    }
    
    
});

router.delete("/api/topic/:id", validateToken, validateAdmin, async (req: Request, res: Response) => {

    /*const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }*/
    try {
        console.log(req.params)
        const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
        if (!deletedTopic) {
            res.status(404).send("Topic not found.");
        }

        res.status(200).send("Topic deleted successfully.");
    }catch (error: any) {
        res.status(500).send("Error: " + error)

    }


});


export default router;