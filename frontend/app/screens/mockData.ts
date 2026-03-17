export const medicinesData = [
  { id:1, name:'Paracetamol 500mg', dosage:'500mg', freq:'Twice Daily', times:['8:00 AM','8:00 PM'], startDate:'Mar 10', endDate:'Mar 20', adherence:95, streak:7,  doses:[true,true,true,true,true,true,true]  },
  { id:2, name:'Vitamin C',         dosage:'1000mg',freq:'Once Daily',  times:['2:00 PM'],           startDate:'Mar 10', endDate:'Mar 31', adherence:90, streak:5,  doses:[true,true,false,true,true,true,true] },
  { id:3, name:'Antibiotic',        dosage:'250mg', freq:'Thrice Daily',times:['8:00 AM','2:00 PM','8:00 PM'],startDate:'Mar 12',endDate:'Mar 17',adherence:78,streak:3,doses:[true,false,true,true,false,true,true]},
];

export const todayScheduleData = [
  { time:'8:00 AM', med:'Paracetamol 500mg', status:'taken',    color:'#DC2626' },
  { time:'8:00 AM', med:'Antibiotic 250mg',  status:'taken',    color:'#16A34A' },
  { time:'2:00 PM', med:'Vitamin C 1000mg',  status:'due',      color:'#D97706' },
  { time:'2:00 PM', med:'Antibiotic 250mg',  status:'due',      color:'#16A34A' },
  { time:'8:00 PM', med:'Paracetamol 500mg', status:'upcoming', color:'#DC2626' },
  { time:'8:00 PM', med:'Antibiotic 250mg',  status:'upcoming', color:'#16A34A' },
];

// ── 28 full patients so sidebar count matches list ──────────────────────────
export const allPatients = [
  { id:1,  name:'Rahul Singh',    age:32, condition:'Dengue',        doctor:'Dr. Meera Kapoor', streak:7,  adherence:92, status:'Critical', lastSeen:'Today',      blood:'O+',  phone:'+91 98765 43210' },
  { id:2,  name:'Anita Rao',      age:45, condition:'Diabetes',      doctor:'Dr. Meera Kapoor', streak:10, adherence:87, status:'Stable',   lastSeen:'Yesterday',  blood:'B+',  phone:'+91 91234 56789' },
  { id:3,  name:'Vikram Patel',   age:28, condition:'Asthma',        doctor:'Dr. Arun Sharma',  streak:3,  adherence:71, status:'Monitor',  lastSeen:'2 days ago', blood:'A+',  phone:'+91 99887 76655' },
  { id:4,  name:'Priya Sharma',   age:36, condition:'Hypertension',  doctor:'Dr. Meera Kapoor', streak:14, adherence:95, status:'Stable',   lastSeen:'Today',      blood:'AB+', phone:'+91 77665 54433' },
  { id:5,  name:'Amit Verma',     age:55, condition:'Chest Pain',    doctor:'Dr. Arun Sharma',  streak:1,  adherence:60, status:'Critical', lastSeen:'3 hrs ago',  blood:'O-',  phone:'+91 88990 11223' },
  { id:6,  name:'Sunita Kumari',  age:62, condition:'Arthritis',     doctor:'Dr. Priya Singh',  streak:20, adherence:98, status:'Stable',   lastSeen:'3 days ago', blood:'A-',  phone:'+91 66554 43322' },
  { id:7,  name:'Deepak Joshi',   age:41, condition:'Typhoid',       doctor:'Dr. Meera Kapoor', streak:5,  adherence:82, status:'Monitor',  lastSeen:'Yesterday',  blood:'B-',  phone:'+91 55443 21100' },
  { id:8,  name:'Kavita Mishra',  age:29, condition:'Anemia',        doctor:'Dr. Priya Singh',  streak:8,  adherence:89, status:'Stable',   lastSeen:'5 days ago', blood:'O+',  phone:'+91 44332 10099' },
  { id:9,  name:'Rajesh Kumar',   age:50, condition:'Diabetes',      doctor:'Dr. Arun Sharma',  streak:12, adherence:76, status:'Monitor',  lastSeen:'Today',      blood:'B+',  phone:'+91 33221 09988' },
  { id:10, name:'Meena Gupta',    age:38, condition:'Migraine',      doctor:'Dr. Meera Kapoor', streak:6,  adherence:91, status:'Stable',   lastSeen:'2 days ago', blood:'A+',  phone:'+91 22110 98877' },
  { id:11, name:'Arjun Singh',    age:25, condition:'Viral Fever',   doctor:'Dr. Priya Singh',  streak:2,  adherence:65, status:'Monitor',  lastSeen:'Today',      blood:'O-',  phone:'+91 11009 87766' },
  { id:12, name:'Pooja Verma',    age:33, condition:'Thyroid',       doctor:'Dr. Meera Kapoor', streak:15, adherence:94, status:'Stable',   lastSeen:'Yesterday',  blood:'AB-', phone:'+91 99887 65544' },
  { id:13, name:'Suresh Patel',   age:47, condition:'BP High',       doctor:'Dr. Arun Sharma',  streak:9,  adherence:83, status:'Monitor',  lastSeen:'3 days ago', blood:'B+',  phone:'+91 88776 54433' },
  { id:14, name:'Rekha Jain',     age:52, condition:'Osteoporosis',  doctor:'Dr. Priya Singh',  streak:18, adherence:97, status:'Stable',   lastSeen:'Week ago',   blood:'A+',  phone:'+91 77665 43322' },
  { id:15, name:'Mohit Sharma',   age:30, condition:'Malaria',       doctor:'Dr. Meera Kapoor', streak:4,  adherence:78, status:'Monitor',  lastSeen:'Today',      blood:'O+',  phone:'+91 66554 32211' },
  { id:16, name:'Nisha Rao',      age:43, condition:'PCOS',          doctor:'Dr. Priya Singh',  streak:11, adherence:88, status:'Stable',   lastSeen:'Yesterday',  blood:'B-',  phone:'+91 55443 21100' },
  { id:17, name:'Karan Malhotra', age:27, condition:'Asthma',        doctor:'Dr. Arun Sharma',  streak:3,  adherence:69, status:'Monitor',  lastSeen:'2 days ago', blood:'A-',  phone:'+91 44332 10099' },
  { id:18, name:'Divya Kapoor',   age:35, condition:'Anaemia',       doctor:'Dr. Meera Kapoor', streak:7,  adherence:85, status:'Stable',   lastSeen:'4 days ago', blood:'O+',  phone:'+91 33221 09988' },
  { id:19, name:'Sanjay Gupta',   age:58, condition:'Diabetes',      doctor:'Dr. Arun Sharma',  streak:16, adherence:93, status:'Stable',   lastSeen:'Today',      blood:'AB+', phone:'+91 22110 98877' },
  { id:20, name:'Anjali Singh',   age:31, condition:'UTI',           doctor:'Dr. Priya Singh',  streak:2,  adherence:72, status:'Monitor',  lastSeen:'Yesterday',  blood:'B+',  phone:'+91 11009 87766' },
  { id:21, name:'Vivek Tiwari',   age:44, condition:'Liver Disease', doctor:'Dr. Arun Sharma',  streak:0,  adherence:55, status:'Critical', lastSeen:'3 hrs ago',  blood:'O-',  phone:'+91 99887 76655' },
  { id:22, name:'Lata Sharma',    age:60, condition:'Arthritis',     doctor:'Dr. Priya Singh',  streak:22, adherence:99, status:'Stable',   lastSeen:'Week ago',   blood:'A+',  phone:'+91 88776 65544' },
  { id:23, name:'Anil Kumar',     age:39, condition:'Hypertension',  doctor:'Dr. Meera Kapoor', streak:8,  adherence:80, status:'Monitor',  lastSeen:'2 days ago', blood:'B-',  phone:'+91 77665 54433' },
  { id:24, name:'Ritu Malhotra',  age:26, condition:'Dengue',        doctor:'Dr. Arun Sharma',  streak:1,  adherence:62, status:'Critical', lastSeen:'6 hrs ago',  blood:'AB-', phone:'+91 66554 43322' },
  { id:25, name:'Pramod Joshi',   age:53, condition:'COPD',          doctor:'Dr. Priya Singh',  streak:13, adherence:86, status:'Monitor',  lastSeen:'Yesterday',  blood:'O+',  phone:'+91 55443 32211' },
  { id:26, name:'Seema Verma',    age:37, condition:'Migraine',      doctor:'Dr. Meera Kapoor', streak:9,  adherence:91, status:'Stable',   lastSeen:'3 days ago', blood:'A-',  phone:'+91 44332 21100' },
  { id:27, name:'Harish Gupta',   age:48, condition:'Heart Disease', doctor:'Dr. Arun Sharma',  streak:0,  adherence:50, status:'Critical', lastSeen:'1 hr ago',   blood:'B+',  phone:'+91 33221 10099' },
  { id:28, name:'Tara Singh',     age:65, condition:'Diabetes',      doctor:'Dr. Priya Singh',  streak:25, adherence:98, status:'Stable',   lastSeen:'4 days ago', blood:'O+',  phone:'+91 22110 09988' },
];

export type Patient = typeof allPatients[0];

export const doctorAlerts = [
  { id:1, severity:'critical', patient:'Rahul Singh', initials:'RS', issue:'High Fever (104°F)', detail:'Temperature spiked to 104°F. Severe headache and body aches.', time:'2 min ago',  phone:'+91 98765 43210', doctor:'Dr. Meera Kapoor', responded:false },
  { id:2, severity:'critical', patient:'Amit Verma',  initials:'AV', issue:'Chest Pain',         detail:'Persistent chest tightness and difficulty breathing.',           time:'15 min ago', phone:'+91 88990 11223', doctor:'Dr. Arun Sharma',  responded:false },
  { id:3, severity:'warning',  patient:'Vikram Patel',initials:'VP', issue:'3 Missed Doses',     detail:'Antibiotic 250mg missed for 3 consecutive doses.',               time:'1 hr ago',   phone:'+91 99887 76655', doctor:'Dr. Arun Sharma',  responded:false },
];
