import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    query,
    where,
    DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

// Generic helper to get all documents from a collection
export async function getCollection(collectionName: string) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: any[] = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    return data;
}

// Generic helper to get a document by ID
export async function getDocument(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}

// Helper to add a document
export async function addDocument(collectionName: string, data: any) {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
}

// Helper to update a document
export async function updateDocument(collectionName: string, id: string, data: any) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
}
