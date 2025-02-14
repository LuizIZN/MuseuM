const { validationResult } = require("express-validator");
import { Request, Response, NextFunction } from "express";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: object[] = [];

    errors.array().map((err: { msg: string }) => extractedErrors.push({ msg: err.msg }));

    res.status(422).json({
        errors: extractedErrors,
    });
};

export default validate;
