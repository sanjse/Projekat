import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as session from 'express-session'
import { Routes } from "./routes";
import * as cors from 'cors'
import * as https from 'https'
import * as fs from 'fs'
import * as multer from 'multer';
import * as path from 'path';
import ProductController from "./controller/ProductController";
import { User } from "./entity/User";

const upload = multer({ dest: path.resolve('img/') })

createConnection().then(async connection => {
    /* console.log("Inserting a new user into the database...");
     const user = new User();
     user.firstName = "admin";
     user.lastName = "admin";
     user.category = "admin";
     user.username = "admin";
     user.password = "admin";
     await connection.manager.save(user);
     console.log("Saved a new user with id: " + user.id);
 
     console.log("Loading users from the database...");
     const users = await connection.manager.find(User);
     console.log("Loaded users: ", users);*/
    const key = fs.readFileSync('./key.pem', 'utf8');
    const cert = fs.readFileSync('./cert.pem', 'utf8');
    // create express app
    const app = express();
    app.use(cors({
        credentials: true,//protiv xss napada

        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        origin: 'http://localhost:3000'

    }));
    app.use(express.json({
        limit: '5mb'
    }));
    app.use(session({
        secret: 'adsfgdhtydafsjtiuyi',
        resave: false,

        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 10,//10min
            httpOnly: true,
        }

    }))

    // register express routes from defined application routes
    app.post('/product', upload.single('file'), ProductController.create);



    Routes.forEach(route => {
        app[route.method](route.route, route.controller[route.action]);
    });

    // setup express app here
    // ...

    // start express server

    const server = https.createServer({
        key: key,
        cert: cert,
    }, app)
    server.listen(process.env.PORT || 4000, () => console.log('app is listening'))




}).catch(error => console.log(error));
