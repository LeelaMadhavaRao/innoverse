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
      className="certificate-container relative w-full max-w-4xl mx-auto bg-white shadow-2xl"
      style={{
        aspectRatio: '4/3',
        maxHeight: '75vh',
        border: '8px solid #ff6b35',
        borderImage: 'none',
        background: 'linear-gradient(135deg, #fefefe 0%, #f9f9f9 50%, #fefefe 100%)',
        fontFamily: 'Times New Roman, serif',
        color: '#000000',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)',
        margin: '20px auto'
      }}
    >
      {/* Main Certificate Border */}
      <div className="absolute inset-1 rounded-lg" style={{border: '4px double #e74c3c', background: 'linear-gradient(to bottom, #ffffff, #fefdf8)', boxShadow: 'inset 0 2px 10px rgba(231, 76, 60, 0.1)'}}>
        <div className="absolute inset-1 rounded-lg" style={{border: '2px dotted #d68910', background: 'linear-gradient(45deg, transparent 48%, rgba(214, 137, 16, 0.1) 50%, transparent 52%)', backgroundSize: '15px 15px'}}>
          
          {/* Elegant Corner Decorations */}
          {/* Simple Elegant Corner Decorations */}
          {/* Top Left */}
          <div className="absolute top-2 left-2 w-6 h-6 pointer-events-none" style={{zIndex: '10'}}>
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #ff6b35, #e74c3c)',
                border: '2px solid #c0392b',
                boxShadow: '0 2px 6px rgba(255, 107, 53, 0.3)'
              }}></div>
              <div className="absolute inset-1 rounded-full" style={{
                background: 'linear-gradient(135deg, #ffffff, #fdf2e9)',
                border: '1px solid #f39c12'
              }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 font-bold text-xs">✦</div>
            </div>
          </div>

          {/* Top Right */}
          <div className="absolute top-2 right-2 w-6 h-6 pointer-events-none" style={{zIndex: '10'}}>
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #d68910, #ff6b35)',
                border: '2px solid #b7950b',
                boxShadow: '0 2px 6px rgba(214, 137, 16, 0.3)'
              }}></div>
              <div className="absolute inset-1 rounded-full" style={{
                background: 'linear-gradient(135deg, #ffffff, #fdf2e9)',
                border: '1px solid #e67e22'
              }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 font-bold text-xs">✧</div>
            </div>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-2 left-2 w-6 h-6 pointer-events-none" style={{zIndex: '10'}}>
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #ff6b35, #c0392b)',
                border: '2px solid #922b21',
                boxShadow: '0 2px 6px rgba(255, 107, 53, 0.3)'
              }}></div>
              <div className="absolute inset-1 rounded-full" style={{
                background: 'linear-gradient(135deg, #ffffff, #fdf2e9)',
                border: '1px solid #d35400'
              }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 font-bold text-xs">★</div>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-2 right-2 w-6 h-6 pointer-events-none" style={{zIndex: '10'}}>
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #c0392b, #ff6b35)',
                border: '2px solid #a93226',
                boxShadow: '0 2px 6px rgba(192, 57, 43, 0.3)'
              }}></div>
              <div className="absolute inset-1 rounded-full" style={{
                background: 'linear-gradient(135deg, #ffffff, #fdf2e9)',
                border: '1px solid #e74c3c'
              }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 font-bold text-xs">❋</div>
            </div>
          </div>          {/* Subtle Corner Accent Lines */}
          <div className="absolute top-2 left-2 w-6 h-6" style={{zIndex: '5'}}>
            <div className="w-full h-0.5" style={{background: 'linear-gradient(to right, #ff6b35, transparent)'}}></div>
            <div className="w-0.5 h-full" style={{background: 'linear-gradient(to bottom, #ff6b35, transparent)'}}></div>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6" style={{zIndex: '5'}}>
            <div className="w-full h-0.5 ml-auto" style={{background: 'linear-gradient(to left, #e74c3c, transparent)'}}></div>
            <div className="w-0.5 h-full ml-auto" style={{background: 'linear-gradient(to bottom, #e74c3c, transparent)'}}></div>
          </div>
          <div className="absolute bottom-2 left-2 w-6 h-6" style={{zIndex: '5'}}>
            <div className="w-0.5 h-full" style={{background: 'linear-gradient(to top, #d68910, transparent)'}}></div>
            <div className="w-full h-0.5 mt-auto" style={{background: 'linear-gradient(to right, #d68910, transparent)'}}></div>
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6" style={{zIndex: '5'}}>
            <div className="w-0.5 h-full ml-auto" style={{background: 'linear-gradient(to top, #c0392b, transparent)'}}></div>
            <div className="w-full h-0.5 mt-auto ml-auto" style={{background: 'linear-gradient(to left, #c0392b, transparent)'}}></div>
          </div>

          {/* Header Section with Logos tightly beside the title (not at edges) */}
          <div className="px-2 pt-2 pb-1 mt-2 relative" style={{zIndex: '20'}}>
            <div className="mx-auto flex items-center justify-center gap-2" style={{maxWidth: '900px'}}>
              {/* Left Logos: SRKR + IDEALAB */}
              <div className="flex items-center gap-1">
                <img
                  src="/srkr_logo.png"
                  alt="SRKR Logo"
                  className="certificate-logo"
                  onError={(e) => { e.currentTarget.src = '/srkr_logo.jpg'; e.currentTarget.onerror = null; }}
                  style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                />
                <img
                  src="/idealab_logo.png"
                  alt="IDEALAB Logo"
                  className="certificate-logo"
                  onError={(e) => { e.currentTarget.src = '/idealab_logo.jpg'; e.currentTarget.onerror = null; }}
                  style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* College Name - Centered */}
              <div className="text-center px-2">
                <h1 className="text-base md:text-lg lg:text-xl font-bold mb-0.5 tracking-wide" style={{color: '#dc2626'}}>
                  SAGI RAMAKRISHNAM RAJU ENGINEERING COLLEGE
                </h1>
                <h2 className="text-xs font-semibold mb-0.5" style={{color: '#7c3aed'}}>(AUTONOMOUS)</h2>
                <p className="text-xs leading-tight" style={{color: '#000000'}}>
                  SRKR Marg, Chinnaamiram, Bhimavaram-534204, AP, India
                </p>
              </div>

              {/* Right Logo: INNOVERSE (smaller) */}
              <div className="flex items-center">
                <img
                  src="/innoverse_logo.jpg"
                  alt="Innoverse Logo"
                  className="certificate-logo"
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          {/* Simple Decorative Line */}
          <div className="flex justify-center px-4 mb-0.5 relative" style={{zIndex: '20'}}>
            <div className="w-full max-w-md h-0.5 rounded-full" style={{background: 'linear-gradient(to right, transparent, #ff6b35 20%, #e74c3c 50%, #d68910 80%, transparent)'}}></div>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-1 px-3 relative" style={{zIndex: '20'}}>
            <div className="relative p-1 certificate-title-bar">
              {/* Main title */}
              <h2 className="text-xs font-bold mb-0.5 tracking-wide relative z-10" style={{
                color: '#7c2d12',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)',
                fontFamily: 'serif',
                letterSpacing: '0.02em'
              }}>
                CERTIFICATE OF EXCELLENCE
              </h2>
              
              {/* Subtitle */}
              <p className="text-xs font-medium tracking-wide relative z-10" style={{ color: '#7c2d12', letterSpacing: '0.01em' }}>
                In recognition of outstanding achievement
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-3 mb-0.5 relative" style={{zIndex: '20'}}>
            <div className="text-center text-gray-700 leading-tight">
              <p className="text-xs mb-0.5 font-medium" style={{color: '#1e40af'}}>
                This is to certify that
              </p>
              
              {/* Student Name */}
              <div className="mb-0.5">
                <div className="relative inline-block min-w-[150px] md:min-w-[180px]">
                  {!isBlankTemplate && studentName ? (
                    <h3 className="text-sm font-bold tracking-wide certificate-chip chip-blue">
                      {studentName}
                    </h3>
                  ) : (
                    <h3 className="text-sm font-bold tracking-wide certificate-chip chip-blue">
                      {isBlankTemplate ? "___________________________" : "STUDENT NAME"}
                    </h3>
                  )}
                </div>
              </div>

              {/* Registration Number */}
              <div className="mb-0.5">
                <p className="text-xs text-gray-600 mb-0.5">Registration Number:</p>
                <div className="relative inline-block min-w-[100px] md:min-w-[130px]">
                  {!isBlankTemplate && registrationNumber ? (
                    <p className="text-xs font-semibold certificate-chip chip-purple">
                      {registrationNumber}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold certificate-chip chip-purple">
                      {isBlankTemplate ? "_____________________" : "REGISTRATION NUMBER"}
                    </p>
                  )}
                </div>
              </div>

              {/* Achievement Text - Concise */}
              <div className="mb-0.5">
                <p className="text-xs leading-tight max-w-2xl mx-auto" style={{color: '#374151'}}>
                  has demonstrated exceptional innovation and technical excellence during
                  {' '}
                  <span className="font-bold certificate-chip chip-blue">INNOVERSE 2025</span>
                  {' '}held on{' '}
                  <span className="font-semibold certificate-chip chip-purple">September 15th, 2025</span>.
                </p>
              </div>

              {/* Recognition Statement - Concise */}
              <div className="mb-0.5">
                <p className="text-xs leading-tight max-w-2xl mx-auto" style={{color: '#374151'}}>
                  This recognition acknowledges outstanding contributions in Entrepreneurship, Innovation, and Technology
                  in <br></br>
                  <span className="font-semibold certificate-chip chip-blue">Computer Science and Information Technology</span>.
                </p>
              </div>

              {/* Award Statement - Concise */}
              <div className="mb-0.5 relative">
                <p className="text-xs font-medium relative z-10" style={{color: '#7c3aed'}}>
                  ✦ Awarded with highest commendation for continued excellence ✦
                </p>
              </div>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="absolute left-0 right-0 px-3 relative" style={{bottom: '-40px', zIndex: '20'}}>
            <div className="flex justify-around items-end">
              {/* HOD CSD Signature - 20% width (LEFT) */}
              <div className="text-center" style={{width: '20%', minWidth: '90px'}}>
                <div className="mb-0.5 pb-0.5 relative min-h-[6px]">
                  <div className="border-b mb-0.5 pb-0.5 min-h-[4px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                    <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                      {isBlankTemplate ? "" : "Signature"}
                    </span>
                  </div>
                </div>
                <div className="space-y-0 p-0.5 rounded border text-center" style={{borderColor: '#7c3aed', background: 'linear-gradient(to bottom, #f3e8ff, #ffffff)'}}>
                  {!isBlankTemplate && hodCSDName ? (
                    <>
                      <p className="font-bold text-xs leading-tight" style={{color: '#1e40af'}}>{hodCSDName}</p>
                      <p className="text-xs font-semibold leading-tight" style={{color: '#7c3aed'}}>Prof. & Head</p>
                      <p className="text-xs leading-tight" style={{color: '#7c3aed'}}>CSD</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-xs leading-tight" style={{color: '#1e40af'}}>
                        Prof. M Suresh Babu
                      </p>
                      <p className="text-xs font-semibold leading-tight" style={{color: '#7c3aed'}}>Prof. & Head</p>
                      <p className="text-xs leading-tight" style={{color: '#7c3aed'}}>CSD</p>
                    </>
                  )}
                </div>
              </div>

              {/* HOD CSIT Signature - 20% width (MIDDLE) */}
              <div className="text-center" style={{width: '20%', minWidth: '90px'}}>
                <div className="mb-0.5 pb-0.5 relative min-h-[6px]">
                  <div className="border-b mb-0.5 pb-0.5 min-h-[4px] flex items-center justify-center" style={{borderColor: '#1e40af'}}>
                    <span className="text-xs font-medium" style={{color: '#1e40af'}}>
                      {isBlankTemplate ? "" : "Signature"}
                    </span>
                  </div>
                </div>
                <div className="space-y-0 p-0.5 rounded border text-center" style={{borderColor: '#1e40af', background: 'linear-gradient(to bottom, #dbeafe, #ffffff)'}}>
                  {!isBlankTemplate && hodCSITName ? (
                    <>
                      <p className="font-bold text-xs leading-tight" style={{color: '#1e40af'}}>{hodCSITName}</p>
                      <p className="text-xs font-semibold leading-tight" style={{color: '#7c3aed'}}>Prof. & Head</p>
                      <p className="text-xs leading-tight" style={{color: '#7c3aed'}}>CSIT</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-xs leading-tight" style={{color: '#1e40af'}}>
                        Prof. N Gopi Krishna Murthy
                      </p>
                      <p className="text-xs font-semibold leading-tight" style={{color: '#7c3aed'}}>Prof. & Head</p>
                      <p className="text-xs leading-tight" style={{color: '#7c3aed'}}>CSIT</p>
                    </>
                  )}
                </div>
              </div>

              {/* Principal Signature - 20% width (RIGHT) */}
              <div className="text-center" style={{width: '20%', minWidth: '90px'}}>
                <div className="mb-0.5 pb-0.5 relative min-h-[6px]">
                  <div className="border-b mb-0.5 pb-0.5 min-h-[4px] flex items-center justify-center text-xs" style={{borderColor: '#dc2626'}}>
                    <span className="text-xs font-medium" style={{color: '#dc2626'}}>
                      {isBlankTemplate ? "" : "Signature"}
                    </span>
                  </div>
                </div>
                <div className="space-y-0 p-0.5 rounded border text-center" style={{borderColor: '#dc2626', background: 'linear-gradient(to bottom, #fef2f2, #ffffff)'}}>
                  <p className="font-bold text-xs leading-tight" style={{color: '#dc2626'}}>
                    Dr. K.V. Murali Krishnam Raju
                  </p>
                  <p className="text-xs font-semibold leading-tight" style={{color: '#7c3aed'}}>Principal <br></br>SRKREC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{zIndex: '1'}}>
            <div className="text-7xl font-bold select-none transform rotate-12" style={{color: '#dbeafe', opacity: 0.1, zIndex: '1'}}>
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownload = async (isBlank = false) => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      let targetElement;
      if (isBlank) {
        targetElement = blankCertificateRef.current;
        // Temporarily make the blank template visible and properly positioned
        if (targetElement) {
          const parentContainer = targetElement.parentElement;
          const originalParentStyle = parentContainer.style.cssText;
          const originalStyle = targetElement.style.cssText;
          
          // Make parent visible and position it properly
          parentContainer.style.cssText = `
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: white !important;
            visibility: visible !important;
            opacity: 1 !important;
          `;
          
          // Make target element visible and centered
          targetElement.style.cssText = `
            display: block !important;
            position: relative !important;
            margin: 20px auto !important;
            visibility: visible !important;
            opacity: 1 !important;
            max-width: 1400px !important;
            width: 100% !important;
          `;
          
          // Wait for rendering and layout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const canvas = await html2canvas(targetElement, {
            width: targetElement.offsetWidth || 1400,
            height: targetElement.offsetHeight || 1000,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            removeContainer: false,
            foreignObjectRendering: false,
            logging: false
          });
          
          // Restore original styles
          parentContainer.style.cssText = originalParentStyle;
          targetElement.style.cssText = originalStyle;
          
          const link = document.createElement('a');
          link.download = 'SRKR_Excellence_Certificate_Blank_Template_2025.png';
          link.href = canvas.toDataURL();
          link.click();
        }
      } else {
        targetElement = certificateRef.current;
        if (targetElement) {
          const canvas = await html2canvas(targetElement, {
            width: targetElement.offsetWidth || 1400,
            height: targetElement.offsetHeight || 1000,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            removeContainer: false,
            foreignObjectRendering: false,
            logging: false
          });
          
          const link = document.createElement('a');
          link.download = `SRKR_Excellence_Certificate_${formData.studentName.replace(/[^a-zA-Z0-9]/g, '_') || 'Student'}_2025.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter student name');
      return false;
    }
    if (!formData.registrationNumber.trim()) {
      alert('Please enter registration number');
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleGenerateCertificate = () => {
    if (validateForm()) {
      handleDownload(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate Generator</h1>
          <p className="text-gray-600">Generate professional certificates for INNOVERSE 2025</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Certificate Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter registration number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HOD CSIT Name
              </label>
              <input
                type="text"
                name="hodCSITName"
                value={formData.hodCSITName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Head of Department CSIT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HOD CSD Name
              </label>
              <input
                type="text"
                name="hodCSDName"
                value={formData.hodCSDName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Head of Department CSD"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={handleGenerateCertificate}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </button>

            <button
              onClick={() => handleDownload(true)}
              className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Blank Template
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Certificate
            </button>
          </div>
        </div>

        {/* Live Certificate Preview - Always Visible */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Live Certificate Preview</h2>
          
          <div className="flex justify-center overflow-x-auto">
            <div className="min-w-0 max-w-full">
              <div ref={certificateRef} className="transform-gpu" style={{ minWidth: '800px' }}>
                <CertificateTemplate
                  studentName={formData.studentName}
                  registrationNumber={formData.registrationNumber}
                  hodCSITName={formData.hodCSITName}
                  hodCSDName={formData.hodCSDName}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Blank Template for Download */}
        <div style={{ display: 'none' }}>
          <div ref={blankCertificateRef}>
            <CertificateTemplate
              isBlankTemplate={true}
              hodCSITName={formData.hodCSITName}
              hodCSDName={formData.hodCSDName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;