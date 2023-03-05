const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gemmatiru@gmail.com",
    pass: "wvlolbeswiifrmkr",
  },
});

exports.sendEmailOnStatusChangeToInProgress = functions.firestore
    .document("tickets/{ticketId}")
    .onUpdate(async (change, context) => {
      const ticketId = context.params.ticketId;
      const before = change.before.data();
      const after = change.after.data();

      if (before.status !== "In progress" && after.status === "In progress") {
        const ticketDoc = await db.collection("tickets").doc(ticketId).get();
        const ticket = ticketDoc.data();
        const toEmail = ticket.customer;
        const mailOptions = {
          from: "gemmatiru@gmail.com",
          to: toEmail,
          subject: "Your ticket is now in progress",
          text: `your ticket (${ticketId}) is now in progress.`,
        };

        await transporter.sendMail(mailOptions);
      }
    });
exports.sendEmailOnStatusChangeToClose = functions.firestore
    .document("tickets/{ticketId}")
    .onUpdate(async (change, context) => {
      const ticketId = context.params.ticketId;
      const before = change.before.data();
      const after = change.after.data();

      if (before.status !== "closed" && after.status === "closed") {
        const ticketDoc = await db.collection("tickets").doc(ticketId).get();
        const ticket = ticketDoc.data();
        const toEmail = ticket.customer;
        const mailOptions = {
          from: "gemmatiru@gmail.com",
          to: toEmail,
          subject: "Your ticket is now closed",
          text: `Your ticket (${ticketId}) is now closed.`,
        };
        await transporter.sendMail(mailOptions);
      }
    });
