export default function Card() {
    return <div className="grid grid-cols-2 gap-4">
        {/* Prioritized tasks 卡片 */}
        <div className="animate__animated animate__lightSpeedInLeft relative p-8 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02]" style={{
            background: `
      radial-gradient(circle at 50% 50%, #FFFFFF 0%, transparent 70%),
      linear-gradient(to bottom right, #FFE0E6 0%, #FFD4E4 50%, #FFB8D9 100%),
      linear-gradient(to top left, #F8E4FF 0%, #FFE4F4 100%)
    `,
            minHeight: '180px'
        }}>
            <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">Prioritized tasks</h3>
                    <button className="p-2 hover:bg-white/30 rounded-full transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <div className="text-4xl font-bold mb-1">83%</div>
                    <p className="text-sm text-gray-600">Avg. Completed</p>
                </div>
            </div>
        </div>

        {/* Additional tasks 卡片 */}
        <div className="animate__animated animate__lightSpeedInLeft relative p-8 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02]" style={{
            background: `
      radial-gradient(circle at 50% 50%, #FFFFFF 0%, transparent 70%),
      linear-gradient(to bottom right, #E4F5FF 0%, #E0F4FF 50%, #D4F4FF 100%),
      linear-gradient(to top left, #E4FFFA 0%, #E4F8FF 100%)
    `,
            minHeight: '180px'
        }}>
            <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">Additional tasks</h3>
                    <button className="p-2 hover:bg-white/30 rounded-full transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <div className="text-4xl font-bold mb-1">56%</div>
                    <p className="text-sm text-gray-600">Avg. Completed</p>
                </div>
            </div>
        </div>
    </div>
}


