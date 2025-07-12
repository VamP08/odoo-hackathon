// filepath: d:\Code\odoo-hackathon\frontend\src\pages\SafetyGuidelines.tsx

import React from 'react';

export const SafetyGuidelines: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">Community Safety Guidelines</h1>
                <p className="text-gray-700 mb-6">
                    At ReWear, we are committed to creating a safe, respectful, and trustworthy space for all members. Please review and follow these guidelines to ensure a positive experience:
                </p>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Listing Items Responsibly</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Only upload photos and information of clean, wearable items in good condition.</li>
                    <li>Do not list undergarments or items that may be considered inappropriate.</li>
                    <li>Clearly state item details like size, condition, and any defects.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Respectful Interactions</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Communicate with fellow users politely and professionally.</li>
                    <li>Do not pressure others into swaps or point-based redemptions.</li>
                    <li>Harassment, spamming, or abusive behavior will result in suspension.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Swapping & Delivery</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Package items securely if shipping; damaged items may affect your reputation.</li>
                    <li>Meet in public locations for local handovers when possible.</li>
                    <li>Use the app’s swap request feature to keep all exchanges traceable.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Items</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>No listing of illegal goods, offensive material, or counterfeit brands.</li>
                    <li>Items flagged by admins may be removed without notice.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Reporting Issues</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Use the “Report” button to flag suspicious listings or behavior.</li>
                    <li>Our admin team reviews flagged content to ensure safety and fairness.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">Data & Privacy</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Never share personal contact or financial information outside the platform.</li>
                    <li>ReWear does not store or share your private details with third parties.</li>
                </ul>
            </div>
        </div>
    );
};

export default SafetyGuidelines;