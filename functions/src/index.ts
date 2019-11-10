import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as dayjs from "dayjs";

admin.initializeApp();

const db = admin.firestore()

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const dash1 = functions.https.onRequest(async (request, response) => {
  const insertTime = Date.now();
  await db.collection("dash1").add({
    createdAt: insertTime
  });

  // 2秒待機
  await new Promise((resolve) => setTimeout(() => resolve(), 3000));

  // その後のリクエストを取得
  const resentDocs = await db.collection("dash1").orderBy("createdAt", "desc").limit(3).get();

  // もし後にリクエストがあったら特に動作なし
  const followingRequest = resentDocs.docs.filter((doc) => {
    return dayjs(doc.data().createdAt).isAfter(dayjs(insertTime))
  });

  if(followingRequest.length > 0) {
    response.send("特に動作なし");
    return;
  }

  // 前のリクエストから動作を検証する
  const previousRequests = resentDocs.docs.filter((doc) => dayjs(doc.data().createdAt).isBefore(dayjs(insertTime).subtract(3, "second")));

  // リクエストがなかったら
  response.send(previousRequests.length.toString());
});

