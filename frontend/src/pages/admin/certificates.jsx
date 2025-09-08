import React from 'react';
import CertificateGenerator from '../../components/certificate-template';

const AdminCertificates = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Merit Certificate Generator
          </h1>
          <p className="text-gray-600">
            Generate and download merit certificates for students with customizable fields and professional design.
          </p>
        </div>

        {/* Certificate Generator Component */}
        <CertificateGenerator />
      </div>
    </div>
  );
};

export default AdminCertificates;
