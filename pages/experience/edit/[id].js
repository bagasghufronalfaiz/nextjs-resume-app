import Head from "next/head";
import { db } from "../../../firebase-config";
import {
    doc,
    collection,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";

const EditExperience = (props) => {
    const router = useRouter();

    const handleSubmit = async (event) => {
        const experiencesCollectionRef = doc(
            db,
            "experiences",
            props.experience.id
        );

        event.preventDefault();

        const data = {
            company: event.target.company.value,
            position: event.target.position.value,
            start_date: event.target.start_date.value,
            end_date: event.target.end_date.value,
            description: event.target.description.value,
        };

        await updateDoc(experiencesCollectionRef, data);

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
                                    defaultValue={props.experience.company}
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
                                    defaultValue={props.experience.position}
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
                                    defaultValue={props.experience.start_date}
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
                                    defaultValue={props.experience.end_date}
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
                                    defaultValue={props.experience.description}
                                ></textarea>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export async function getStaticProps(context) {
    const experiencesCollectionRef = doc(db, "experiences", context.params.id);
    const experience = await getDoc(experiencesCollectionRef);

    return {
        props: {
            experience: {
                id: context.params.id,
                ...experience.data(),
            },
        },
        revalidate: 600,
    };
}

export async function getStaticPaths() {
    const experiencesCollectionRef = collection(db, "experiences");
    const experiences = await getDocs(experiencesCollectionRef);

    return {
        paths: experiences.docs.map((doc) => ({ params: { id: doc.id } })),
        fallback: true,
    };
}

export default EditExperience;