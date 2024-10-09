import type { Analytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { Auth, Unsubscribe } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebasePerformance } from "firebase/performance";
import type { FirebaseStorage } from "firebase/storage";

let resolve: any;
let firebaseInstance: FirebaseApp;
let analyticsInstance: Analytics;
let performanceInstance: FirebasePerformance;
let authInstance: Auth;
let firestoreInstance: Firestore;
let storageInstance: FirebaseStorage;
let authListener: Unsubscribe;
const firestoreListeners: { [key: string]: Unsubscribe } = {};

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const promise = new Promise((res) => (resolve = res));

export async function initialize() {
    if (import.meta?.env?.SSR) return undefined;

    if (firebaseInstance) return firebaseInstance;

    firebaseInstance = initializeApp(firebaseConfig);
    analyticsInstance = await getAnalytics();
    performanceInstance = await getPerformance();
    resolve(firebaseInstance);

    return firebaseInstance;
}

export async function getInstance() {
    if (import.meta?.env?.SSR) return undefined;

    if (firebaseInstance) return firebaseInstance;
    await initialize();

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

export async function getStorage() {
    if (storageInstance) return storageInstance;

    const { getStorage } = await import("firebase/storage");
    await getInstance();
    storageInstance = getStorage();
    return storageInstance;
}

export async function uploadArtwork(image: File, artworkTitle: string) {
    const { ref, uploadBytes } = await import("firebase/storage");

    const curFormattedTime = (new Date()).toISOString()
    const curStorage = await getStorage();
    const storageRef = ref(curStorage, `artworks/${artworkTitle}_${curFormattedTime}`);
    return uploadBytes(storageRef, image);
}

export async function batchUploadArtwork(images: File[], artworkTitle: string) {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const curStorage = await getStorage();

    const uploadPromisesArr = images.map((file) => {
        const curFormattedTime = (new Date()).toISOString()
        const storageRef = ref(curStorage, `artworks/${artworkTitle}_${curFormattedTime}`);
        return uploadBytes(storageRef, file).then(res => {
            return getDownloadURL(res.ref)
        })
    });

    return Promise.all(uploadPromisesArr);
}

export const attachDocListener = async (path: string, cb: any) => {
    const { doc, onSnapshot } = await import("firebase/firestore");

    const curFirestore = await getFirestore();
    const docRef = await doc(curFirestore, path);
    return onSnapshot(docRef, cb);
};

export async function attachAuthListener() {
    if (authListener) return authListener;

    const curAuth = await getAuth();
    const { onIdTokenChanged } = await import("firebase/auth");
    authListener = onIdTokenChanged(curAuth, async (user) => {
        console.log("auth state listener:", user);
        if (user) {
            const { uid, email, phoneNumber } = user;

            const token = await user.getIdTokenResult();
            console.log("user signed in:", uid, token?.claims);

            await attachDocListener(
                `users/${uid}`,
                (doc) => {
                    const userData = doc.data();
                    console.log("fetched user doc:", userData);

                    const image = userData.image as string;
                    const displayName = userData.displayName as string;
                    const accountCreated = userData.accountCreated as number;

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
                },
            );
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
    getPerformance,
};
export default iam;
