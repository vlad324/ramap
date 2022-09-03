import * as functions from "firebase-functions";

export const handleWebhook = functions.https.onRequest((request, response) => {
  const id = request.path.substring(1);
  if (request.method !== 'POST' || !id) {
    response.sendStatus(400);
  }

  functions.logger.info("id: " + id);
  functions.logger.info(request.body, { structuredData: true });

  response.send();
});


export const getPaymentStatus = functions.https.onRequest((request, response) => {
  const id = request.path.substring(1);
  if (request.method !== 'GET' || !id) {
    response.sendStatus(400);
  }

  functions.logger.info("id: " + id);

  response.set("Access-Control-Allow-Origin", "*");
  response.json({
    "status": "OK",
    "id": id
  });
});
