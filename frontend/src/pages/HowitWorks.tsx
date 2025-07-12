import React from 'react';

export const HowitWorks: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">How It Works</h1>
                <p className="text-gray-700 mb-6">
                    ReWear is a community-driven platform that allows users to swap or redeem points for preloved clothing — reducing fashion waste while refreshing your wardrobe.
                </p>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Sign Up &amp; Set Up Your Profile</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Create an account using your email.</li>
                    <li>Set your location, upload a profile image, and track your swap history and points.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">2. List Items You Don’t Use</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Upload photos, add title, description, size, category, condition, and tags.</li>
                    <li>Once approved, your item becomes available in the community.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Browse &amp; Discover</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Explore a wide range of available clothes.</li>
                    <li>Search by category, or let our AI Style Match suggest what pairs well with your wardrobe.</li>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Swap or Redeem</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Choose between:</li>
                    <ul className="list-disc pl-6">
                        <li>Sending a direct Swap Request for another user’s item.</li>
                        <li>Using your Points to redeem an item instantly.</li>
                    </ul>
                </ul>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Complete the Exchange</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Once the other party accepts the swap, arrange a handover or shipment.</li>
                    <li>After confirmation, points and status are updated automatically.</li>
                </ul>
            </div>
        </div>
    );
};

export default HowitWorks;