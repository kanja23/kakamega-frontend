import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SafetyRulesPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png';

// Embedded PDF content (from provided pages 1-10; structured for search)
const safetyContent = {
  foreword: "These electrical safety rules are published for your protection and guidance but no rules can be prepared which shall protect you from your negligence. All accidents are preventable and no task is too important that risk of injury to people or damage to the environment is justified. Any worker is justified in objecting to carry out instructions to work on any electrical equipment or apparatus if he/she has reason to believe that these electrical safety rules are not being or may not be complied with. Any worker/operator who fails to carry out the provisions of these electrical safety rules shall be liable to disciplinary action. Signed: Manager - Safety, Health & Environment.",
  contents: "1. SECTION 1 – GENERAL REQUIREMENTS (7): 1.1 Statutory requirements (7), 1.2 Objections (11), 1.3 Electrical Safety Rules (11), 1.4 Issue of Electrical Safety Rules (11), 1.5 Definitions (11), 1.6 Dangerous Occurrences and Accidents (17), 1.7 Failure of Supply (17), 1.8 Admittance to Substations (17), 1.9 Treatment for Electric Shock (17), 1.10 Personal Protective Equipment (17). 2. SECTION 2 – PROCEDURE FOR INITIATION OF WORK (18): 2.1 Access (18), 2.2 Switching (19), 2.3 Precautions for EHV/HV/MV (21), 2.4 LV (22), 2.5 Net Energy Metering (23), 2.6 Earthing (23), 2.7 Permit-to-Work etc. (25), 2.8 Testing (28). 3. SECTION 3 – INSTRUCTIONS FOR WORK ON EQUIPMENT (29): 3.1 Remotely Controlled (29), 3.2 Switchgear (29), 3.3 Transformers (31), 3.4 Substations (32), 3.5 Cables (33), 3.6 Overhead Lines (35), etc. APPENDICES (45): A Safety Documents (46), B First Aid (62), C Authorization Classes (70), D Minimum Requirements (72), E Notes (74).",
  sections: [
    {
      id: 1,
      title: "Section 1 – General Requirements",
      content: [
        { subtitle: "1.1 Statutory Requirements", text: "The Kenya Power and Lighting Company Plc (herein defined as the Company) has a duty to comply with the legal provisions of The Energy Act, 2019 and with other various regulations affecting safety, health & environment which include The Occupational Safety & Health Act, 2007 and The Environmental Management & Coordination Act, 1999. Under The Occupational Safety & Health regulations, it is the duty of all agents, contractors, workmen and persons employed in connection with the transmission, distribution and use of electrical energy to conduct their work in accordance with its requirements. An Abstract copy shall be kept posted in each workstation and attended substation in the occupation of the Company. Some important sections: Energy Act 2019 Section 118 – Unauthorized activity: Fine Ksh 1M or 1 year imprisonment. Section 140(1)(a) – Distribution license duties. Section 148 – Authorization for installation. Section 152(1) – Unauthorized installation: Fine Ksh 100K or 6 months. Section 214(1) – Report accidents within 48 hours to EPRA. OSH Act 2007 Section 13(1) – Employee duties: Ensure safety, use PPE, report hazards, cooperate. Penalty: Fine Ksh 50K or 3 months. Section 14(1) – Report imminent danger. Section 15 – No interference with safety items (fine Ksh 100K). Section 16(1) – No creation of hazards. EMCA 1999 Section 3(1) – Clean environment entitlement. All persons must be conversant with these rules – ignorance is no excuse." },
        { subtitle: "1.2 Objections", text: "Any worker is justified in objecting to unsafe work if rules are not complied with." },
        { subtitle: "1.3-1.5 Electrical Safety Rules, Issue, Definitions", text: "Rules issued for protection. Definitions include 'Authorized Person', 'Permit-to-Work'." },
        { subtitle: "1.6 Dangerous Occurrences and Accidents", text: "Notify EPRA within 48 hours of accidents (loss of life, injury, fire, etc.)." },
        { subtitle: "1.7 Failure of Supply", text: "Log and investigate supply failures." },
        { subtitle: "1.8 Admittance to Substations", text: "Authorized access only; PPE required." },
        { subtitle: "1.9 Treatment for Electric Shock", text: "Switch off supply, call help; see Appendix B." },
        { subtitle: "1.10 Personal Protective Equipment", text: "Mandatory PPE: Helmets, gloves, etc.; inspect before use." }
      ]
    },
    // Add placeholders for other sections based on contents (expand as needed)
    {
      id: 2,
      title: "Section 2 – Procedure for Initiation of Work",
      content: [
        { subtitle: "2.1 Access", text: "Access to EHV/HV/MV enclosures, underground chambers, climbing poles/towers/GIS. Use PPE, check stability." },
        { subtitle: "2.2 Switching", text: "Authorized operations only; record, use locks/notices." },
        { subtitle: "2.3 Precautions for EHV/HV/MV", text: "Isolate, earth, test dead; clearances (e.g., 2.3m for 11kV)." },
        { subtitle: "2.4 LV Precautions", text: "De-energize; insulated tools." },
        { subtitle: "2.5 Net Energy Metering", text: "Safe per EPRA." },
        { subtitle: "2.6 Earthing", text: "Circuit main earths, leads (50mm² copper), record." },
        { subtitle: "2.7 Permit-to-Work", text: "Issue after isolation; forms in Appendix A." },
        { subtitle: "2.8 Testing", text: "Sanction for voltage injection." }
      ]
    },
    {
      id: 3,
      title: "Section 3 – Instructions for Work on Particular Equipment",
      content: [
        { subtitle: "3.1 Remotely Controlled", text: "Isolate controls." },
        { subtitle: "3.2 Switchgear", text: "Earth busbars; no permit for short access." },
        { subtitle: "3.3 Transformers", text: "Earth windings." },
        { subtitle: "3.4 Substations", text: "Clearances: 11kV 2.3m, 33kV 3.7m." },
        { subtitle: "3.5 Cables", text: "Prove dead at ends; HV/MV special." },
        { subtitle: "3.6 Overhead Lines", text: "Earth dead lines; weather delays; LV 5.5m clearance." },
        { subtitle: "3.7 Relay/Control", text: "Isolate signals." },
        { subtitle: "3.8 Capacitors", text: "Discharge 5min." },
        { subtitle: "3.14 SF6 Equipment", text: "Leak test; decompress." },
        { subtitle: "3.15 Ladders", text: "3m clearance from live." }
      ]
    },
    {
      id: 4,
      title: "Appendices",
      content: [
        { subtitle: "Appendix A: Safety Documents", text: "Forms: Permit-to-Work, Sanction-for-Test, Limitation-of-Access, Live/Mechanical Permits." },
        { subtitle: "Appendix B: Basic First Aid", text: "Scene management, primary survey. Electric Shock: Turn off power, CPR. Bleeding: Pressure. Concussions: Monitor. Burns: Cool/cover. Contacts: 1199 ambulance, *977# KPLC." },
        { subtitle: "Appendix C: Authorization Classes", text: "A1: All voltages; B: LV." },
        { subtitle: "Appendix D: Minimum Requirements", text: "Training/experience; re-authorize 3 years." },
        { subtitle: "Appendix E: Notes", text: "Pole inspection (sound wood), de-authorization, metal-clad vs. enclosed switchgear." }
      ]
    }
  ]
};

function SafetyRulesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState(null); // For accordion
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    // Filter logic (simple keyword match)
    if (term) {
      const filtered = safetyContent.sections.map(s => ({
        ...s,
        content: s.content.filter(item => 
          item.subtitle.toLowerCase().includes(term) || item.text.toLowerCase().includes(term)
        )
      })).filter(s => s.content.length > 0);
      if (filtered.length === 0) showToast('No matches. Try "PPE", "permit", or "shock". Full rules based on 2022 edition.', 'info');
      // Use filtered for display (update state if needed)
    }
  };

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
    showToast(`Opened ${safetyContent.sections.find(s => s.id === id).title}. Review before work!`, 'info');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const closeToast = () => setToast({ show: false, message: '', type: 'info' });

  return (
    <div className="safety-container">
      <header className="safety-header">
        <div className="app-title-container">
          <img src={logo} alt="KPLC Logo" className="header-logo" />
          <h1>Electrical Safety Rules (Revised 2022)</h1>
        </div>
      </header>

      <nav className="safety-nav">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <p className="safety-note">All accidents are preventable. Reference before inspections/disconnections. (From Foreword)</p>
      </nav>

      <main className="safety-main">
        {/* Foreword Banner */}
        <section className="foreword-banner">
          <h2>Foreword</h2>
          <p>{safetyContent.foreword}</p>
          <p className="foreword-source">Signed: Manager - Safety, Health & Environment</p>
        </section>

        {/* Contents Overview */}
        <section className="contents-section">
          <h2>Contents (Key Sections)</h2>
          <p>{safetyContent.contents}</p>
        </section>

        <section className="search-section">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search rules (e.g., 'Energy Act', 'earthing', 'first aid')"
            value={searchTerm}
            onChange={handleSearch}
          />
        </section>

        <section className="quick-tips">
          <h2>Quick Safety Tips (From PDF)</h2>
          <div className="tips-grid">
            <div className="tip-card" onClick={() => showToast('Comply with Energy Act – report accidents in 48 hours! Section 1.6', 'info')}>
              Report Incidents to EPRA
            </div>
            <div className="tip-card" onClick={() => showToast('Use PPE always – OSH Act Section 13. Section 1.10', 'info')}>
              Wear PPE (Gloves, Helmets)
            </div>
            <div className="tip-card" onClick={() => showToast('Object to unsafe work – Foreword & Section 1.2', 'info')}>
              Right to Refuse Unsafe Tasks
            </div>
            <div className="tip-card" onClick={() => showToast('Earth equipment – Section 2.6', 'info')}>
              Isolate & Earth Before Work
            </div>
          </div>
        </section>

        <section className="rules-sections">
          <h2>Safety Rules Sections (Click to Expand)</h2>
          {safetyContent.sections.map(section => (
            <div key={section.id} className="section-accordion">
              <button className="accordion-header" onClick={() => toggleSection(section.id)}>
                {section.title}
              </button>
              {activeSection === section.id && (
                <div className="accordion-content">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="rule-item">
                      <h3>{item.subtitle}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="first-aid-quick">
          <h2>Quick First Aid Guide (Appendix B Excerpt)</h2>
          <div className="aid-steps">
            <h3>Electric Shock (Section 1.9 & Appendix B):</h3>
            <ol>
              <li>Switch off supply or separate from source (do not touch if live).</li>
              <li>Check response/breathing; call 1199 if no pulse.</li>
              <li>CPR: 30 chest compressions (5-6cm depth) to 2 breaths.</li>
              <li>For burns: Cool with water 20min, cover with clean cloth; no ointments.</li>
              <li>Bleeding: Direct pressure, elevate limb.</li>
              <li>Concussions: Monitor for headache/nausea; seek medical help.</li>
            </ol>
            <p className="aid-note">Emergency Contacts: Ambulance 1199, Kenya Power *977#. Full procedures in Appendix B.</p>
          </div>
        </section>
      </main>

      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}

export default SafetyRulesPage;
