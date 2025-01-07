import {body} from 'express-validator';

export const registerValidation = [
    body('email').isEmail().trim().escape(),
    body('username').trim().escape().isLength({min: 3}),
    body('password')
        .trim()
        .escape()
        .isLength({min: 8})
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[#?!&]/)
        

]


export const loginValidation = [
    body('email').isEmail().trim().escape(),
    body('password').trim().escape().isLength({min: 8})
]