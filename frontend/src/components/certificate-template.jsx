import React, { useState, useRef } from 'react';
import { Download, Eye, FileText, Printer } from 'lucide-react';
import '../styles/certificate.css';

const CertificateTemplate = ({ 
  studentName = "",
  registrationNumber = "",
  hodCSITName = "Prof. N Gopi Krishna Murthy",
  hodCSDName = "Prof. M Suresh Babu",
  isPreview = false,
  isBlankTemplate = false
}) => {
  return (
    <div 
      className="certificate-container relative w-[1400px] h-[1000px] mx-auto bg-white shadow-2xl"
      style={{
        border: '8px solid #1e40af',
        borderImage: 'none',
        background: 'white',
        fontFamily: 'Times New Roman, serif',
        color: '#000000'
      }}
    >
      {/* Main Certificate Border */}
      <div className="absolute inset-4 rounded-lg bg-white" style={{border: '4px double #1e40af'}}>
        <div className="absolute inset-4 rounded-lg bg-white" style={{border: '2px dotted #7c3aed'}}>
          
          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-12 h-12 rounded-full" style={{border: '4px solid #1e40af', opacity: '0.7'}}></div>
          <div className="absolute top-2 right-2 w-12 h-12 rounded-full" style={{border: '4px solid #7c3aed', opacity: '0.7'}}></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 rounded-full" style={{border: '4px solid #1e40af', opacity: '0.7'}}></div>
          <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full" style={{border: '4px solid #7c3aed', opacity: '0.7'}}></div>

          {/* Header Section */}
          <div className="flex items-center justify-between px-8 pt-6 pb-4">
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/srkr_logo.png" 
                alt="SRKR College Logo" 
                className="w-20 h-20 object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-20 h-20 bg-blue-100 rounded-full hidden items-center justify-center">
                <span className="text-blue-700 font-bold text-xs">SRKR</span>
              </div>
            </div>

            {/* College Name */}
            <div className="flex-1 text-center mx-6">
              <h1 className="text-2xl font-bold mb-1 tracking-wide" style={{color: '#dc2626'}}>
                SAGI RAMAKRISHNAM RAJU ENGINEERING COLLEGE
              </h1>
              <h2 className="text-lg font-semibold mb-1" style={{color: '#7c3aed'}}>(AUTONOMOUS)</h2>
              <p className="text-sm leading-relaxed" style={{color: '#000000'}}>
                SRKR Marg, Chinnaamiram, Bhimavaram-534204, AP, India
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/event_logo.png" 
                alt="Event Logo" 
                className="w-20 h-20 object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-20 h-20 bg-purple-100 rounded-full hidden items-center justify-center">
                <span className="text-purple-700 font-bold text-xs">EVENT</span>
              </div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="flex justify-center px-8 mb-6">
            <div className="w-full h-0.5 rounded-full" style={{background: 'linear-gradient(to right, transparent, #7c3aed, transparent)'}}></div>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-6">
            <div className="relative">
              <h2 className="text-4xl font-bold mb-3 tracking-wider" style={{color: '#1e40af'}}>
                CERTIFICATE OF MERIT
              </h2>
            </div>
            <div className="flex justify-center items-center space-x-3 mt-4">
              <div className="w-16 h-0.5" style={{background: 'linear-gradient(to right, transparent, #7c3aed)'}}></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{border: '2px solid #7c3aed'}}>
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#7c3aed'}}></div>
              </div>
              <div className="w-16 h-0.5" style={{background: 'linear-gradient(to left, transparent, #7c3aed)'}}></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-12 mb-6">
            <div className="text-center text-gray-700 leading-relaxed">
              <p className="text-lg mb-6" style={{color: '#1e40af'}}>
                This is to certify that
              </p>
              
              {/* Student Name */}
              <div className="mb-6">
                <div className="relative inline-block min-w-[400px]">
                  {!isBlankTemplate && studentName ? (
                    <h3 className="text-3xl font-bold tracking-wide px-6 py-3 border-b-4 border-double rounded-lg shadow-md" style={{color: '#1e40af', borderColor: '#1e40af', background: 'linear-gradient(to right, #dbeafe, #e0e7ff)'}}>
                      {studentName}
                    </h3>
                  ) : (
                    <div className="border-b-4 border-double pb-3 mb-2 min-h-[50px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                      <span className="text-lg font-medium" style={{color: '#1e40af'}}>
                        {isBlankTemplate ? "" : "Student Name Required"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Number */}
              <div className="mb-6">
                <p className="text-lg mb-3" style={{color: '#1e40af'}}>Registration Number:</p>
                <div className="inline-block min-w-[300px]">
                  {!isBlankTemplate && registrationNumber ? (
                    <div className="px-5 py-2 border-2 rounded-lg font-mono text-lg font-bold shadow-md" style={{color: '#1e40af', borderColor: '#1e40af', background: 'linear-gradient(to right, #dbeafe, #e0e7ff)'}}>
                      {registrationNumber}
                    </div>
                  ) : (
                    <div className="border-b-2 pb-2 min-h-[35px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                      <span className="text-base font-medium" style={{color: '#1e40af'}}>
                        {isBlankTemplate ? "" : "Registration Number Required"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-lg leading-relaxed mb-3" style={{color: '#374151'}}>
                has successfully demonstrated exceptional performance and merit in their academic pursuits 
                during the <strong>INNOVERSE 2025</strong> event held on <strong>15th September 2025</strong> 
                and is hereby recognized for their outstanding achievements in the field of Computer Science 
                and Information Technology.
              </p>

              <p className="text-lg mb-6" style={{color: '#374151'}}>
                This certificate is awarded in recognition of their dedication, hard work, and excellence.
              </p>
            </div>
          </div>

          {/* Signatures Section - Within Border */}
          <div className="px-12 mb-6">
            <div className="grid grid-cols-2 gap-12 items-end">
              {/* HOD CSIT Signature */}
              <div className="text-center">
                <div className="mb-3 pb-8 relative min-h-[60px]">
                  <div className="border-b-2 mb-2 pb-2 min-h-[40px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                    <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                      {isBlankTemplate ? "" : "Signature"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 p-2 rounded-lg border" style={{borderColor: '#1e40af', background: 'linear-gradient(to bottom, #dbeafe, #ffffff)'}}>
                  {!isBlankTemplate && hodCSITName ? (
                    <>
                      <p className="font-bold text-sm" style={{color: '#1e40af'}}>{hodCSITName}</p>
                      <p className="text-xs font-semibold" style={{color: '#7c3aed'}}>Head of Department</p>
                      <p className="text-xs font-medium" style={{color: '#7c3aed'}}>Computer Science & IT</p>
                    </>
                  ) : (
                    <>
                      <div className="border-b mb-1 min-h-[20px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                        <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                          {isBlankTemplate ? "Prof. N Gopi Krishna Murthy" : "Prof. N Gopi Krishna Murthy"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{color: '#7c3aed'}}>Head of Department</p>
                      <p className="text-xs font-medium" style={{color: '#7c3aed'}}>Computer Science & IT</p>
                    </>
                  )}
                </div>
              </div>

              {/* HOD CSD Signature */}
              <div className="text-center">
                <div className="mb-3 pb-8 relative min-h-[60px]">
                  <div className="border-b-2 mb-2 pb-2 min-h-[40px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                    <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                      {isBlankTemplate ? "" : "Signature"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 p-2 rounded-lg border" style={{borderColor: '#7c3aed', background: 'linear-gradient(to bottom, #f3e8ff, #ffffff)'}}>
                  {!isBlankTemplate && hodCSDName ? (
                    <>
                      <p className="font-bold text-sm" style={{color: '#1e40af'}}>{hodCSDName}</p>
                      <p className="text-xs font-semibold" style={{color: '#7c3aed'}}>Head of Department</p>
                      <p className="text-xs font-medium" style={{color: '#7c3aed'}}>Computer Science & Design</p>
                    </>
                  ) : (
                    <>
                      <div className="border-b mb-1 min-h-[20px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                        <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                          {isBlankTemplate ? "Prof. M Suresh Babu" : "Prof. M Suresh Babu"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{color: '#7c3aed'}}>Head of Department</p>
                      <p className="text-xs font-medium" style={{color: '#7c3aed'}}>Computer Science & Design</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="px-12 mb-4">
            <div className="text-right">
              <div className="inline-block px-4 py-2 rounded-lg border-2" style={{borderColor: '#1e40af', background: 'linear-gradient(to right, #dbeafe, #e0e7ff)'}}>
                <p className="text-sm font-semibold" style={{color: '#1e40af'}}>
                  Date: 15th September 2025
                </p>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-7xl font-bold select-none transform rotate-12" style={{color: '#dbeafe', opacity: 0.2}}>
              SRKR ENGINEERING COLLEGE
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    registrationNumber: '',
    hodCSITName: 'Prof. N Gopi Krishna Murthy',
    hodCSDName: 'Prof. M Suresh Babu'
  });
  const [showPreview, setShowPreview] = useState(false);
  const certificateRef = useRef(null);
  const blankCertificateRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownload = async (isBlank = false) => {
    // Validation for filled certificate
    if (!isBlank && (!formData.studentName.trim() || !formData.registrationNumber.trim())) {
      alert('Please fill in Student Name and Registration Number before downloading the filled certificate.');
      return;
    }

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      if (isBlank) {
        // Make blank template visible temporarily
        const blankElement = blankCertificateRef.current;
        if (blankElement) {
          const parentElement = blankElement.parentElement;
          
          // Temporarily make it visible and positioned correctly
          const originalStyle = parentElement.style.cssText;
          parentElement.style.position = 'fixed';
          parentElement.style.top = '0';
          parentElement.style.left = '0';
          parentElement.style.zIndex = '9999';
          parentElement.style.visibility = 'visible';
          parentElement.style.backgroundColor = 'white';
          
          // Wait for rendering
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const canvas = await html2canvas(blankElement, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            width: 1400,
            height: 1000,
            scrollX: 0,
            scrollY: 0,
            logging: false,
            foreignObjectRendering: true
          });
          
          // Restore original positioning
          parentElement.style.cssText = originalStyle;
          
          const link = document.createElement('a');
          link.download = `SRKR_Merit_Certificate_Blank_Template_2025.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        }
      } else {
        // For filled certificate, use the existing ref
        if (certificateRef.current) {
          const canvas = await html2canvas(certificateRef.current, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            width: 1400,
            height: 1000,
            scrollX: 0,
            scrollY: 0,
            logging: false,
            foreignObjectRendering: true
          });
          
          const link = document.createElement('a');
          link.download = `SRKR_Merit_Certificate_${formData.studentName.replace(/[^a-zA-Z0-9]/g, '_') || 'Student'}_2025.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        }
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  return (
    <div className="space-y-6 admin-form-container bg-gray-50 min-h-screen">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 admin-form-container">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Certificate Generator
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Generate both filled certificates for specific students and blank templates for hard copy printing.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="Enter full name of the student"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="e.g., 21A21A0501"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="hodCSIT" className="block text-sm font-medium text-gray-700 mb-1">
                HOD CSIT Name
              </label>
              <input
                type="text"
                id="hodCSIT"
                value={formData.hodCSITName}
                onChange={(e) => handleInputChange('hodCSITName', e.target.value)}
                placeholder="Prof. N Gopi Krishna Murthy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="hodCSD" className="block text-sm font-medium text-gray-700 mb-1">
                HOD CSD Name
              </label>
              <input
                type="text"
                id="hodCSD"
                value={formData.hodCSDName}
                onChange={(e) => handleInputChange('hodCSDName', e.target.value)}
                placeholder="Prof. M Suresh Babu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              onClick={() => handleDownload(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Printer className="h-4 w-4" />
              Download Blank Template
            </button>
            
            {(showPreview && formData.studentName.trim() && formData.registrationNumber.trim()) && (
              <button
                onClick={() => handleDownload(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download className="h-4 w-4" />
                Download Filled Certificate
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold mb-2">📋 Certificate Options:</p>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Blank Template:</strong> Download empty certificate for handwritten filling and hard copy printing</li>
              <li>• <strong>Filled Certificate:</strong> Download with all details filled for digital use</li>
              <li>• <strong>Rectangular Format:</strong> Optimized for standard printing (1400x1000px)</li>
              <li>• <strong>Signature Fields:</strong> HOD CSIT and HOD CSD signature areas included within certificate border</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden Blank Template for Download */}
      <div style={{ 
        position: 'absolute', 
        top: '-10000px', 
        left: '0',
        width: '1400px',
        height: '1000px',
        backgroundColor: 'white',
        visibility: 'hidden',
        pointerEvents: 'none'
      }}>
        <div ref={blankCertificateRef}>
          <CertificateTemplate
            studentName=""
            registrationNumber=""
            hodCSITName="Prof. N Gopi Krishna Murthy"
            hodCSDName="Prof. M Suresh Babu"
            isBlankTemplate={true}
          />
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Certificate Preview</h2>
            <p className="text-sm text-gray-600 mt-1">Preview of the filled certificate</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
              <div ref={certificateRef}>
                <CertificateTemplate
                  studentName={formData.studentName}
                  registrationNumber={formData.registrationNumber}
                  hodCSITName={formData.hodCSITName}
                  hodCSDName={formData.hodCSDName}
                  isPreview={true}
                  isBlankTemplate={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
