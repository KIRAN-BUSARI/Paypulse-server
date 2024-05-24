import { Account } from "../models/account.models.js"
import mongoose from 'mongoose'

const getBalance = async (req, res) => {
    // const { userId } = req.body;
    // console.log(req.userId);
    const account = await Account.findOne({
        userId: req.userId
    })

    res.status(200).json({
        success: true,
        message: "Account Fetched successfully",
        balance: account.balance
    })
    // console.log("Account ", account);
}


const transfer = async (req, res) => {
    const session = await mongoose.startSession()

    session.startTransaction()
    const { amount, to } = req.body

    // console.log(req.userId);
    const fromAccount = await Account.findOne({
        userId: req.userId
    }).session(session);

    if (!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne(
        {
            userId: to
        }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc:
        {
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({
        userId: to
    }, {
        $inc:
        {
            balance: amount
        }
    }).session(session);

    await session.commitTransaction();
    res.json({
        success: true,
        message: "Transfer successful",
        amount: amount,
        balance: fromAccount.balance,
        toBalance: toAccount.balance
    });
}

export {
    getBalance,
    transfer
}