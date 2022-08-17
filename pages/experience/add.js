import Head from "next/head";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import React, { useState } from "react";

const Add = () => {
    const experiencesCollectionRef = collection(db, "experiences");
    const [progresspercent, setProgresspercent] = useState(0);
    const storage = getStorage();

    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();
        const date = new Date();
        const file = event.target.company_logo.files[0];

        const data = {
            company: event.target.company.value,
            position: event.target.position.value,
            start_date: event.target.start_date.value,
            end_date: event.target.end_date.value,
            description: event.target.description.value,
            created_at: Date.now(),
        };

        const storageRef = ref(storage, `logo/${date.toISOString()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

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
                    const newData = {
                        ...data,
                        company_logo_url: downloadURL,
                        company_logo_name: storageRef.name,
                    };
                    addDoc(experiencesCollectionRef, newData);
                });
            }
        );

        router.push("/");
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
                            Add New Experience
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="company"
                                >
                                    Company
                                </label>
                                <input
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="company"
                                    name="company"
                                    type="text"
                                    placeholder="Company"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="company_logo"
                                >
                                    Company Logo
                                </label>
                                <input
                                    id="company_logo"
                                    name="company_logo"
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    accept="image/png, image/jpeg"
                                    type="file"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="position"
                                >
                                    Position
                                </label>
                                <input
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="position"
                                    name="position"
                                    type="text"
                                    placeholder="Position"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="start_date"
                                >
                                    Start Date
                                </label>
                                <input
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="end_date"
                                >
                                    End Date
                                </label>
                                <input
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <label
                                    className="block text-white text-sm font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                    name="description"
                                    id="description"
                                    rows="4"
                                    placeholder="Description"
                                    required
                                ></textarea>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    Add New
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Add;
