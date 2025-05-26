import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const funnyMessages = [
        "Oops! Looks like this page took a vacation. Maybe you should too?",
        "404: Page not found. Are you sure you typed that right, or did a cat walk on your keyboard?",
        "This is not the page you are looking for... *waves hand Jedi-style*",
        "Error 404: Our AI couldn't find this page. It's probably off optimizing its own tasks.",
        "Houston, we have a 404. This page seems to be lost in cyberspace.",
        "Well, this is awkward. We can't find the page. Maybe it's hiding?",
        "404! The page is a lie. Just like the cake. (Mostly).",
        "Looks like this URL went on an adventure without leaving a map."
    ];
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
            <h1 className="text-9xl font-extrabold text-sky-400 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-200 mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
                {randomMessage}
            </p>
            <img
                src="/vite.svg"
                alt="Confused Mascot"
                className="w-32 h-32 mb-8 opacity-50"
            />
            <Link
                to="/"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors duration-150"
            >
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
