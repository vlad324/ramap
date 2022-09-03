import * as functions from "firebase-functions";

export const handleWebhook = functions.https.onRequest((request, response) => {
  const id = request.path.substring(1);
  if (!id) {
    response.sendStatus(400);
  }

  functions.logger.info("id: " + id);
  functions.logger.info(request.body, { structuredData: true });

  response.send();
});
