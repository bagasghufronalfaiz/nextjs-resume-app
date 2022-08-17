import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-amber-400">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-start">
                        <Link href="/">
                            <a className="text-2xl font-bold text-white no-underline">
                                Resume <span className="italic">App</span>
                            </a>
                        </Link>
                    </div>
                    <div className="flex-2 flex items-end justify-end">
                        <Link href="/profile">
                            <a className="bg-gray-800 cursor-pointer flex text-sm rounded-full hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
