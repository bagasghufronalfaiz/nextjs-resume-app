import React, { useState, useEffect } from "react";
import Head from "next/head";
import { db } from "../../firebase-config";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";

const ProfileEdit = () => {
    const [user, setUser] = useState({});
    const usersCollectionRef = collection(db, "users");
    const [progresspercent, setProgresspercent] = useState(0);
    const storage = getStorage();
    const imageRef = ref(storage, "picture/" + user.picture_name);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const usersData = await getDocs(usersCollectionRef);
            const oneUser = usersData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setUser(oneUser[0]);
        };

        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target[0]?.files[0];
        if (!file) return;
        const storageRef = ref(storage, `picture/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        deleteObject(imageRef);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const userDoc = doc(db, "users", user.id);
                    const data = {
                        picture: downloadURL,
                        picture_name: file.name,
                    };
                    updateDoc(userDoc, data).then(() => {
                        setUser({
                            ...user,
                            picture: downloadURL,
                            picture_name: file.name,
                        });
                        router.push("/");
                    });
                });
            }
        );
    };

    return (
        <>
            <Head>
                <title>Bagas Ghufron Alfaiz - Resume App</title>
                <meta
                    name="description"
                    content="Bagas Ghufron Alfaiz Resume"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="max-w-7xl mx-auto my-10 px-2 sm:px-6 lg:px-8">
                <div className="flex flex-col text-white shadow-xl rounded-3xl bg-gray-800 p-6">
                    <div className="flex">
                        <p className=" text-lg border-b-4 border-blue-500 font-semibold">
                            Update Profile Picture
                        </p>
                    </div>
                    <div className="my-6">
                        <div className="flex justify-center gap-6">
                            <div>
                                <img
                                    className="h-52 w-52 rounded-full border-8 border-gray-600 drop-shadow-2xl cursor-pointer hover:scale-105 transition-all"
                                    src={user.picture}
                                />
                            </div>
                            <div className="self-center text-center">
                                <div className="flex justify-center">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-6">
                                            <label
                                                className="block text-white text-sm font-bold mb-2"
                                                htmlFor="profile"
                                            >
                                                Profile Picture
                                            </label>
                                            <input
                                                className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                                accept="image/png, image/jpeg"
                                                type="file"
                                            />
                                        </div>
                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProfileEdit;
