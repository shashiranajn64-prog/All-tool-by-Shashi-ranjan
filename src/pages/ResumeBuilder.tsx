import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Languages,
  Info,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Save,
  Eye,
  Layout,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumeBuilderProps {
  onNavigate: (path: string) => void;
}

export function ResumeBuilder({ onNavigate }: ResumeBuilderProps) {
  // Active template (1 to 6)
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [templatePreviewId, setTemplatePreviewId] = useState<number>(1);
  const [isFresher, setIsFresher] = useState<boolean>(false);

  // Resume Data state
  const [personal, setPersonal] = useState({
    name: 'Shashi Ranjan',
    title: 'Computer Operator & Developer',
    email: 'shashiranajn64@gmail.com',
    phone: '+91 98765 43210',
    address: 'Brahmpura Near Main Road',
    city: 'Muzaffarpur',
    state: 'Bihar',
    pinCode: '842001',
    photo: '',
    linkedin: 'linkedin.com/in/shashiranjan',
    website: 'https://alltool.in',
  });

  const [summary, setSummary] = useState(
    'Dedicated and detail-oriented Computer Operator and Software Professional with over 3 years of experience in data management, document processing, office automation, and fast typing. Proven ability to handle high-volume administrative tasks with accuracy and efficiency.'
  );

  const [educationList, setEducationList] = useState([
    {
      qualification: 'B.Tech / BCA',
      course: 'Computer Science',
      college: 'B.R. Ambedkar Bihar University',
      board: 'BRABU Muzaffarpur',
      year: '2021',
      score: '8.5 CGPA',
    },
  ]);

  const [experienceList, setExperienceList] = useState([
    {
      title: 'Senior Computer Operator',
      company: 'Digital Bihar Services',
      location: 'Muzaffarpur',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      responsibilities: [
        'Managed large databases and digital records with 99.9% accuracy.',
        'Generated weekly management reports and processed official documentation.',
        'Assisted technical team with software utilities and data validation.',
      ],
    },
  ]);

  const [skillsList, setSkillsList] = useState([
    { name: 'Data Entry & Typing', level: 'Expert' },
    { name: 'Microsoft Office (Word, Excel)', level: 'Expert' },
    { name: 'HTML / CSS / JavaScript', level: 'Intermediate' },
    { name: 'Photoshop & Image Editing', level: 'Advanced' },
  ]);

  const [languagesList, setLanguagesList] = useState([
    { language: 'Hindi', read: true, write: true, speak: true },
    { language: 'English', read: true, write: true, speak: true },
  ]);

  const [certificatesList, setCertificatesList] = useState([
    {
      title: 'Advanced Diploma in Computer Applications (ADCA)',
      organization: 'Bihar Technical Institute',
      year: '2020',
      description: 'Comprehensive training in office automation, programming, and database management.',
    },
  ]);

  const [additional, setAdditional] = useState({
    dob: '15-08-1999',
    gender: 'Male',
    nationality: 'Indian',
    maritalStatus: 'Unmarried',
    fatherName: 'Ram Suresh Singh',
    motherName: 'Sunita Devi',
    hobbies: 'Coding, Reading Tech Blogs, Typing Speed Practice',
    interests: 'Open Source Tools, Digital Governance',
    showDob: true,
    showGender: true,
    showNationality: true,
    showMarital: false,
    showParents: false,
    showHobbies: true,
    showInterests: true,
  });

  const [declaration, setDeclaration] = useState({
    enabled: true,
    text: 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.',
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('all_tool_resume_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.personal) setPersonal(data.personal);
        if (data.summary) setSummary(data.summary);
        if (data.educationList) setEducationList(data.educationList);
        if (data.experienceList) setExperienceList(data.experienceList);
        if (data.skillsList) setSkillsList(data.skillsList);
        if (data.languagesList) setLanguagesList(data.languagesList);
        if (data.certificatesList) setCertificatesList(data.certificatesList);
        if (data.additional) setAdditional(data.additional);
        if (data.declaration) setDeclaration(data.declaration);
        if (data.selectedTemplate) setSelectedTemplate(data.selectedTemplate);
        if (data.isFresher !== undefined) setIsFresher(data.isFresher);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to LocalStorage
  const handleSaveData = () => {
    const data = {
      personal,
      summary,
      educationList,
      experienceList,
      skillsList,
      languagesList,
      certificatesList,
      additional,
      declaration,
      selectedTemplate,
      isFresher,
    };
    localStorage.setItem('all_tool_resume_data', JSON.stringify(data));
    alert('Resume data saved successfully to browser storage!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all resume information?')) {
      localStorage.removeItem('all_tool_resume_data');
      window.location.reload();
    }
  };

  // Load Sample Resume Demo Data
  const handleLoadSample = () => {
    setPersonal({
      name: 'Rahul Kumar',
      title: 'Computer Operator & Data Specialist',
      email: 'rahul.muzaffarpur@example.com',
      phone: '+91 91234 56789',
      address: 'Near Station Road',
      city: 'Muzaffarpur',
      state: 'Bihar',
      pinCode: '842001',
      photo: '',
      linkedin: 'linkedin.com/in/rahulkumar',
      website: 'https://alltool.in',
    });
    setSummary('Energetic Computer Operator with 3+ years experience in document formatting, high speed data entry, and government portal submissions. Expert in Excel spreadsheets and customer database handling.');
    setEducationList([
      {
        qualification: 'Bachelor of Commerce (B.Com)',
        course: 'Accounting & Computers',
        college: 'L.S. College, Muzaffarpur',
        board: 'BRABU',
        year: '2022',
        score: '78%',
      },
    ]);
    setExperienceList([
      {
        title: 'Data Entry Operator',
        company: 'Bihar Cyber Tech Solutions',
        location: 'Muzaffarpur',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        responsibilities: [
          'Handled daily data processing of 500+ records with zero errors.',
          'Prepared digital invoices, Excel ledgers, and PDF reports.',
          'Assisted clients with online form submissions and document verification.',
        ],
      },
    ]);
    setSkillsList([
      { name: 'Fast Typing (Hindi/English)', level: 'Expert' },
      { name: 'MS Excel & Word', level: 'Expert' },
      { name: 'PDF & Image Conversion', level: 'Advanced' },
      { name: 'Internet Browsing & E-Filing', level: 'Advanced' },
    ]);
    setLanguagesList([
      { language: 'Hindi', read: true, write: true, speak: true },
      { language: 'English', read: true, write: false, speak: true },
    ]);
    setCertificatesList([
      {
        title: 'Certificate in Financial Accounting (Tally ERP)',
        organization: 'Youth Computer Centre Muzaffarpur',
        year: '2021',
        description: 'Learned inventory management, GST billing, and computerized accounting.',
      },
    ]);
    alert('Sample resume data loaded successfully!');
  };

  // Completion Percentage Calculator
  const calculateCompletion = () => {
    let score = 0;
    if (personal.name && personal.phone && personal.email) score += 25;
    if (summary) score += 15;
    if (educationList.length > 0 && educationList[0].qualification) score += 20;
    if (isFresher || (experienceList.length > 0 && experienceList[0].title)) score += 20;
    if (skillsList.length > 0) score += 10;
    if (languagesList.length > 0) score += 10;
    return Math.min(100, score);
  };

  const completionPercentage = calculateCompletion();

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPersonal({ ...personal, photo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Download using html2canvas and jsPDF
  const resumeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadPDF = async () => {
    if (!personal.name.trim()) {
      alert('Please enter your full name before downloading the PDF.');
      setActiveTab('personal');
      return;
    }
    setDownloading(true);
    try {
      const element = resumeRef.current;
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('My_Resume.pdf');
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const templateNames = [
    { id: 1, name: 'Classic Professional', desc: 'Clean white A4 page with traditional professional layout.' },
    { id: 2, name: 'Modern Two-Column', desc: 'Stylish sidebar layout separating skills and personal info.' },
    { id: 3, name: 'Corporate Executive', desc: 'Premium corporate appearance with strong typography.' },
    { id: 4, name: 'Minimal ATS-Friendly', desc: 'Single-column structure optimized for ATS text extraction.' },
    { id: 5, name: 'Creative Modern', desc: 'Modern attractive cards and timeline styling.' },
    { id: 6, name: 'Fresher / Student', desc: 'Optimized for first-job applications and education priority.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => onNavigate('/tools')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Tools
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Sample Resume
            </button>
            <button
              onClick={handleSaveData}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Resume
            </button>
            <button
              onClick={handleClearData}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Data
            </button>
          </div>
        </div>

        {/* Title & Progress Bar Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  All Tool — Shashi Ranjan Muzaffarpur
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Free & Printable
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Professional Resume Creator
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Build a professional job resume with 6 templates, live A4 preview, and instant PDF download.
              </p>
            </div>

            {/* Completion Meter */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[220px]">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Resume Completion</span>
                <span className="text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Grid (Desktop side-by-side, Mobile stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Resume Form Builder */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-wrap gap-1">
              {[
                { id: 'personal', label: '1. Personal', icon: User },
                { id: 'summary', label: '2. Summary', icon: FileText },
                { id: 'education', label: '3. Education', icon: GraduationCap },
                { id: 'experience', label: '4. Experience', icon: Briefcase },
                { id: 'skills', label: '5. Skills', icon: Award },
                { id: 'languages', label: '6. Languages', icon: Languages },
                { id: 'certificates', label: '7. Certificates', icon: FileCheck },
                { id: 'additional', label: '8. Additional', icon: Info },
                { id: 'templates', label: '9. Templates', icon: Layout },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: PERSONAL DETAILS */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 animate-in fade-in duration-200">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={personal.name}
                      onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                      placeholder="Shashi Ranjan"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={personal.title}
                      onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                      placeholder="Computer Operator"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      value={personal.phone}
                      onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                      placeholder="shashiranajn64@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={personal.address}
                      onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                      placeholder="Brahmpura Near Main Road"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={personal.city}
                      onChange={(e) => setPersonal({ ...personal, city: e.target.value })}
                      placeholder="Muzaffarpur"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={personal.state}
                      onChange={(e) => setPersonal({ ...personal, state: e.target.value })}
                      placeholder="Bihar"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={personal.pinCode}
                      onChange={(e) => setPersonal({ ...personal, pinCode: e.target.value })}
                      placeholder="842001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={personal.website}
                      onChange={(e) => setPersonal({ ...personal, website: e.target.value })}
                      placeholder="https://alltool.in"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                  {personal.photo ? (
                    <img src={personal.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-300">
                      No Photo
                    </div>
                  )}
                  <div className="flex-grow">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Photo (JPG/PNG)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {personal.photo && (
                        <button
                          onClick={() => setPersonal({ ...personal, photo: '' })}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PROFESSIONAL SUMMARY */}
            {activeTab === 'summary' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Professional Summary
                  </h3>
                  <button
                    onClick={() =>
                      setSummary(
                        'Motivated Computer Operator and administrative professional offering strong technical skills in typing, data management, and report generation. Eager to contribute expertise in office tasks and software operations.'
                      )
                    }
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate Sample
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a brief summary of your professional background and strengths..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed"
                />
              </div>
            )}

            {/* TAB CONTENT 3: EDUCATION */}
            {activeTab === 'education' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" /> Education History
                  </h3>
                  <button
                    onClick={() =>
                      setEducationList([
                        ...educationList,
                        { qualification: 'High School (12th)', course: 'Science / Arts', college: 'College Name', board: 'BSEB / CBSE', year: '2019', score: '75%' },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-600">Education #{idx + 1}</span>
                        {educationList.length > 1 && (
                          <button
                            onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.qualification}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].qualification = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="Qualification (e.g. B.Tech, 12th)"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          value={edu.course}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].course = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="Course / Stream"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          value={edu.college}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].college = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="School / College Name"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          value={edu.board}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].board = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="Board / University"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].year = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="Passing Year (e.g. 2021)"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].score = e.target.value;
                            setEducationList(list);
                          }}
                          placeholder="Percentage / CGPA"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: WORK EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" /> Work Experience
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFresher}
                      onChange={(e) => setIsFresher(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    I am a Fresher (No Experience)
                  </label>
                </div>

                {!isFresher && (
                  <div className="space-y-4">
                    <button
                      onClick={() =>
                        setExperienceList([
                          ...experienceList,
                          { title: 'Job Title', company: 'Company Name', location: 'Location', startDate: '2023', endDate: 'Present', current: true, responsibilities: ['Key responsibility or task handled.'] },
                        ])
                      }
                      className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Add Work Experience
                    </button>

                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-blue-600">Experience #{idx + 1}</span>
                          <button
                            onClick={() => setExperienceList(experienceList.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const list = [...experienceList];
                              list[idx].title = e.target.value;
                              setExperienceList(list);
                            }}
                            placeholder="Job Title"
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const list = [...experienceList];
                              list[idx].company = e.target.value;
                              setExperienceList(list);
                            }}
                            placeholder="Company Name"
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                          />
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const list = [...experienceList];
                              list[idx].location = e.target.value;
                              setExperienceList(list);
                            }}
                            placeholder="Location"
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                          />
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => {
                              const list = [...experienceList];
                              list[idx].startDate = e.target.value;
                              setExperienceList(list);
                            }}
                            placeholder="Start Date (e.g. Jan 2022)"
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Responsibilities (One per line)</label>
                          <textarea
                            rows={3}
                            value={exp.responsibilities.join('\n')}
                            onChange={(e) => {
                              const list = [...experienceList];
                              list[idx].responsibilities = e.target.value.split('\n');
                              setExperienceList(list);
                            }}
                            placeholder="Handled data entry..."
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isFresher && (
                  <div className="p-6 bg-blue-50/60 rounded-2xl border border-blue-200 text-center space-y-2">
                    <p className="text-sm font-bold text-blue-900">Fresher Mode Enabled</p>
                    <p className="text-xs text-blue-700">
                      Work experience section will be hidden or adapted. Template #6 (Fresher / Student) is recommended for your profile.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 5: SKILLS */}
            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" /> Skills & Expertise
                  </h3>
                  <button
                    onClick={() => setSkillsList([...skillsList, { name: 'New Skill', level: 'Intermediate' }])}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {skillsList.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const list = [...skillsList];
                          list[idx].name = e.target.value;
                          setSkillsList(list);
                        }}
                        placeholder="Skill Name (e.g. MS Excel)"
                        className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => {
                          const list = [...skillsList];
                          list[idx].level = e.target.value;
                          setSkillsList(list);
                        }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button
                        onClick={() => setSkillsList(skillsList.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-700 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: LANGUAGES */}
            {activeTab === 'languages' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-600" /> Languages Known
                  </h3>
                  <button
                    onClick={() => setLanguagesList([...languagesList, { language: 'Language', read: true, write: true, speak: true }])}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Language
                  </button>
                </div>

                <div className="space-y-3">
                  {languagesList.map((lang, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => {
                          const list = [...languagesList];
                          list[idx].language = e.target.value;
                          setLanguagesList(list);
                        }}
                        placeholder="Language Name"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full sm:w-48"
                      />
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.read}
                            onChange={(e) => {
                              const list = [...languagesList];
                              list[idx].read = e.target.checked;
                              setLanguagesList(list);
                            }}
                            className="rounded text-blue-600"
                          /> Read
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.write}
                            onChange={(e) => {
                              const list = [...languagesList];
                              list[idx].write = e.target.checked;
                              setLanguagesList(list);
                            }}
                            className="rounded text-blue-600"
                          /> Write
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lang.speak}
                            onChange={(e) => {
                              const list = [...languagesList];
                              list[idx].speak = e.target.checked;
                              setLanguagesList(list);
                            }}
                            className="rounded text-blue-600"
                          /> Speak
                        </label>
                      </div>
                      <button
                        onClick={() => setLanguagesList(languagesList.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-700 p-1 self-end sm:self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 7: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" /> Certificates & Achievements
                  </h3>
                  <button
                    onClick={() =>
                      setCertificatesList([
                        ...certificatesList,
                        { title: 'Certificate Title', organization: 'Organization', year: '2023', description: 'Brief description' },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Certificate
                  </button>
                </div>

                <div className="space-y-4">
                  {certificatesList.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-600">Certificate #{idx + 1}</span>
                        <button
                          onClick={() => setCertificatesList(certificatesList.filter((_, i) => i !== idx))}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const list = [...certificatesList];
                            list[idx].title = e.target.value;
                            setCertificatesList(list);
                          }}
                          placeholder="Certificate Title"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm sm:col-span-2"
                        />
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => {
                            const list = [...certificatesList];
                            list[idx].year = e.target.value;
                            setCertificatesList(list);
                          }}
                          placeholder="Year"
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        value={cert.organization}
                        onChange={(e) => {
                          const list = [...certificatesList];
                          list[idx].organization = e.target.value;
                          setCertificatesList(list);
                        }}
                        placeholder="Issuing Organization"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 8: ADDITIONAL & DECLARATION */}
            {activeTab === 'additional' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" /> Additional Information & Declaration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={additional.dob}
                      onChange={(e) => setAdditional({ ...additional, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                    <input
                      type="text"
                      value={additional.gender}
                      onChange={(e) => setAdditional({ ...additional, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={additional.nationality}
                      onChange={(e) => setAdditional({ ...additional, nationality: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hobbies</label>
                    <input
                      type="text"
                      value={additional.hobbies}
                      onChange={(e) => setAdditional({ ...additional, hobbies: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Declaration Section</label>
                    <input
                      type="checkbox"
                      checked={declaration.enabled}
                      onChange={(e) => setDeclaration({ ...declaration, enabled: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={declaration.text}
                    onChange={(e) => setDeclaration({ ...declaration, text: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT 9: TEMPLATES GALLERY */}
            {activeTab === 'templates' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-600" /> Select 1 of 6 Professional Templates
                  </h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Active: #{selectedTemplate}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templateNames.map((t) => {
                    const isSelected = selectedTemplate === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                              Template #{t.id}
                            </span>
                            {isSelected && (
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                          <span className="text-xs font-bold text-blue-600">Use Template →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE A4 RESUME PREVIEW */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800">Live A4 Preview (Template #{selectedTemplate})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" /> {downloading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>

              {/* A4 Resume Render Container */}
              <div className="overflow-x-auto pb-4">
                <div
                  ref={resumeRef}
                  className="bg-white text-slate-800 shadow-2xl rounded-sm mx-auto p-8 sm:p-12 w-[794px] min-h-[1123px] box-border relative font-sans text-sm leading-relaxed"
                  style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}
                >
                  {/* TEMPLATE 1: CLASSIC PROFESSIONAL */}
                  {selectedTemplate === 1 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6">
                        <div>
                          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personal.name || 'Your Name'}</h1>
                          <p className="text-blue-700 font-bold text-base mt-1">{personal.title}</p>
                          <p className="text-xs text-slate-600 mt-2 flex flex-wrap gap-3">
                            {personal.phone && <span>📞 {personal.phone}</span>}
                            {personal.email && <span>✉️ {personal.email}</span>}
                            {personal.city && <span>📍 {personal.city}, {personal.state}</span>}
                          </p>
                        </div>
                        {personal.photo && (
                          <img src={personal.photo} alt="Profile" className="w-24 h-24 rounded-lg object-cover border border-slate-300 shadow-sm" />
                        )}
                      </div>

                      {summary && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">Professional Summary</h3>
                          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                        </div>
                      )}

                      {educationList.length > 0 && educationList[0].qualification && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">Education</h3>
                          <div className="space-y-3">
                            {educationList.map((edu, idx) => (
                              <div key={idx} className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-slate-900 text-xs">{edu.qualification} in {edu.course}</div>
                                  <div className="text-xs text-slate-600">{edu.college} ({edu.board})</div>
                                </div>
                                <div className="text-right text-xs">
                                  <div className="font-semibold text-blue-700">{edu.year}</div>
                                  <div className="text-slate-600">{edu.score}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isFresher && experienceList.length > 0 && experienceList[0].title && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">Work Experience</h3>
                          <div className="space-y-4">
                            {experienceList.map((exp, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-bold text-slate-900 text-xs">{exp.title} — {exp.company}</div>
                                    <div className="text-xs text-slate-600">{exp.location}</div>
                                  </div>
                                  <div className="text-xs font-semibold text-blue-700">{exp.startDate} - {exp.endDate}</div>
                                </div>
                                <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-slate-700">
                                  {exp.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {skillsList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillsList.map((s, i) => (
                              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded text-xs font-semibold">
                                {s.name} ({s.level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {languagesList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">Languages Known</h3>
                          <p className="text-xs text-slate-700">
                            {languagesList.map((l) => `${l.language} (Read ${l.read ? '✓' : '✗'}, Write ${l.write ? '✓' : '✗'}, Speak ${l.speak ? '✓' : '✗'})`).join(' | ')}
                          </p>
                        </div>
                      )}

                      {declaration.enabled && (
                        <div className="pt-4 border-t border-slate-200 mt-6">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Declaration</h3>
                          <p className="text-[11px] text-slate-600 italic">{declaration.text}</p>
                          <div className="flex justify-between mt-4 text-xs font-semibold">
                            <span>Date: {new Date().toLocaleDateString()}</span>
                            <span>Signature: {personal.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEMPLATE 2: MODERN TWO-COLUMN */}
                  {selectedTemplate === 2 && (
                    <div className="grid grid-cols-12 gap-6 min-h-[1000px]">
                      {/* Left Sidebar (35%) */}
                      <div className="col-span-4 bg-slate-900 text-white p-6 -ml-8 -my-8 sm:-my-12 flex flex-col justify-between">
                        <div className="space-y-6">
                          {personal.photo && (
                            <img src={personal.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-blue-400 shadow-md" />
                          )}
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 border-b border-slate-700 pb-1 mb-3">Contact</h3>
                            <div className="space-y-2 text-xs text-slate-300">
                              {personal.phone && <div>📞 {personal.phone}</div>}
                              {personal.email && <div className="break-all">✉️ {personal.email}</div>}
                              {personal.city && <div>📍 {personal.city}, {personal.state}</div>}
                              {personal.linkedin && <div className="break-all">💼 {personal.linkedin}</div>}
                            </div>
                          </div>

                          {skillsList.length > 0 && (
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 border-b border-slate-700 pb-1 mb-3">Skills</h3>
                              <div className="space-y-1.5 text-xs text-slate-300">
                                {skillsList.map((s, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{s.name}</span>
                                    <span className="text-[10px] text-blue-300 opacity-75">{s.level}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {languagesList.length > 0 && (
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 border-b border-slate-700 pb-1 mb-3">Languages</h3>
                              <div className="space-y-1 text-xs text-slate-300">
                                {languagesList.map((l, i) => (
                                  <div key={i}>{l.language}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 pt-6">
                          All Tool — Shashi Ranjan Muzaffarpur
                        </div>
                      </div>

                      {/* Right Main Content (65%) */}
                      <div className="col-span-8 py-4 space-y-6">
                        <div>
                          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personal.name || 'Your Name'}</h1>
                          <p className="text-blue-600 font-bold text-base mt-1">{personal.title}</p>
                        </div>

                        {summary && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-blue-200 pb-1 mb-2">Profile Summary</h3>
                            <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                          </div>
                        )}

                        {!isFresher && experienceList.length > 0 && experienceList[0].title && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-blue-200 pb-1 mb-2">Work Experience</h3>
                            <div className="space-y-3">
                              {experienceList.map((exp, idx) => (
                                <div key={idx}>
                                  <div className="flex justify-between text-xs font-bold text-slate-900">
                                    <span>{exp.title} — {exp.company}</span>
                                    <span className="text-blue-600">{exp.startDate} - {exp.endDate}</span>
                                  </div>
                                  <ul className="list-disc list-inside mt-1 text-xs text-slate-700 space-y-0.5">
                                    {exp.responsibilities.map((resp, i) => (
                                      <li key={i}>{resp}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {educationList.length > 0 && educationList[0].qualification && (
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-blue-200 pb-1 mb-2">Education</h3>
                            <div className="space-y-2">
                              {educationList.map((edu, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <div>
                                    <span className="font-bold text-slate-900">{edu.qualification} in {edu.course}</span>
                                    <div className="text-slate-600">{edu.college}</div>
                                  </div>
                                  <span className="font-semibold text-blue-600">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATE 3: CORPORATE EXECUTIVE */}
                  {selectedTemplate === 3 && (
                    <div className="space-y-6">
                      <div className="text-center pb-6 border-b-2 border-indigo-900">
                        <h1 className="text-4xl font-black text-indigo-950 uppercase tracking-wider">{personal.name || 'Your Name'}</h1>
                        <p className="text-slate-600 font-bold text-sm mt-1">{personal.title}</p>
                        <p className="text-xs text-slate-500 mt-2 flex justify-center gap-4">
                          {personal.phone && <span>{personal.phone}</span>} •
                          {personal.email && <span>{personal.email}</span>} •
                          {personal.city && <span>{personal.city}, {personal.state}</span>}
                        </p>
                      </div>

                      {summary && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded mb-2">Executive Summary</h3>
                          <p className="text-xs text-slate-700 leading-relaxed px-1">{summary}</p>
                        </div>
                      )}

                      {!isFresher && experienceList.length > 0 && experienceList[0].title && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded mb-3">Professional Experience</h3>
                          <div className="space-y-4 px-1">
                            {experienceList.map((exp, idx) => (
                              <div key={idx} className="border-l-2 border-indigo-600 pl-3 space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-900">
                                  <span>{exp.title} at {exp.company}</span>
                                  <span className="text-indigo-700">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                                  {exp.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {educationList.length > 0 && educationList[0].qualification && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded mb-3">Education</h3>
                          <div className="space-y-2 px-1">
                            {educationList.map((edu, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-900">{edu.qualification} - {edu.course}</span>
                                  <div className="text-slate-600">{edu.college}</div>
                                </div>
                                <span className="font-semibold text-indigo-900">{edu.year} ({edu.score})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEMPLATE 4: MINIMAL ATS-FRIENDLY */}
                  {selectedTemplate === 4 && (
                    <div className="space-y-5 font-mono text-xs">
                      <div className="text-center pb-4 border-b border-black">
                        <h1 className="text-2xl font-bold uppercase">{personal.name || 'Your Name'}</h1>
                        <p className="text-sm font-semibold">{personal.title}</p>
                        <p className="text-[11px] mt-1">
                          {personal.phone} | {personal.email} | {personal.city}, {personal.state} {personal.pinCode}
                        </p>
                      </div>

                      {summary && (
                        <div>
                          <h4 className="font-bold uppercase border-b border-black pb-0.5 mb-1">SUMMARY</h4>
                          <p>{summary}</p>
                        </div>
                      )}

                      {skillsList.length > 0 && (
                        <div>
                          <h4 className="font-bold uppercase border-b border-black pb-0.5 mb-1">TECHNICAL SKILLS</h4>
                          <p>{skillsList.map((s) => `${s.name} (${s.level})`).join(', ')}</p>
                        </div>
                      )}

                      {!isFresher && experienceList.length > 0 && experienceList[0].title && (
                        <div>
                          <h4 className="font-bold uppercase border-b border-black pb-0.5 mb-1">EXPERIENCE</h4>
                          {experienceList.map((exp, idx) => (
                            <div key={idx} className="mb-2">
                              <div className="flex justify-between font-bold">
                                <span>{exp.title} — {exp.company}</span>
                                <span>{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <ul className="list-disc list-inside pl-2">
                                {exp.responsibilities.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {educationList.length > 0 && educationList[0].qualification && (
                        <div>
                          <h4 className="font-bold uppercase border-b border-black pb-0.5 mb-1">EDUCATION</h4>
                          {educationList.map((edu, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{edu.qualification} in {edu.course} — {edu.college}</span>
                              <span>{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEMPLATE 5: CREATIVE MODERN */}
                  {selectedTemplate === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white p-6 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 rounded-t flex items-center justify-between">
                        <div>
                          <h1 className="text-3xl font-black">{personal.name || 'Your Name'}</h1>
                          <p className="text-violet-200 font-semibold text-sm mt-1">{personal.title}</p>
                          <p className="text-xs text-violet-100 mt-2 flex gap-3">
                            <span>📱 {personal.phone}</span>
                            <span>✉️ {personal.email}</span>
                            <span>📍 {personal.city}</span>
                          </p>
                        </div>
                        {personal.photo && (
                          <img src={personal.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg" />
                        )}
                      </div>

                      {summary && (
                        <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-800 mb-1">Objective</h3>
                          <p className="text-xs text-slate-700">{summary}</p>
                        </div>
                      )}

                      {skillsList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 border-b border-violet-200 pb-1">Core Competencies</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillsList.map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-bold">
                                ✨ {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isFresher && experienceList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2 border-b border-violet-200 pb-1">Work History</h3>
                          {experienceList.map((exp, idx) => (
                            <div key={idx} className="mb-3">
                              <div className="flex justify-between text-xs font-bold text-slate-900">
                                <span>{exp.title} at {exp.company}</span>
                                <span className="text-violet-600">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <p className="text-xs text-slate-600">{exp.responsibilities[0]}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEMPLATE 6: FRESHER / STUDENT */}
                  {selectedTemplate === 6 && (
                    <div className="space-y-6">
                      <div className="text-center pb-6 border-b border-emerald-600">
                        {personal.photo && (
                          <img src={personal.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-emerald-600" />
                        )}
                        <h1 className="text-3xl font-black text-emerald-900">{personal.name || 'Your Name'}</h1>
                        <p className="text-emerald-700 font-bold text-sm mt-1">Fresher / Student — {personal.title || 'Job Seeker'}</p>
                        <p className="text-xs text-slate-600 mt-2">
                          {personal.phone} | {personal.email} | {personal.city}, {personal.state}
                        </p>
                      </div>

                      {summary && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Career Objective</h3>
                          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
                        </div>
                      )}

                      {educationList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Education Qualification</h3>
                          <div className="space-y-2">
                            {educationList.map((edu, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-900">{edu.qualification} ({edu.course})</span>
                                  <div className="text-slate-600">{edu.college}</div>
                                </div>
                                <span className="font-semibold text-emerald-700">{edu.year} — {edu.score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {skillsList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Skills & Computer Knowledge</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillsList.map((s, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {languagesList.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Languages Known</h3>
                          <p className="text-xs text-slate-700">{languagesList.map((l) => l.language).join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
