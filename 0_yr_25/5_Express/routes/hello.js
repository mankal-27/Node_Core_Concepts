// hello route

import { Router } from "express";
import { hello } from "../lib/locale.js";
import { capitalize } from "../lib/string.js";

export const helloRouter = Router();

//Say Hello in English
helloRouter.get('/:name', (req,res, next) => {
    
    res.render(
        'message',
        {title: `${hello.en } ${capitalize(req.params.name)}!`}
    );
});

//Say Hello in Specific Langugage

helloRouter.get('/:lang/:name', (req, res, next) => {
    res.render(
        'message',
        {title: `${hello[req.params.lang]} ${capitalize(req.params.name)}!`}
    );
});