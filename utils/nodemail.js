require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

const port = process.env.email_port;
const host = process.env.email_host;
const user = process.env.email_user;
const pass = process.env.email_pass;

console.log("port", port);
console.log("host", host);

const transporter = nodemailer.createTransport({
  port: port,
  host: host,
  auth: {
    user: user,
    pass: pass,
  },
  secure: true,
});

export default transporter;
