import type { Analytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { Auth, Unsubscribe } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";
import type { FirebasePerformance } from "firebase/performance";
import type { FirebaseStorage } from "firebase/storage";

let resolve: any,
    firebaseInstance: FirebaseApp,
    analyticsInstance: Analytics,
    performanceInstance: FirebasePerformance,
    authInstance: Auth,
    firestoreInstance: Firestore,
    functionsInstance: Functions,
    storageInstance: FirebaseStorage,
    firestoreListeners: { [key: string]: Unsubscribe } = {},
    authListener: Unsubscribe

const firebaseConfig = {
    apiKey: "AIzaSyDcEQBM5_2uiUfykgQAJUASMxyE2eaO2SA",
    authDomain: "malva-pet-shop-demo.firebaseapp.com",
    projectId: "malva-pet-shop-demo",
    storageBucket: "malva-pet-shop-demo.appspot.com",
    messagingSenderId: "579600293080",
    appId: "1:579600293080:web:9c0c0f3831e2a5c88ecbad",
    measurementId: "G-XDN3ECC5P3"
};

const promise = new Promise((res) => (resolve = res));

export async function initialize() {
    // if (import.meta?.env?.SSR) return undefined;

    if (firebaseInstance) return firebaseInstance;

    firebaseInstance = initializeApp(firebaseConfig);
    analyticsInstance = await getAnalytics();
    performanceInstance = await getPerformance();
    resolve(firebaseInstance);

    return firebaseInstance;
}

export async function getInstance() {
    // if (import.meta?.env?.SSR) return undefined;

    if (firebaseInstance) return firebaseInstance;
    else await initialize();

    return promise;
}

export async function getAnalytics() {
    if (analyticsInstance) return analyticsInstance;

    const { getAnalytics } = await import("firebase/analytics");
    await getInstance();
    analyticsInstance = getAnalytics(firebaseInstance);
    return analyticsInstance;
}

export async function getPerformance() {
    if (performanceInstance) return performanceInstance;

    const { getPerformance } = await import("firebase/performance");
    await getInstance();
    performanceInstance = getPerformance(firebaseInstance);
    return performanceInstance;
}

export async function getAuth() {
    if (authInstance) return authInstance;

    const { getAuth } = await import("firebase/auth");
    await getInstance();
    authInstance = getAuth();
    return authInstance;
}

export async function getFirestore() {
    if (firestoreInstance) return firestoreInstance;

    const { getFirestore } = await import("firebase/firestore");
    await getInstance();
    firestoreInstance = getFirestore();
    return firestoreInstance;
}

export const attachDocListener = async (path: string, cb: any) => {
    const { doc, onSnapshot } = await import("firebase/firestore");

    let curFirestore = await getFirestore();
    const docRef = await doc(curFirestore, path);
    return onSnapshot(docRef, cb)
};

export async function attachAuthListener() {
    if (authListener) return authListener;

    let curAuth = await getAuth();
    const { onAuthStateChanged } = await import("firebase/auth");
    authListener = onAuthStateChanged(curAuth, async (user) => {
        console.log("auth state listener:", user);
        if (user) {
            const { uid, email, phoneNumber } = user;

            let token = await user.getIdTokenResult()
            console.log("user signed in:", uid, token?.claims)

            const liveUserSnapshot = await attachDocListener(`users/${uid}`, doc => {
                const userData = doc.data()
                console.log('fetched user doc:', userData)

                const image = userData.image as string
                const displayName = userData.displayName as string
                const accountCreated = userData.accountCreated as number

                // var type
                // if (machine.getSnapshot().matches("loggedOut")) {
                //     type = "LOG_IN"
                // } else {
                //     type = "UPDATE_USER"
                // }

                // machine.send({
                //     type,
                //     userDetails: {
                //         uid: stripeCustomerID,
                //         email,
                //         displayName,
                //         phoneNumber,
                //         image,
                //         accountCreated,
                //     },
                // });
            })


        } else {
            console.log("user not signed in...");
            // machine.send({
            //     type: "LOG_OUT",
            // });
        }
    });
    return authListener;
}

const iam = {
    initialize,
    getInstance,
    getAuth,
    getAnalytics,
    getPerformance
};
export default iam;