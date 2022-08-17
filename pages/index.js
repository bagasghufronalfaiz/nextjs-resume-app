import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase-config";
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import Link from "next/link";

function Home() {
    const [user, setUser] = useState({});
    const [experiences, setExperiences] = useState([]);
    const [isEditName, setisEditName] = useState(false);
    const [nameState, setnameState] = useState("");
    const titleInput = useRef(null);
    const [isEditAge, setisEditAge] = useState(false);
    const [ageState, setAgeState] = useState("");
    const ageInput = useRef(null);
    const storage = getStorage();

    const usersCollectionRef = collection(db, "users");
    const experiencesCollectionRef = collection(db, "experiences");

    useEffect(() => {
        const getData = async () => {
            const experiencesData = await getDocs(experiencesCollectionRef);
            const usersData = await getDocs(usersCollectionRef);
            const oneUser = usersData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setUser(oneUser[0]);
            setExperiences(
                experiencesData.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
            );
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnBlurName = () => {
        setisEditName(!isEditName);
        if (nameState !== "") {
            const userDoc = doc(db, "users", user.id);
            const data = { name: nameState };
            updateDoc(userDoc, data);
            const newUser = {
                ...user,
                name: nameState,
            };

            setUser(newUser);
        }
    };

    const handleOnBlurAge = () => {
        setisEditAge(false);
        if (ageState !== "") {
            const userDoc = doc(db, "users", user.id);
            const data = { age: ageState };
            updateDoc(userDoc, data);
            const newUser = {
                ...user,
                age: ageState,
            };

            setUser(newUser);
        }
    };

    const handleEditName = () => {
        setisEditName(!isEditName);
        if (nameState === "") {
            return null;
        } else {
            if (isEditName) {
                const userDoc = doc(db, "users", user.id);

                const data = {
                    name: nameState,
                };

                updateDoc(userDoc, data);
                const newUser = {
                    ...user,
                    name: nameState,
                };
                setUser(newUser);
            } else {
                setTimeout(() => {
                    titleInput?.current?.focus();
                }, 100);
            }
        }
    };

    const handleEditAge = () => {
        setisEditAge(!isEditAge);
        if (ageState === "") {
            return null;
        } else {
            if (isEditAge) {
                const userDoc = doc(db, "users", user.id);

                const data = {
                    age: ageState,
                };

                updateDoc(userDoc, data);
                const newUser = {
                    ...user,
                    age: ageState,
                };

                setUser(newUser);
            } else {
                setTimeout(() => {
                    ageInput?.current?.focus();
                }, 100);
            }
        }
    };

    const deleteExperience = (id,name) => {
        const experiencesCollectionRef = doc(db, "experiences", id);
        deleteDoc(experiencesCollectionRef);
        const imageRef = ref(storage, "logo/"+name);
        deleteObject(imageRef);
        const result = experiences.filter((experience) => {
            return experience.id !== id;
        });

        setExperiences(result);
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
                    <div className="flex justify-center gap-6">
                        <div>
                            <img
                                className="h-52 w-52 rounded-full border-8 border-gray-600 drop-shadow-2xl cursor-pointer hover:scale-105 transition-all"
                                src={user.picture}
                            />
                            <Link href="/profile/update-profile-picture">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 self-center ml-auto text-blue-500 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div className="self-center text-center">
                            <div className="flex justify-center">
                                {isEditName ? (
                                    <input
                                        className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        onBlur={handleOnBlurName}
                                        onChange={(e) =>
                                            setnameState(e.target.value)
                                        }
                                        defaultValue={user.name}
                                        required
                                    />
                                ) : (
                                    <p
                                        className="text-5xl font-bold mb-3"
                                        onClick={handleEditName}
                                    >
                                        {user.name}
                                    </p>
                                )}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 self-center ml-2 text-blue-500 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    onClick={handleEditName}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-center">
                                {isEditAge ? (
                                    <input
                                        className="shadow appearance-none bg-gray-600 border-2 border-gray-500 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                        type="number"
                                        onBlur={handleOnBlurAge}
                                        onChange={(e) =>
                                            setAgeState(e.target.value)
                                        }
                                        defaultValue={user.age}
                                        required
                                    />
                                ) : (
                                    <p
                                        className="text-lg font-semibold"
                                        onClick={handleEditAge}
                                    >
                                        {user.age}
                                    </p>
                                )}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 self-center ml-2 text-blue-500 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    onClick={handleEditAge}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <div>
                            <p className=" text-lg border-b-4 border-blue-500 font-semibold">
                                Experience
                            </p>
                        </div>
                        <div>
                            <Link href="/experience/add">
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    New Experience
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 mt-6">
                        {experiences.map((experience) => (
                            <div
                                key={experience.id}
                                className="p-6 flex gap-6 bg-gray-700 rounded-xl border-2 border-gray-600 hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                <div className="self- min-w-fit">
                                    {experience.company_logo_url ? (
                                        <img
                                            className="h-28 w-28 rounded-full border-4 border-blue-500"
                                            src={experience.company_logo_url}
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            className="h-28 w-28 rounded-full border-4 border-blue-500"
                                            src="/vercel.svg"
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="w-full">
                                    <p className="text-xl font-bold ">
                                        {experience.company}
                                    </p>
                                    <p className="text-xl font-medium">
                                        {experience.position}
                                    </p>
                                    <p className="text-md text-gray-400">
                                        {experience.start_date} -{" "}
                                        {experience.end_date}
                                    </p>
                                    <p className="text-md">
                                        {experience.description}
                                    </p>
                                    <div className="flex justify-end">
                                        <Link
                                            href={`experience/edit/${experience.id}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 mr-4 cursor-pointer "
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </Link>
                                        <div
                                            onClick={() =>
                                                deleteExperience(experience.id, experience.company_logo_name)
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 cursor-pointer"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

// export  function getStaticProps() {
//     const experiencesCollectionRef = collection(db, "experiences");
//     const usersCollectionRef = collection(db, "users");
//     const experiencesData =  getDocs(experiencesCollectionRef);
//     const usersData =  getDocs(usersCollectionRef);
//     // const oneUser = usersData.docs.map((doc) => ({
//     //     ...doc.data(),
//     //     id: doc.id,
//     // }));

//     return {
//         props: {
//             experiences: experiencesData.docs,
//             // experiences: experiencesData.docs.map((doc) => ({
//             //     ...doc.data(),
//             //     id: doc.id,
//             // })),
//             user: usersData.docs,
//         },
//     };
// }

export default Home;
