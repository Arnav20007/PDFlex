import { Cloud, Smartphone, Users } from "lucide-react";

export function CloudIntegration() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cloud-Powered Conversion
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your files from anywhere, on any device
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Cloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cloud Storage</h3>
            <p className="text-gray-600">Your converted files are safely stored in the cloud</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">Works perfectly on all devices and screen sizes</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Ready</h3>
            <p className="text-gray-600">Perfect for individuals and teams alike</p>
          </div>
        </div>
      </div>
    </section>
  );
} 