import React from 'react';

export const PointSystem: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">Point System</h1>
                <p className="text-gray-700 mb-6">
                    Our point system is designed to make every garment count — whether you're giving or receiving.
                </p>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">🏷️ Earning Points</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>+10 points for listing an approved item</li>
                    <li>+15–30 points when your item is successfully swapped (based on condition and category)</li>
                    <li>+2 bonus points for early responses to swap requests</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">🛍️ Redeeming Points</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Each listed item has a fixed or dynamic point cost (10–50 pts)</li>
                    <li>You can redeem any available item directly using your balance — no approval needed</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">🔄 Swap vs Points: What’s the Difference?</h2>
                <table className="w-full text-left border border-gray-300 mb-6">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1 bg-gray-50 text-gray-900">Swap Request</th>
                            <th className="border px-2 py-1 bg-gray-50 text-gray-900">Redeem with Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-2 py-1">Requires user approval</td>
                            <td className="border px-2 py-1">Instant item claim</td>
                        </tr>
                        <tr>
                            <td className="border px-2 py-1">No point cost</td>
                            <td className="border px-2 py-1">Points deducted</td>
                        </tr>
                        <tr>
                            <td className="border px-2 py-1">Good for rare items</td>
                            <td className="border px-2 py-1">Quick, hassle-free flow</td>
                        </tr>
                    </tbody>
                </table>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">🧾 Points Are Non-Monetary</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Points cannot be bought or converted to cash.</li>
                    <li>They are purely community credits to encourage meaningful reuse.</li>
                </ul>
            </div>
        </div>
    );
};

export default PointSystem;