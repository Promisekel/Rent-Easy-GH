import React from 'react';
import { User } from '../../types/User';
import { Shield, ShieldCheck, Mail, Calendar, UserX } from 'lucide-react';

interface UserCardProps {
    user: User;
    onBlock: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBlock }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        {user.createdAt && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'landlord' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {user.role}
                    </span>
                    {user.verified ? (
                        <div className="flex items-center space-x-1 text-green-600">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs">Verified</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1 text-orange-600">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs">Unverified</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onBlock}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <UserX className="w-4 h-4" />
                    <span>Block User</span>
                </button>
            </div>
        </div>
    );
};

export default UserCard;
