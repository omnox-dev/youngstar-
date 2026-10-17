import React, { useState, useEffect } from 'react';
import MarathiSearchInput from './MarathiSearchInput';
import { matchesDevanagariSearch } from '../utils/transliteration';

export default function WhatsAppBroadcastManager({ settings }) {
  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Add Individual Contact Form State
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newGroupTag, setNewGroupTag] = useState('भाविक');
  const [newNotes, setNewNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit Contact Modal State
  const [editingContact, setEditingContact] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Bulk Import Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // Auto Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  // Active Broadcaster Sub-View: 'contacts' | 'composer'
  const [activeView, setActiveView] = useState('composer'); // start with broadcast composer & contacts side-by-side or tabbed

  // WhatsApp Notification Composer State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('aarti');
  const [customMessage, setCustomMessage] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Sequential Broadcast Session State
  const [isBroadcastSessionOpen, setIsBroadcastSessionOpen] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sentContactIds, setSentContactIds] = useState(new Set());

  // Available Groups/Tags
  const groupTags = ['भाविक', 'देणगीदार', 'कार्यकर्ता', 'पदाधिकारी', 'विशेष निमंत्रित'];

  // Preset Devotional Message Templates
  const festivalYear = settings?.festivalYear || '२०२६';
  const mandalName = settings?.mandalName || 'यंगस्टार मित्र मंडळ, देहूगाव';
  const editionText = settings?.editionText || '४९ वे वर्ष';

  const defaultTemplates = {
    aarti: {
      id: 'aarti',
      title: '🌺 महाआरती व दर्शन निमंत्रण',
      text: `🚩 *${mandalName} (${editionText})* 🚩\n\nसस्नेह जय गणेश, *{{name}}* जी!\n\nमंडळाच्या वतीने आयोजित आजच्या संध्या महाआरती व दर्शनासाठी आपण सहकुटुंब उपस्थित राहावे ही नम्र विनंती.\n\n⏰ *वेळ:* दररोज सायं ७:३० वा.\n📍 *स्थळ:* यंगस्टार मित्र मंडळ उत्सव मंडप, देहूगाव\n\n*|| गणपती बाप्पा मोरया ||*`
    },
    mahaprasad: {
      id: 'mahaprasad',
      title: '🍛 मोदक महाप्रसाद सोहळा निमंत्रण',
      text: `🚩 *${mandalName}* 🚩\n\nप्रिय *{{name}}* जी,\nसस्नेह नमस्कार.\n\nआपणास कळविण्यास आनंद होतो की गणेशोत्सवानिमित्त भव्य मोदक महाप्रसाद वाटप सोहळा आयोजित केला आहे.\n\n🍛 *महाप्रसाद वेळ:* दुपारी १२:०० ते ४:०० वा.\n📍 *स्थळ:* यंगस्टार मित्र मंडळ, देहूगाव\n\nआपण सहकुटुंब उपस्थित राहून महाप्रसादाचा लाभ घ्यावा ही आग्रहाची विनंती!\n*|| मंगलमूर्ती मोरया ||*`
    },
    visarjan: {
      id: 'visarjan',
      title: '🥁 भव्य सांगता विसर्जन मिरवणूक',
      text: `🚩 *${mandalName} (${festivalYear})* 🚩\n\nप्रिय *{{name}}* जी,\n\nश्री गणरायाच्या भव्य सांगता विसर्जन मिरवणुकीस पारंपरिक ढोल-ताशांच्या गजरात व गुलालाच्या उधळणीत प्रारंभ होत आहे.\n\n🥁 *वेळ:* दुपारी ३:०० वा.\n📍 *मार्ग:* मुख्य पेठ ते इंद्रायणी घाट, देहूगाव\n\nबाप्पाला भावपूर्ण निरोप देण्यासाठी आपण सर्वांनी सहकुटुंब उपस्थित राहावे!\n*|| गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या ||*`
    },
    vargani: {
      id: 'vargani',
      title: '🌸 वर्गणी व देणगी सहकार्य आवाहन',
      text: `🚩 *${mandalName} (स्थापना १९७७)* 🚩\n\nप्रिय *{{name}}* जी,\n\nआपल्या मंडळाचे हे ${editionText} असून गणेशोत्सवासाठी आपली पावती व वर्गणी नोंदणी सुरू आहे. उत्सव उत्तरोत्तर भव्य करण्यासाठी आपल्या दातृत्वाची साथ लाभो ही प्रार्थना.\n\n💳 अधिकृत डिजिटल पावतीसह वर्गणी जमा करण्यासाठी भेट द्या:\n${window.location.origin}/?tab=vargani\n\n*|| गणपती बाप्पा मोरया ||*`
    },
    schedule: {
      id: 'schedule',
      title: '📅 दैनिक उत्सव कार्यक्रम अपडेट',
      text: `🚩 *${mandalName}* 🚩\n\nप्रिय *{{name}}* जी,\n\nआजच्या गणेशोत्सव कार्यक्रमाची माहिती:\n🌺 सांस्कृतिक कार्यक्रम, भजन व कीर्तन संध्या ६:३० वा.\nसर्व भाविकांनी उपस्थित राहून कार्यक्रमाची शोभा वाढवावी ही विनंती.\n\nअधिक माहितीसाठी: ${window.location.origin}\n*|| गणपती बाप्पा मोरया ||*`
    },
    custom: {
      id: 'custom',
      title: '✍️ सानुकूल संदेश (Custom Message)',
      text: `🚩 *${mandalName}* 🚩\n\nप्रिय *{{name}}* जी,\n\nसर्व भाविकांना सूचित करण्यात येते की...\n\n*|| गणपती बाप्पा मोरया ||*`
    }
  };

  useEffect(() => {
    fetchContacts();
    setCustomMessage(defaultTemplates.aarti.text);
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4500);
  };

  // Fetch all devotee contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch('/api/admin/broadcast-contacts', {
        headers: { Authorization: token || '' }
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Failed to fetch broadcast contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Add Single Contact
  const handleAddIndividualContact = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim()) {
      showFeedback('error', 'कृपया नाव आणि मोबाईल क्रमांक प्रविष्ट करा.');
      return;
    }

    const cleanMobile = newMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      showFeedback('error', 'कृपया वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा.');
      return;
    }

    setIsAdding(true);
    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch('/api/admin/broadcast-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || ''
        },
        body: JSON.stringify({
          name: newName.trim(),
          mobile: cleanMobile,
          groupTag: newGroupTag,
          notes: newNotes.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message);
        setNewName('');
        setNewMobile('');
        setNewNotes('');
        fetchContacts();
      } else {
        showFeedback('error', data.message || 'संपर्क जोडताना त्रुटी आली.');
      }
    } catch (err) {
      showFeedback('error', 'सर्व्हर एरर: संपर्क जोडता आला नाही.');
    } finally {
      setIsAdding(false);
    }
  };

  // 2. Update Contact
  const handleUpdateContact = async (e) => {
    e.preventDefault();
    if (!editingContact) return;

    const cleanMobile = editingContact.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      showFeedback('error', 'कृपया वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा.');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch(`/api/admin/broadcast-contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || ''
        },
        body: JSON.stringify({
          name: editingContact.name.trim(),
          mobile: cleanMobile,
          groupTag: editingContact.group_tag,
          notes: (editingContact.notes || '').trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message);
        setIsEditModalOpen(false);
        setEditingContact(null);
        fetchContacts();
      } else {
        showFeedback('error', data.message || 'अद्यतनित करताना त्रुटी आली.');
      }
    } catch (err) {
      showFeedback('error', 'सर्व्हर एरर: अपडेट करता आला नाही.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. Delete Contact
  const handleDeleteContact = async (id, name) => {
    if (!window.confirm(`खरोखर '${name}' यांचा संपर्क ब्रॉडकास्ट यादीतून हटवायचा आहे का?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch(`/api/admin/broadcast-contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token || '' }
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message);
        fetchContacts();
      } else {
        showFeedback('error', data.message || 'हटवताना त्रुटी आली.');
      }
    } catch (err) {
      showFeedback('error', 'सर्व्हर एरर: संपर्क हटवता आला नाही.');
    }
  };

  // 4. Bulk Paste Add
  const handleBulkImport = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n');
    const parsedContacts = [];

    lines.forEach((line) => {
      const parts = line.split(/[,\t|;]/).map((p) => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const mobile = parts[1].replace(/\D/g, '');
        const groupTag = parts[2] || 'भाविक';
        const notes = parts[3] || '';
        if (name && mobile.length === 10) {
          parsedContacts.push({ name, mobile, groupTag, notes });
        }
      }
    });

    if (parsedContacts.length === 0) {
      showFeedback('error', 'एकही वैध संपर्क आढळला नाही. प्रत्येक ओळीत "नाव, मोबाईल" टाका.');
      return;
    }

    setIsBulkAdding(true);
    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch('/api/admin/broadcast-contacts/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || ''
        },
        body: JSON.stringify({ contacts: parsedContacts })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message);
        setBulkText('');
        setIsBulkModalOpen(false);
        fetchContacts();
      } else {
        showFeedback('error', data.message || 'आयात करताना त्रुटी आली.');
      }
    } catch (err) {
      showFeedback('error', 'सर्व्हर एरर: बल्क संपर्क जोडता आले नाहीत.');
    } finally {
      setIsBulkAdding(false);
    }
  };

  // 5. Auto Sync from Donations & Registrations
  const handleAutoSync = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('ymm_admin_token');
      const res = await fetch('/api/admin/broadcast-contacts/sync', {
        method: 'POST',
        headers: { Authorization: token || '' }
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message);
        fetchContacts();
      } else {
        showFeedback('error', data.message || 'सिंक करताना त्रुटी आली.');
      }
    } catch (err) {
      showFeedback('error', 'सर्व्हर एरर: सिंक करता आले नाही.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Template switch handler
  const handleSelectTemplate = (key) => {
    setSelectedTemplateKey(key);
    if (defaultTemplates[key]) {
      setCustomMessage(defaultTemplates[key].text);
    }
  };

  // Get Personalized message for a specific devotee
  const getPersonalizedMessage = (name = 'भाविक') => {
    return customMessage
      .replace(/{{name}}/g, name)
      .replace(/{{नाव}}/g, name)
      .replace(/{{year}}/g, festivalYear);
  };

  // 1-Click WhatsApp direct link
  const openDirectWhatsApp = (mobile, name) => {
    const text = getPersonalizedMessage(name);
    const url = `https://api.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentContactIds((prev) => new Set(prev).add(mobile));
  };

  // Share to any WhatsApp chat or group
  const shareGeneralWhatsApp = () => {
    const text = getPersonalizedMessage('सर्व भाविक बंधू व भगिनींनो');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Copy Formatted Text to Clipboard
  const copyMessageToClipboard = () => {
    const text = getPersonalizedMessage('भाविक');
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Insert Dynamic Variable in Composer
  const insertVariable = (variableStr) => {
    setCustomMessage((prev) => prev + ' ' + variableStr);
  };

  // Filtered contacts list (Supports dual-script English & Marathi phonetic search)
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      !searchQuery.trim() ||
      matchesDevanagariSearch(c.name, searchQuery) ||
      c.mobile.includes(searchQuery.trim()) ||
      (c.notes && matchesDevanagariSearch(c.notes, searchQuery)) ||
      (c.group_tag && matchesDevanagariSearch(c.group_tag, searchQuery));
    const matchesTag = selectedTag === 'ALL' || c.group_tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  // Start Sequential Broadcast
  const startSequentialBroadcast = () => {
    if (filteredContacts.length === 0) {
      showFeedback('error', 'ब्रॉडकास्ट करण्यासाठी किमान १ संपर्क आवश्यक आहे.');
      return;
    }
    setCurrentSessionIndex(0);
    setIsBroadcastSessionOpen(true);
  };

  const currentDevotee = filteredContacts[currentSessionIndex];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold mb-2 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>व्हॉट्सॲप ब्रॉडकास्ट व भाविक सूचना केंद्र</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-white flex items-center gap-2">
            <span>भाविक संपर्क यादी व व्हॉट्सॲप मेसेज ब्रॉडकास्टर</span>
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-2xl">
            येथे वैयक्तिक भाविकांचे नाव व व्हॉट्सॲप नंबर जोडा, आरती, महाप्रसाद, विसर्जन व वर्गणीचे निमंत्रण एका क्लिकवर भाविकांच्या व्हॉट्सॲपवर पाठवा!
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/20">
            <span className="text-[11px] text-white/80 block font-bold">एकूण नोंदणीकृत संपर्क</span>
            <span className="font-headline text-2xl font-bold text-white">{contacts.length} भाविक</span>
          </div>
        </div>
      </div>

      {/* Toast Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-sm transition-all ${
            feedback.type === 'success'
              ? 'bg-[#e8f5e9] text-[#1b5e20] border border-[#a5d6a7]'
              : 'bg-[#ffebee] text-[#b71c1c] border border-[#ffcdd2]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Left Column (Add Individual Contact & Composer), Right Column (Contacts Registry Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Add Individual Contact & Broadcast Composer Studio */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECTION 1: ADD INDIVIDUAL DEVOTEE CONTACT FORM */}
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ffe9e5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d14307]/10 flex items-center justify-center text-[#d14307]">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#281714]">
                    १. नवीन भाविक / संपर्क जोडा
                  </h3>
                  <span className="text-[11px] text-[#5a4139]">नाव व व्हॉट्सॲप मोबाईल नंबर प्रविष्ट करा</span>
                </div>
              </div>

              {/* Bulk Add Button */}
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="text-xs bg-[#fff0ee] hover:bg-[#ffe2dd] text-[#d14307] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition border border-[#ffe9e5]"
                title="एकाच वेळी अनेक संपर्क पेस्ट करा"
              >
                <span className="material-symbols-outlined text-[14px]">playlist_add</span>
                <span>बल्क पेस्ट</span>
              </button>
            </div>

            <form onSubmit={handleAddIndividualContact} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  भाविकाचे पूर्ण नाव (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="उदा. ज्ञानेश्वर महाराज भक्त"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714] focus:outline-none focus:border-[#d14307]"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#5a4139] text-[16px]">
                    person
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#281714] mb-1">
                    व्हॉट्सॲप मोबाईल (१० अंक) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-bold text-[#5a4139] select-none">
                      +९१
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="९८२२०१२३४५"
                      className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714] focus:outline-none focus:border-[#d14307]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#281714] mb-1">
                    वर्गवारी / गट (Group Tag)
                  </label>
                  <select
                    value={newGroupTag}
                    onChange={(e) => setNewGroupTag(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714] focus:outline-none focus:border-[#d14307]"
                  >
                    {groupTags.map((gt) => (
                      <option key={gt} value={gt}>
                        {gt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  शेरा / पत्ता / टिप्पणी (Optional Note)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="उदा. देहूगाव मेन पेठ, अन्नदान सेवा"
                  className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs text-[#281714] focus:outline-none focus:border-[#d14307]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 bg-[#d14307] hover:bg-[#a93200] text-white py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>{isAdding ? 'जोडत आहे...' : '+ भाविक संपर्क जोडा'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoSync}
                  disabled={isSyncing}
                  className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] border border-[#25D366]/30 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                  title="वर्गणी नोंदवही व युझर खात्यांमधून मोबाईल नंबर्स आपोआप आणा"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#25D366]">sync</span>
                  <span>{isSyncing ? 'सिंक...' : 'देणगीदार सिंक'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: WHATSAPP NOTIFICATION COMPOSER & PRESETS */}
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ffe9e5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <span className="material-symbols-outlined text-[18px]">mark_chat_unread</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#281714]">
                    २. व्हॉट्सॲप संदेश तयार करा
                  </h3>
                  <span className="text-[11px] text-[#5a4139]">रेडीमेड टेम्पलेट्स किंवा सानुकूल मेसेज</span>
                </div>
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {Object.values(defaultTemplates).map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition border ${
                    selectedTemplateKey === tmpl.id
                      ? 'bg-[#25D366] text-white border-[#25D366] shadow-sm'
                      : 'bg-[#fff8f6] text-[#5a4139] border-[#ffe9e5] hover:bg-[#ffe9e5]'
                  }`}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>

            {/* Variable Insert Helpers */}
            <div className="flex items-center gap-1.5 bg-[#f5fbf7] p-2 rounded-lg border border-[#c8e6c9]">
              <span className="text-[10px] font-bold text-[#2e7d32]">वेरिएबल्स:</span>
              <button
                type="button"
                onClick={() => insertVariable('{{name}}')}
                className="bg-white text-[#1b5e20] text-[10px] font-bold px-2 py-0.5 rounded border border-[#a5d6a7] hover:bg-[#e8f5e9]"
                title="भाविकाचे नाव आपोआप टाकेल"
              >
                + भाविकाचे नाव (&#123;&#123;name&#125;&#125;)
              </button>
              <button
                type="button"
                onClick={() => insertVariable(mandalName)}
                className="bg-white text-[#1b5e20] text-[10px] font-bold px-2 py-0.5 rounded border border-[#a5d6a7] hover:bg-[#e8f5e9]"
              >
                + मंडळ
              </button>
            </div>

            {/* Message Textarea */}
            <div>
              <textarea
                rows="6"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="येथे संदेश लिहा..."
                className="w-full p-3 rounded-xl bg-[#fff8f6] border border-[#ffe9e5] text-xs font-medium text-[#281714] focus:outline-none focus:border-[#25D366] font-mono leading-relaxed resize-none"
              />
              <span className="text-[10px] text-[#5a4139] mt-1 block">
                टीप: व्हॉट्सॲपमध्ये <b>*ठळक*</b> मजकूरासाठी शब्दाच्या दोन्ही बाजूस <b>*</b> स्टार वापरा.
              </span>
            </div>

            {/* Realistic WhatsApp Chat Preview Balloon */}
            <div className="bg-[#ECE5DD] p-3 rounded-xl border border-[#d2c9be] flex flex-col gap-1.5 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#54656f] font-bold pb-1 border-b border-[#000000]/10">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                  <span>WhatsApp मेसेज प्रिव्ह्यू (भाविक पाहणार)</span>
                </span>
                <span>आत्ताच</span>
              </div>
              <div className="bg-[#DCF8C6] text-[#111b21] p-2.5 rounded-lg text-[11px] leading-relaxed shadow-sm whitespace-pre-wrap max-w-[95%] self-end border border-[#c4e3ae]">
                {getPersonalizedMessage('ज्ञानेश्वर महाराज भक्त')}
                <div className="text-[9px] text-[#667781] text-right mt-1 flex items-center justify-end gap-1">
                  <span>१२:३० PM</span>
                  <span className="text-[#53bdeb]">✓✓</span>
                </div>
              </div>
            </div>

            {/* Broadcaster Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={startSequentialBroadcast}
                className="w-full bg-[#25D366] hover:bg-[#1EBE56] text-white py-3 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                <span>🚀 भाविकांना क्रमशः WhatsApp ब्रॉडकास्ट सुरू करा</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyMessageToClipboard}
                  className="bg-white hover:bg-[#fff0ee] text-[#5a4139] border border-[#ffe9e5] py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>{copiedToast ? 'कॉपी झाले ✓' : 'मेसेज कॉपी करा'}</span>
                </button>

                <button
                  type="button"
                  onClick={shareGeneralWhatsApp}
                  className="bg-[#075E54] hover:bg-[#128C7E] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  title="ग्रुपवर किंवा स्टेटसवर पाठवा"
                >
                  <span className="material-symbols-outlined text-[15px]">share</span>
                  <span>ग्रुपवर पाठवा</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTERED DEVOTEE CONTACTS DIRECTORY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-5 flex flex-col gap-4">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ffe9e5] pb-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-[#281714] flex items-center gap-2">
                  <span>नोंदणीकृत भाविक व्हॉट्सॲप यादी</span>
                  <span className="bg-[#25D366]/10 text-[#075E54] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#25D366]/20">
                    {filteredContacts.length} संपर्क
                  </span>
                </h3>
                <span className="text-xs text-[#5a4139]">
                  येथून कोणत्याही भाविकाला थेट एका क्लिकवर संदेश पाठवा
                </span>
              </div>

              {/* Sequential Broadcast Trigger */}
              <button
                type="button"
                onClick={startSequentialBroadcast}
                className="bg-[#25D366] hover:bg-[#1EBE56] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                <span>ब्रॉडकास्ट सेशन ({filteredContacts.length})</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <MarathiSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="नाव, मोबाईल किंवा शेरा शोधा (उदा. santosh, more, biradwade)..."
                />
              </div>

              {/* Group Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedTag('ALL')}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 transition ${
                    selectedTag === 'ALL'
                      ? 'bg-[#d14307] text-white shadow-xs'
                      : 'bg-[#fff0ee] text-[#5a4139] hover:bg-[#ffe2dd]'
                  }`}
                >
                  सर्व ({contacts.length})
                </button>
                {groupTags.map((t) => {
                  const count = contacts.filter((c) => c.group_tag === t).length;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTag(t)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 transition ${
                        selectedTag === t
                          ? 'bg-[#d14307] text-white shadow-xs'
                          : 'bg-[#fff0ee] text-[#5a4139] hover:bg-[#ffe2dd]'
                      }`}
                    >
                      {t} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contacts Table List */}
            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-[#5a4139]">
                संपर्क यादी लोड होत आहे...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-[#ffe9e5] rounded-xl bg-[#fffdfc]">
                <span className="material-symbols-outlined text-[36px] text-[#5a4139]/40">
                  contact_phone
                </span>
                <p className="text-xs font-bold text-[#281714]">कोणताही संपर्क आढळला नाही</p>
                <p className="text-[11px] text-[#5a4139]">
                  डाव्या बाजूच्या फॉर्ममधून नवीन भाविक संपर्क जोडा किंवा 'देणगीदार सिंक' बटण दाबा.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredContacts.map((contact, idx) => {
                  const isSent = sentContactIds.has(contact.mobile);
                  return (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSent
                          ? 'bg-[#f1f8f3] border-[#c8e6c9]'
                          : 'bg-[#fff8f6] hover:bg-[#fff0ee] border-[#ffe9e5]'
                      }`}
                    >
                      {/* Devotee Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d14307] to-[#fe932c] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {contact.name.charAt(0) || 'भ'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-xs text-[#281714] truncate">
                              {contact.name}
                            </h4>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                contact.group_tag === 'कार्यकर्ता'
                                  ? 'bg-blue-100 text-blue-800'
                                  : contact.group_tag === 'देणगीदार'
                                  ? 'bg-amber-100 text-amber-800'
                                  : contact.group_tag === 'पदाधिकारी'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-[#ffe2dd] text-[#a93200]'
                              }`}
                            >
                              {contact.group_tag || 'भाविक'}
                            </span>
                            {isSent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 flex items-center gap-0.5">
                                ✓ पाठवले
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#5a4139] mt-0.5">
                            <span className="font-mono font-bold text-[#281714]">
                              +९१ {contact.mobile}
                            </span>
                            {contact.notes && (
                              <>
                                <span>•</span>
                                <span className="truncate italic text-[10px] text-[#5a4139]">
                                  {contact.notes}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Direct WhatsApp Send Button */}
                        <button
                          type="button"
                          onClick={() => openDirectWhatsApp(contact.mobile, contact.name)}
                          className="bg-[#25D366] hover:bg-[#1EBE56] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition"
                          title="या भाविकाच्या WhatsApp वर संदेश उघडा"
                        >
                          <span className="material-symbols-outlined text-[15px]">send</span>
                          <span>WhatsApp</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContact(contact);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 bg-white hover:bg-gray-100 text-[#5a4139] border border-[#ffe9e5] rounded-lg transition"
                          title="बदल करा"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="p-1.5 bg-white hover:bg-red-50 text-red-600 border border-[#ffe9e5] rounded-lg transition"
                          title="हटवा"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: SEQUENTIAL BROADCAST STEPPER MODAL */}
      {isBroadcastSessionOpen && currentDevotee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ffe9e5] flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ffe9e5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#281714]">
                    क्रमशः व्हॉट्सॲप ब्रॉडकास्ट सत्र
                  </h3>
                  <span className="text-[11px] text-[#5a4139]">
                    भाविक {currentSessionIndex + 1} पैकी {filteredContacts.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastSessionOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#ffe9e5] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#25D366] h-full transition-all duration-300"
                style={{
                  width: `${((currentSessionIndex + 1) / filteredContacts.length) * 100}%`
                }}
              ></div>
            </div>

            {/* Current Devotee Card */}
            <div className="bg-[#fff8f6] p-4 rounded-2xl border border-[#ffe9e5] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#d14307] font-bold block uppercase">
                  प्राप्तकर्ता भाविक
                </span>
                <h4 className="font-headline text-lg font-bold text-[#281714]">
                  {currentDevotee.name}
                </h4>
                <span className="text-xs text-[#5a4139] font-mono font-bold">
                  📱 +९१ {currentDevotee.mobile} ({currentDevotee.group_tag || 'भाविक'})
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#d14307] to-[#fe932c] text-white font-bold text-lg flex items-center justify-center shadow">
                {currentDevotee.name.charAt(0) || 'भ'}
              </div>
            </div>

            {/* Customized Message Preview for this devotee */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-[#5a4139]">
                या भाविकासाठी तयार झालेला वैयक्तिक संदेश:
              </span>
              <div className="bg-[#DCF8C6] p-3 rounded-xl border border-[#c4e3ae] text-xs text-[#111b21] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                {getPersonalizedMessage(currentDevotee.name)}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => {
                openDirectWhatsApp(currentDevotee.mobile, currentDevotee.name);
                // Advance to next after short delay or keep user in control
                if (currentSessionIndex + 1 < filteredContacts.length) {
                  setCurrentSessionIndex(currentSessionIndex + 1);
                }
              }}
              className="w-full bg-[#25D366] hover:bg-[#1EBE56] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>
                {currentDevotee.name} यांना WhatsApp वर पाठवा (Open Chat)
              </span>
            </button>

            {/* Navigation Stepper Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={currentSessionIndex === 0}
                onClick={() => setCurrentSessionIndex(currentSessionIndex - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#ffe9e5] bg-[#fff8f6] hover:bg-[#ffe2dd] text-[#5a4139] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>मागील भाविक</span>
              </button>

              <button
                type="button"
                disabled={currentSessionIndex + 1 >= filteredContacts.length}
                onClick={() => setCurrentSessionIndex(currentSessionIndex + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#ffe9e5] bg-[#fff8f6] hover:bg-[#ffe2dd] text-[#5a4139] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>पुढील भाविक</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK IMPORT CONTACTS */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ffe9e5] flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#ffe9e5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d14307]/10 text-[#d14307] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#281714]">
                    एकाच वेळी अनेक संपर्क जोडा (Bulk Paste)
                  </h3>
                  <span className="text-[11px] text-[#5a4139]">प्रत्येक ओळीत "नाव, मोबाईल, वर्गवारी" टाका</span>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBulkImport} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  संपर्क यादी (ओळीने पेस्ट करा):
                </label>
                <textarea
                  rows="7"
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`उदा.\nज्ञानेश्वर पाटील, 9822112233, भाविक\nसतीश मोरे, 9890123456, कार्यकर्ता\nराजेंद्र शिंदे, 9881234567, देणगीदार`}
                  className="w-full p-3 rounded-xl bg-[#fff8f6] border border-[#ffe9e5] text-xs font-mono text-[#281714] focus:outline-none focus:border-[#d14307] resize-none"
                />
              </div>

              <div className="bg-[#fff0ee] p-2.5 rounded-xl border border-[#ffe2dd] text-[11px] text-[#5a4139]">
                💡 <b>टीप:</b> आपण Excel किंवा WhatsApp ग्रुपमधून कॉपी केलेले नाव व नंबर थेट पेस्ट करू शकता (स्वल्पविराम किंवा टॅब चालेल).
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-bold border border-[#ffe9e5] text-[#5a4139] hover:bg-gray-100"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isBulkAdding}
                  className="w-2/3 bg-[#d14307] hover:bg-[#a93200] text-white py-2.5 rounded-xl text-xs font-bold shadow"
                >
                  {isBulkAdding ? 'जोडत आहे...' : '+ सर्व संपर्क जोडा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CONTACT */}
      {isEditModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ffe9e5] flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#ffe9e5] pb-3">
              <h3 className="font-headline text-base font-bold text-[#281714]">
                संपर्क माहिती बदला (Edit Devotee)
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingContact(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateContact} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  भाविकाचे पूर्ण नाव *
                </label>
                <input
                  type="text"
                  required
                  value={editingContact.name}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  मोबाईल क्रमांक (१० अंक) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={editingContact.mobile}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      mobile: e.target.value.replace(/\D/g, '')
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  वर्गवारी / गट
                </label>
                <select
                  value={editingContact.group_tag}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, group_tag: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs font-bold text-[#281714]"
                >
                  {groupTags.map((gt) => (
                    <option key={gt} value={gt}>
                      {gt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  शेरा / पत्ता
                </label>
                <input
                  type="text"
                  value={editingContact.notes || ''}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs text-[#281714]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingContact(null);
                  }}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-bold border border-[#ffe9e5] text-[#5a4139]"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-2/3 bg-[#d14307] hover:bg-[#a93200] text-white py-2.5 rounded-xl text-xs font-bold shadow"
                >
                  {isUpdating ? 'जतन करत आहे...' : 'माहिती अद्यतनित करा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
