"use strict";
let __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// configures dotenv to work in your application
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
});
// const headers = {
//     headers: {
//     'Authorization': `Bearer ${process.env.VEX_API}`
//     }
// };
// async function getEventId() {
//     const request = new Request('https://www.robotevents.com/api/v2/events?sku[]=RE-VRC-22-7740', headers)
//     const response = await fetch(request);
//     const data = await response.json();
//     return data.data[0].id
// }
