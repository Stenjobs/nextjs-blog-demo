import Image from 'next/image';

export default function Profile() {
    return <div className="animate__animated animate__lightSpeedInLeft bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">Profile</h3>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        </div>

        <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-3">
                <Image
                    src="/images/kk.png"
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                />
            </div>
            <h2 className="text-lg font-semibold mb-0.5">Kristin Watson</h2>
            <p className="text-sm text-gray-500 mb-4">Design Manager</p>

            <div className="flex gap-4 w-full justify-center">
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <span className="font-semibold">11</span>
                    </div>
                    <span className="text-xs text-gray-500">Teams</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">56</span>
                    </div>
                    <span className="text-xs text-gray-500">Projects</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">12</span>
                    </div>
                    <span className="text-xs text-gray-500">Awards</span>
                </div>
            </div>
        </div>
    </div>
}

