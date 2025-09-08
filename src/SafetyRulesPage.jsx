import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SafetyRulesPage.css';
import Toast from './Toast';
import logo from './kplc-logo.png'; // Reuse logo

// Embedded content from PDF (key excerpts – full text for offline use)
const safetyContent = {
  sections: [
    {
      id: 1,
      title: "Section 1 – General Requirements",
      content: [
        { subtitle: "1.1 Statutory Requirements", text: "The Kenya Power and Lighting Company Plc has a duty to comply with The Energy Act, 2019, Occupational Safety & Health Act, 2007, and Environmental Management & Coordination Act, 1999. All agents, contractors, and workmen must conduct work accordingly. Key penalties: Unauthorized electrical work – fine up to Ksh 1M or 1 year imprisonment (Energy Act Section 118). Employee duties (OSH Act Section 13): Ensure safety, use PPE, report hazards. Non-compliance: Fine up to Ksh 50,000 or 3 months imprisonment." },
        { subtitle: "1.2 Objections", text: "Any worker may object to unsafe work if rules are not complied with – no disciplinary action for refusing." },
        { subtitle: "1.3-1.5 Electrical Safety Rules, Issue, Definitions", text: "These rules (Revised 2022) protect employees. Definitions: e.g., 'Authorized Person' – trained for specific tasks; 'Permit-to-Work' – document for safe work on de-energized equipment." },
        { subtitle: "1.6 Dangerous Occurrences and Accidents", text: "Report accidents/incidents to supervisor and EPRA within 48 hours (Energy Act Section 214). Includes shocks, fires, spills." },
        { subtitle: "1.7 Failure of Supply", text: "Log outages at feeder/region level, investigate causes." },
        { subtitle: "1.8 Admittance to Substations", text: "Only authorized persons; wear PPE, no unauthorized access." },
        { subtitle: "1.9 Treatment for Electric Shock", text: "Immediate: Switch off supply, call for help. Do not touch victim if live. See Appendix B for details." },
        { subtitle: "1.10 Personal Protective Equipment (PPE)", text: "Mandatory: Helmets, gloves, insulated tools, safety boots. Inspect before use; employer provides." }
      ]
    },
    {
      id: 2,
      title: "Section 2 – Procedure for Initiation of Work",
      content: [
        { subtitle: "2.1 Access", text: "To EHV/HV/MV enclosures: Use keys/locks, wear PPE. Underground chambers: Ventilate, test for gas. Climbing poles/towers: Use ladders/gear, check stability (wooden: sound for defects; concrete/steel: inspect cracks). GIS Enclosure: Follow isolation." },
        { subtitle: "2.2 Switching", text: "Operate switchgear only by authorized persons. Communicate via radio/logs. Record all operations. Use safety locks/notices." },
        { subtitle: "2.3 Precautions for EHV/HV/MV Systems", text: "Isolate, earth, test dead. Limit access on structures (e.g., 2.3m clearance from live 11kV). Live line work: Special permit." },
        { subtitle: "2.4 Precautions for LV Systems", text: "De-energize before work; use insulated tools." },
        { subtitle: "2.5 Net Energy Metering", text: "Safe installation per EPRA standards." },
        { subtitle: "2.6 Earthing", text: "Apply circuit main earths at isolation points. Use approved leads (copper, min 50mm²). Record applications. Additional earths for long lines." },
        { subtitle: "2.7 Permit-to-Work, Sanctions-for-Test, Limitation-of-Access", text: "Issued by authorized person. Procedure: Isolate, earth, test dead, issue permit. Cancel on completion. Forms in Appendix A." },
        { subtitle: "2.8 Testing EHV/HV/MV Apparatus", text: "Inject test voltage only with sanction; ensure grounding." }
      ]
    },
    {
      id: 3,
      title: "Section 3 – Instructions for Work on Particular Equipment",
      content: [
        { subtitle: "3.1 Remotely/Automatically Controlled Equipment", text: "Isolate controls before work." },
        { subtitle: "3.2 HV/MV Metal-Clad Switchgear", text: "Earth busbars/feeders. No permit if <1min access. Auxiliary equipment: Isolate." },
        { subtitle: "3.3 Transformers", text: "Drain oil if needed; earth windings." },
        { subtitle: "3.4 Substations with Exposed Live Conductors", text: "Minimum clearances: 11kV – 2.3m, 33kV – 3.7m." },
        { subtitle: "3.5 Cables", text: "EHV/HV/MV: Prove dead at both ends. LV: Isolate. Auxiliary: Low risk but tag out." },
        { subtitle: "3.6 Overhead Lines", text: "Dead lines: Earth at supports. Adverse weather: Delay work. Double circuit: Special precautions if one live. LV lines: 5.5m clearance. No work above LV without isolation." },
        { subtitle: "3.7 Remote Relay/Control Equipment", text: "Isolate signals." },
        { subtitle: "3.8-3.9 Switched/Pole-Mounted Capacitors", text: "Discharge before work (wait 5min)." },
        { subtitle: "3.10 Line Traps/PLC Coupling", text: "Treat as live until discharged." },
        { subtitle: "3.11 HV/MV Rotating Machines", text: "Earth shafts; lock out drives." },
        { subtitle: "3.12 Oil Tanks", text: "Ventilate, test for gas." },
        { subtitle: "3.13 Fire Protection", text: "Portable extinguishers: CO2 for electrical. Automatic systems: Isolate if working nearby." },
        { subtitle: "3.14 HV Equipment with SF6 Gas", text: "Leak test; vent safely. Pressurized breakers: Follow decompression." },
        { subtitle: "3.15 Portable Ladders/Lifting Equipment", text: "Min 3m clearance from live conductors; use non-conductive." },
        { subtitle: "3.16 Single Wire Earth Return (SWER)", text: "Treat neutral as live." }
      ]
    },
    {
      id: 4,
      title: "Appendices",
      content: [
        { subtitle: "Appendix A: Safety Documents", text: "Forms: Electrical Permit-to-Work (isolate/earth/prove dead), Sanction-for-Test, Limitation-of-Access, Live Work Permit, Mechanical Permit." },
        { subtitle: "Appendix B: Basic First Aid", text: "1.1 Scene Management: Secure area. 1.2 Primary Survey: Check response/breathing. 1.3.1 Electric Shock: Turn off power, CPR if no pulse (30:2 compressions:breaths). 1.3.2 Bleeding: Direct pressure, elevate. 1.4 Concussions: Monitor symptoms (headache, nausea). 1.5 Electrical Burns: Cool, cover, no ointments. 1.6 Emergency Contacts: Dial 1199 (ambulance), Kenya Power 95551." },
        { subtitle: "Appendix C: Classes of Authorization", text: "e.g., Class A1: All voltages; Class B: LV only." },
        { subtitle: "Appendix D: Minimum Requirements for Authorization", text: "Training, experience (e.g., 2 years for HV). Re-authorize every 3 years." },
        { subtitle: "Appendix E: Notes", text: "A. Pole Inspection: Sound wood for rot; check concrete/steel for cracks. B. De-authorization: For violations. C. Re-authorization: Retraining. D. Metal-Clad vs Enclosed: Clad – internal access; Enclosed – external." }
      ]
    }
  ]
};

const SafetyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="currentColor" d="M12 2L1 12h3v8h16v-8h3L12 2zm0 2.5l7.5 7.5H17v-2h-2v-2h-2v-2h-2v2H7v2H5v2h2v2h2v2h2v-2h2v-2h2v2h2v-2h2v-2h-2v-2h-2v2h-2v-2h-2v2H7.5L12 4.5z"/>
  </svg>
);

function SafetyRulesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState(safetyContent.sections);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = safetyContent.sections.map(section => ({
      ...section,
      content: section.content.filter(item => 
        item.subtitle.toLowerCase().includes(term) || item.text.toLowerCase().includes(term)
      )
    })).filter(section => section.content.length > 0);
    setFilteredSections(filtered);
    if (term && filtered.length === 0) showToast('No matches found. Try broader keywords like "earthing" or "PPE".', 'info');
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
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <nav className="safety-nav">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <p className="safety-note">All accidents are preventable. Reference before any field work. (Energy Act 2019 compliant)</p>
      </nav>

      <main className="safety-main">
        <section className="search-section">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search rules (e.g., 'permit', 'earthing', 'first aid')"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && <p className="search-results">{filteredSections.length} sections match your search.</p>}
        </section>

        <section className="quick-tips">
          <h2>Quick Safety Tips</h2>
          <div className="tips-grid">
            <div className="tip-card" onClick={() => showToast('Always use PPE! Section 1.10', 'info')}>
              <SafetyIcon /> <span>Wear PPE (Helmets, Gloves)</span>
            </div>
            <div className="tip-card" onClick={() => showToast('Object to unsafe work – Section 1.2', 'info')}>
              <SafetyIcon /> <span>Right to Refuse Unsafe Tasks</span>
            </div>
            <div className="tip-card" onClick={() => showToast('Report accidents within 48 hours – Section 1.6', 'info')}>
              <SafetyIcon /> <span>Report Incidents to EPRA</span>
            </div>
            <div className="tip-card" onClick={() => showToast('Earth before work – Section 2.6', 'info')}>
              <SafetyIcon /> <span>Isolate & Earth Equipment</span>
            </div>
          </div>
        </section>

        <section className="rules-sections">
          <h2>Safety Rules Sections</h2>
          {filteredSections.length > 0 ? (
            filteredSections.map(section => (
              <div key={section.id} className="section-accordion">
                <button className="accordion-header">
                  {section.title}
                </button>
                <div className="accordion-content">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="rule-item">
                      <h3>{item.subtitle}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No results. Clear search or try "first aid" for Appendix B.</p>
          )}
        </section>

        <section className="first-aid-quick">
          <h2>Quick First Aid (Appendix B)</h2>
          <div className="aid-steps">
            <h3>Electric Shock:</h3>
            <ol>
              <li>Switch off power immediately.</li>
              <li>Check breathing; start CPR if needed (30 compressions: 2 breaths).</li>
              <li>Call 1199 (ambulance) or Kenya Power 95551.</li>
              <li>Cool burns; do not apply ointments.</li>
            </ol>
            <p className="aid-note">Full details in Appendix B. Always prioritize safety!</p>
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
