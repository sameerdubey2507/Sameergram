const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({ email })
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(201).json({
        message: "User registered successfully",
        user: { _id: user._id, email: user.email, fullName: user.fullName }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message: "User logged in successfully",
        user: { _id: user._id, email: user.email, fullName: user.fullName }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
    const { name, email, password, phone, address, contactName } = req.body;
    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email })
    if (isAccountAlreadyExists) {
        return res.status(400).json({ message: "Food partner account already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
        name, email, password: hashedPassword, phone, address, contactName
    })
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
        }
    })
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email })
    if (!foodPartner) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Food partner logged out successfully" });
}

async function googleLogin(req, res) {
    const { token, role } = req.body; // role can be 'user' or 'foodPartner'
    console.log(`Google Login attempt started for role: ${role || 'user'}...`);
    try {
        console.log("Verifying token with Client ID:", process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        console.log("Token verified for:", email);

        let account;
        const model = role === 'foodPartner' ? foodPartnerModel : userModel;

        account = await model.findOne({ email });

        if (!account) {
            console.log(`New ${role || 'user'} detected, creating account...`);
            const accountData = {
                email,
                password: await bcrypt.hash(Math.random().toString(36), 10)
            };
            if (role === 'foodPartner') {
                accountData.name = name;
                accountData.contactName = name;
            } else {
                accountData.fullName = name;
            }
            account = await model.create(accountData);
        }

        const jwtToken = jwt.sign({ id: account._id }, process.env.JWT_SECRET);
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        console.log("Login successful, cookie set.");
        
        const responseData = {
            message: "Google login successful",
        };
        if (role === 'foodPartner') {
            responseData.foodPartner = { _id: account._id, email: account.email, name: account.name };
        } else {
            responseData.user = { _id: account._id, email: account.email, fullName: account.fullName };
        }
        
        res.status(200).json(responseData);
    } catch (error) {
        console.error("DETAILED GOOGLE ERROR:", error.message);
        res.status(400).json({ message: "Google login failed", error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleLogin,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}