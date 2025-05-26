import React from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import khileshImage from "../assets/khilesh.jpg";
import triptiImage from "../assets/tripti.png";
import shreyanshImage from "../assets/shreyansh.png";

// Define the TeamMember interface (could also be in a shared types file)
interface TeamMember {
    id: number;
    name: string;
    role: string;
    imageUrl: string;
    linkedinUrl?: string;
}

const teamMembers: TeamMember[] = [
    { id: 1, name: 'Khilesh Katre', role: 'Team Lead + Full Stack Developer', imageUrl: khileshImage, linkedinUrl: 'https://www.linkedin.com/search/results/all/?heroEntityKey=urn%3Ali%3Afsd_profile%3AACoAADjH628BmoTC5jQtHxxbMesYQYeigrq1JOc&keywords=Khilesh%20Katre&origin=ENTITY_SEARCH_HOME_HISTORY&sid=Ok!' },
    { id: 2, name: 'Tripti', role: 'Full Stack Developer', imageUrl: triptiImage, linkedinUrl: '#' },
    { id: 3, name: 'Shriyansh Shrivastava ', role: 'Designer', imageUrl: shreyanshImage, linkedinUrl: '#' },
    { id: 4, name: 'Raj Aryan Purohit', role: 'Devops Engineer', imageUrl: shreyanshImage, linkedinUrl: '#' },
];


const HomePage: React.FC = () => {
    return (
        <div className="p-6 md:p-8 text-center animate-fadeIn">
            <h2 className="text-4xl font-bold text-sky-400 mb-6">
                Welcome to TaskNova!
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Discover a new way to align your tasks with your emotional state. Our application uses cutting-edge facial emotion analysis to understand how you're feeling and suggests tasks that best suit your current mood, aiming to enhance both your productivity and well-being.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-sky-500/30 transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold text-sky-300 mb-3">How It Works</h3>
                    <p className="text-gray-400">
                        Simply start your camera, let the application analyze your facial expression, and receive a task suggestion tailored to your detected emotion. You can also add your own tasks and associate them with different moods!
                    </p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-sky-500/30 transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold text-sky-300 mb-3">Our Mission</h3>
                    <p className="text-gray-400">
                        We aim to foster a more empathetic and productive environment by helping individuals understand and work in harmony with their emotions. Your well-being is our priority.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="w-full max-w-5xl mx-auto">
                <h3 className="text-3xl font-bold text-sky-300 mb-8 text-center">Meet the Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                    {teamMembers.map(member => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
