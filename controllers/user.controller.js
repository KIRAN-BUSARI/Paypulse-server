import zod from 'zod'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import { Account } from '../models/account.models.js';

const signup = async (req, res) => {

    const signupSchema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8),
        firstName: zod.string(),
        lastName: zod.string(),
    });

    const { email, password, firstName, lastName } = req.body;
    console.log(email, password, firstName, lastName);
    const signupValidation = signupSchema.safeParse(req.body)

    if (!signupValidation.success) {
        return res.status(411).send('Invalid Inputs')
    }

    const userExists = await User.findOne({
        email
    })

    if (userExists) {
        return res.status(411).send("User already exists")
    }

    const user = await User.create({
        email,
        password,
        firstName,
        lastName
    })

    console.log(user);
    if (!user) {
        return res.status(500).send("Server Error")
    }
    // user.save();

    const userId = user._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET)

    console.log(token);
    return res.status(200).json({
        success: true,
        user,
        message: "User created successfully",
        token: token
    })
}

const signin = async (req, res) => {

    const signinSchema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    });

    const { email, password } = req.body

    const signinValidation = signinSchema.safeParse(req.body)

    if (!signinValidation.success) {
        return res.status(411).send("Invalid details")
    }

    const userExists = await User.findOne({
        email
    })

    if (!userExists) {
        return res.status(401).send("User Doesn't Exist")
    }

    const isPasswordValid = await userExists.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).send("Password is incorrect")
    }

    const token = jwt.sign({
        userId: userExists._id
    }, process.env.JWT_SECRET)

    userExists.save();

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: token
    })
    return
}

const updateDetails = async (req, res) => {

    const updateSchema = zod.object({
        password: zod.string().optional(),
        firstName: zod.string().optional(),
        lastName: zod.string().optional()
    });

    const { success } = updateSchema.safeParse(req.body)
    // console.log(success);

    if (!success) {
        return res.status(411).send("Invalid details")
    }

    // const val = updateSchema.safeParse(req.body);
    // // console.log(val.success, val.data);
    // console.log(val);

    // if (!val.success) {
    //     return res.status(400).send("Invalid details")
    // }

    await User.updateOne({
        userId: req._id
    }, req.body)


    res.status(200).json({
        message: "Updated successfully"
    });
}

const getUserDetails = async (req, res) => {
    const filter = req.query.filter || ""

    const userDetails = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": 'i'
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": 'i'
            }
        }]
    })

    res.status(200).json({
        success: true,
        message: "Fetched user details",
        user: userDetails.map((data) => ({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            _id: data._id
        }))
    })
    console.log("User Details:", userDetails);

}

const currentUser = async (req, res) => {

    const user = await User.findById(req.userId)
    res.status(200).json({
        success: true,
        message: "Fetched user details",
        user
    })
}

export {
    signup,
    signin,
    updateDetails,
    getUserDetails,
    currentUser
}