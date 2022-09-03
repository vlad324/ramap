import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";

const admin = firebaseAdmin.initializeApp();

export const handleWebhook = functions.https.onRequest(async (request, response) => {
  const paymentId = request.path.substring(1);
  if (request.method !== "POST" || !paymentId) {
    response.sendStatus(400);
  }

  functions.logger.info(request.body, { structuredData: true });

  const { type, purchase } = request.body;
  const { id, purchaseViewToken } = purchase;
  await admin.firestore()
    .collection("payments")
    .doc(paymentId)
    .set({
      type,
      id,
      purchaseViewToken,
    });

  response.send();
});


export const getPaymentStatus = functions.https.onRequest(async (request, response) => {
  const paymentId = request.path.substring(1);
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method !== "GET" || !paymentId) {
    response.sendStatus(400);
  }

  const payment = await admin.firestore()
    .collection("payments")
    .doc(paymentId)
    .get();

  if (!payment) {
    response.json({
      "status": "UNKNOWN",
      "id": payment
    });
  } else {
    response.json({
      "status": payment.data()?.type || "UNKNOWN",
      "id": payment
    });
  }
});
