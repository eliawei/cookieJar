import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "db_url_comes_here"
});
const db = admin.firestore();

interface ActionResponse {
  status: 'success' | 'error';
  result?: string;
}

type IotActionMap = {
  [key: string]: ((machineId: string, params: any) => Promise<ActionResponse>)
};

function errorMessage(msg: string): ActionResponse {
  return { status: 'error', result: msg };
}

function successMessage(msg?: string): ActionResponse {
  return msg ? { status: 'success', result: msg } : { status: 'success' };
}

type GetActionParams = { actionType: 'get', helixIndex: string };
async function getAction(machineId: string, actionParams: GetActionParams): Promise<ActionResponse> {
  // TODO: user restrictions (too many calories)
  const machineRef = db.collection('machines').doc(machineId);
  const machineDoc = await machineRef.get();

  if (!machineDoc.exists) {
    return errorMessage('machine not found');
  }

  const machineData = machineDoc.data();
  if (!machineData) {
    return errorMessage('could not call machine.data');
  }

  const helixIndex = actionParams.helixIndex;

  if (!machineData.inventory[helixIndex]) {
    return errorMessage('helixId invalid');
  }
  
  if (!machineData.inventory[helixIndex].length) {
    return errorMessage('helix is empty');
  }

  // all is fine, do the action

  const helix = machineData.inventory[helixIndex];
  await machineRef.set({
    inventory: {
      [helixIndex]: helix.slice(1)
    },
    properties: {
      desired: {
        $version: admin.firestore.FieldValue.increment(1),
        actionType: 'get',
        helixIndex: parseInt(helixIndex),
      }
    }
  }, { merge: true });

  return successMessage();

}

function getSnackImage(snackObj: any): string {
  const defaultImg = "https://image.freepik.com/free-vector/kawaii-fast-food-cookie-donut-illustration_24908-60628.jpg";

  const options = [
    Object.values<string>(snackObj?.selected_images?.display || {})[0],
    snackObj?.image_front_url,
    defaultImg
  ];
  return options.find(option => option);
}

async function addSnacktoDB(snackCollectionId: string) {
  const snacksRef = db.collection('snacks').doc(snackCollectionId);
  if (!(await snacksRef.get()).exists) {
    const snackDataOpenFoods = await getDataFromFoodsDB(snackCollectionId);

    await db.collection("snacks").doc(snackCollectionId).set(snackDataOpenFoods);
  }
  return snacksRef;
}

function findFreeHelix(machine: any, snackId: string) {
  const capacity = machine.capacity;
  const freeHelixes = Object.values<admin.firestore.DocumentReference[]>(machine.inventory).filter(helix => helix.length < capacity);
  if (!freeHelixes.length) {
    return null;
  }
  const bestHelix = freeHelixes.reduce(function (prev, current) {
    return (prev.length < current.length) ? prev : current;
  });
  console.log(freeHelixes);
  const sameHelix = freeHelixes.filter(helix => helix && helix.length && helix[helix.length - 1].id === snackId);
  return sameHelix.length ? sameHelix[0] : bestHelix;
}

function putSnackInMachine(helix: any, machineRef: any, machineData: any, snackRef: any) {
  const newHelix = [...helix, snackRef];
  machineRef.update({
    [`inventory.${Object.values(machineData.inventory).indexOf(helix)}`]: newHelix
  });
}

function sendSignalToArduino(machineRef: any, machineData: any, helixNum: number, helixData: any) {
  const cycles = (-1) * (machineData.capacity - helixData.length);

  machineRef.update({
    'properties.desired.$version': admin.firestore.FieldValue.increment(1),
    'properties.desired.actionType': 'put',
    'properties.desired.cycles': cycles,
    'properties.desired.helixIndex': helixNum
  });
}

async function getDataFromFoodsDB(barcode: string) {
  try {

    const response = await fetch('https://world.openfoodfacts.org/api/v0/product/' + barcode, {
      headers: {
        'User-Agent': 'CookieJar - Android - Version 1.0'
      }
    });
    if (!response.ok) {
      throw Error('returned error code ' + response.status);
    }
    const data = await response.json();
    const product = data?.product || {};
    return {
      name: product?.product_name || 'New Snack',
      image: getSnackImage(product),
      calories: product?.nutriments?.energy || 1
    };
  } catch (err) {
    throw Error('error connecting to food service');
  }
}

type PutActionParams = { actionType: 'put', barcode: string };
async function putAction(machineId: string, actionParams: PutActionParams) {
  /*----------------------DB update----------------------*/
  const barcode = actionParams.barcode;
  const machineRef = db.collection('machines').doc(machineId);
  const machineData = (await machineRef.get()).data();
  if (!machineData) {
    return errorMessage('machine data fetching failed');
  }
  const snackRef = await addSnacktoDB(barcode);
  const freeHelix = findFreeHelix(machineData, snackRef.id);
  if (!freeHelix) {
    return errorMessage('no free spot in machine');
  }
  putSnackInMachine(freeHelix, machineRef, machineData, snackRef);
  /*----------------------DB update----------------------*/

  /*----------------------Arduino update----------------------*/
  const helixNum = Object.values(machineData.inventory).indexOf(freeHelix);
  sendSignalToArduino(machineRef, machineData, helixNum, freeHelix);
  /*----------------------Arduino update----------------------*/

  return successMessage(`snack ${barcode} added to ${helixNum}`);
}

async function setMachineInProgress(machineRef: any) {
  await machineRef.update({
    inProgress: true
  });
}

export const iotAction = functions.https.onRequest(async (request, response) => {
  const machineId = 'o5AkuMpP2Vb2bpQvGx70';
  const actionType = request.query['actionType'];
  const actionParams = request.query;
  const machineRef = db.collection('machines').doc(machineId);
  const machineData = (await machineRef.get()).data();

  if (!machineData) {
    response.send(errorMessage('cannot get machine data!'));
    return;
  }

  if (machineData.inProgress) {
    response.send(errorMessage('can\'t finish job, another job is currently in progress'));
    return;
  }
  const actionMap: IotActionMap = {
    get: getAction,
    put: putAction
  };

  const func = actionMap[actionType];
  if (!func) {
    response.send(errorMessage(`could not find func '${actionType}'`));
  }
  await setMachineInProgress(machineRef);
  try {
    const resp = await func(machineId, actionParams);
    response.send(resp);
  } catch (err) {
    response.send(errorMessage('general error'));
  }
});


async function finishJob(machineRef: any) {
  await machineRef.update({
    inProgress: true
  });
}

export const iotFinishJob = functions.https.onRequest(async (request, response) => {
  const machineId = 'o5AkuMpP2Vb2bpQvGx70';
  const machineRef = db.collection('machines').doc(machineId);
  await finishJob(machineRef);
  response.send("finish job message sent from jar");
});

export const resetMachine = functions.https.onRequest(async (request, response) => {
  const machineId = 'o5AkuMpP2Vb2bpQvGx70';
  const machineRef = db.collection('machines').doc(machineId);
  await machineRef.update({
    inProgress: false
  });

  response.send(successMessage('machine reset successfully'));
});
