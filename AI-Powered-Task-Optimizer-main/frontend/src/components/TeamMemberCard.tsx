import React from 'react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    imageUrl: string; // Placeholder image path
    linkedinUrl?: string; // Optional LinkedIn URL
}

interface TeamMemberCardProps {
    member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
    return (
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-sky-500/30 transition-shadow duration-300 transform hover:-translate-y-1">
            <img
                src={member.imageUrl || '/vite.svg'} // Fallback to vite.svg if no image
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-sky-400"
            />
            <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
            <p className="text-sky-300 text-sm mb-3">{member.role}</p>
            {member.linkedinUrl && (
                <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-sky-400 transition-colors"
                    aria-label={`${member.name}'s LinkedIn Profile`}
                >
                    {/* Simple text link for now, can be replaced with an icon */}
                    {/* Using a simple "in" icon placeholder like in the image */}
                    <span className="inline-flex items-center px-2 py-1 border border-sky-500 rounded text-xs">
                        <span className="font-bold text-sky-400">in</span>
                        {/* If you have an actual LinkedIn SVG icon, you can use it here */}
                    </span>
                </a>
            )}
            {!member.linkedinUrl && (
                <div className="h-6"></div>
            )}
        </div>
    );
};

export default TeamMemberCard;
