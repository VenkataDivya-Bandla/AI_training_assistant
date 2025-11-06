import React, { useState, useEffect } from 'react';

import { 
    Users, AlertTriangle, Loader2, Search, Filter, Calendar, TrendingUp, Clock, User, CheckCircle
} from 'lucide-react';

// --- MOCK TRAINING DATA ---
const MOCK_TRAINING_DATA = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice.j@corp.com",
        department: "Engineering",
        startDate: "2025-10-01",
        progress: 85,
        status: "In Progress",
        mentor: "David Lee",
        lastActivity: "3 hours ago",
    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob.s@corp.com",
        department: "Marketing",
        startDate: "2025-10-15",
        progress: 40,
        status: "Not Started",
        mentor: "Carol Chen",
        lastActivity: "1 week ago",
    },
    {
        id: 3,
        name: "Charlie Brown",
        email: "charlie.b@corp.com",
        department: "Sales",
        startDate: "2025-09-20",
        progress: 95,
        status: "Completed",
        mentor: "Fiona Gray",
        lastActivity: "2 days ago",
    },
    {
        id: 4,
        name: "Diana Prince",
        email: "diana.p@corp.com",
        department: "HR",
        startDate: "2025-08-01",
        progress: 60,
        status: "Overdue",
        mentor: "Bruce Wayne",
        lastActivity: "5 days ago",
    },
    {
        id: 5,
        name: "Ethan Hunt",
        email: "ethan.h@corp.com",
        department: "Finance",
        startDate: "2025-11-05",
        progress: 10,
        status: "Not Started",
        mentor: "Jane Doe",
        lastActivity: "Today",
    },
];

// Available filter options
const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
const STATUSES = ['All', 'In Progress', 'Not Started', 'Completed', 'Overdue'];

// Custom Hook to simulate data fetching (now using mock data)
const useFetchTrainingData = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate an API call delay
        const timer = setTimeout(() => {
            try {
                setData(MOCK_TRAINING_DATA);
                setError(null);
            } catch (err) {
                setError("Failed to load mock data.");
            } finally {
                setIsLoading(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return { data, isLoading, error };
};

// --- Helper Components ---

// Progress Bar Component
const ProgressBar = ({ progress, status }) => {
    let barColor = 'bg-gray-200';
    let progressColor = 'bg-blue-500';

    if (status === 'Completed') {
        progressColor = 'bg-green-500';
    } else if (status === 'Overdue') {
        progressColor = 'bg-red-500';
    } else if (status === 'In Progress') {
        progressColor = 'bg-teal-500';
    }

    return (
        <div className="w-full">
            <div className="text-xs font-semibold text-gray-700 mb-1">{progress}%</div>
            <div className={`h-2 rounded-full ${barColor}`}>
                <div
                    className={`h-2 rounded-full ${progressColor} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-100 text-gray-600';
    if (status === 'Completed') {
        colorClass = 'bg-green-100 text-green-700';
    } else if (status === 'Overdue') {
        colorClass = 'bg-red-100 text-red-700';
    } else if (status === 'In Progress') {
        colorClass = 'bg-indigo-100 text-indigo-700';
    } else if (status === 'Not Started') {
        colorClass = 'bg-yellow-100 text-yellow-700';
    }

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

// --- Main App Component ---
const App = () => {
    const { data: initialData, isLoading, error } = useFetchTrainingData();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortKey, setSortKey] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Filter and Sort Logic
    const filteredAndSortedData = initialData
        .filter(user => {
            // Search filter
            if (searchTerm && 
                !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !user.email.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return false;
            }

            // Department filter
            if (departmentFilter !== 'All' && user.department !== departmentFilter) {
                return false;
            }

            // Status filter
            if (statusFilter !== 'All' && user.status !== statusFilter) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (sortKey === 'progress') {
                valA = parseInt(valA, 10);
                valB = parseInt(valB, 10);
            }

            if (valA < valB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ columnKey }) => {
        if (sortKey !== columnKey) return null;
        return sortDirection === 'asc' ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingUp className="w-3 h-3 ml-1 rotate-180" />;
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <header className="mb-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight flex items-center">
                    <CheckCircle className="w-8 h-8 mr-3 text-green-500" />
                    Onboarding Status Dashboard
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                    Track and manage employee training progress live.
                </p>
            </header>

            <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
                
                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>Filter Department: {dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                            {STATUSES.map(status => (
                                <option key={status} value={status}>Filter Status: {status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="mt-3 text-lg text-gray-600">Loading Training Data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-48 bg-red-50 border border-red-300 rounded-lg p-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                        <p className="mt-2 text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Table View */}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    
                                    {/* Sortable Headers */}
                                    {['EMPLOYEE', 'START DATE', 'PROGRESS', 'STATUS', 'MENTOR', 'LAST ACTIVITY'].map((header) => {
                                        const keyMap = {
                                            'EMPLOYEE': 'name',
                                            'START DATE': 'startDate',
                                            'PROGRESS': 'progress',
                                            'STATUS': 'status',
                                            'MENTOR': 'mentor',
                                            'LAST ACTIVITY': 'lastActivity',
                                        };
                                        const key = keyMap[header];
                                        
                                        return (
                                            <th 
                                                key={key}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition"
                                                onClick={() => handleSort(key)}
                                            >
                                                <div className="flex items-center">
                                                    {header}
                                                    <SortIcon columnKey={key} />
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAndSortedData.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap w-4">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-indigo-500 font-semibold">{user.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.startDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <ProgressBar progress={user.progress} status={user.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.mentor}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                                {user.lastActivity}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredAndSortedData.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No employees found matching the current search and filter criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
