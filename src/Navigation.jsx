import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Headphones, PlusCircle, User } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { icon: Headphones, path: '/' },
        { icon: PlusCircle, path: '/new-podcast' },
        { icon: User, path: '/profile' },
    ];

    return (
        <nav className="bg-card p-4">
            <ul className="flex justify-around">
                {navItems.map(({ icon: Icon, path }) => (
                    <li key={path}>
                        <Link to={path} className={`text-2xl ${location.pathname === path ? 'text-primary' : 'text-muted-foreground'}`}>
                            <Icon />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;