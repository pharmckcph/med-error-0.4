/**
 * Hospital Drug Formulary Master Catalog (บัญชียาโรงพยาบาลสมเด็จพระยุพราชเชียงของ)
 * Total: 517 items
 * Columns: ชื่อยา / ความแรง / HAD / LASA
 */

export interface DrugItem {
  id: string;
  name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  is_had: boolean;
  is_lasa: boolean;
  category: string;
}

export const HOSPITAL_DRUG_CATALOG: DrugItem[] = [
  {
    "id": "drug-hosp-001",
    "name": "(25 mcg-hr) Fentanyl Transdermal Patch",
    "generic_name": "(25 mcg-hr) Fentanyl Transdermal Patch",
    "strength": "25mcghr",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-002",
    "name": "(50 mcg-hr) Fentanyl Transdermal Patch",
    "generic_name": "(50 mcg-hr) Fentanyl Transdermal Patch",
    "strength": "8.4mgpatck",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-003",
    "name": "(ACETAR) Ringers Acetate 1000 ml",
    "generic_name": "(ACETAR) Ringers Acetate 1000 ml",
    "strength": "-",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-004",
    "name": "(AIR-X) Simethicone TAB (ทAน2)",
    "generic_name": "(AIR-X) Simethicone TAB (ทAน2)",
    "strength": "80mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-005",
    "name": "(Atarax) hydrOXYzine TAB แก้แพ้ (ทBน2,C50)",
    "generic_name": "(Atarax) hydrOXYzine TAB แก้แพ้ (ทBน2,C50)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-006",
    "name": "(CPM)Chlorpheniramine INJ (ทAน3)",
    "generic_name": "(CPM)Chlorpheniramine INJ (ทAน3)",
    "strength": "10mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-007",
    "name": "(Concor) BISOprolol TAB (ทCน2)",
    "generic_name": "(Concor) BISOprolol TAB (ทCน2)",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-008",
    "name": "(Cytotec) Misoprostol TAB",
    "generic_name": "(Cytotec) Misoprostol TAB",
    "strength": "200mcg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-009",
    "name": "(DAFLON) Diosmin TAB (ทC,B23น3)-NED",
    "generic_name": "(DAFLON) Diosmin TAB (ทC,B23น3)-NED",
    "strength": "45050",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-010",
    "name": "(Dilantin) PHENYTOIN CAP (ทBน1)",
    "generic_name": "(Dilantin) PHENYTOIN CAP (ทBน1)",
    "strength": "100mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-011",
    "name": "(EPI) Hepatitis B vaccine",
    "generic_name": "(EPI) Hepatitis B vaccine",
    "strength": "20mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-012",
    "name": "(EPI)DTP-HB-HIB vaccine(รวม5ชนิด)",
    "generic_name": "(EPI)DTP-HB-HIB vaccine(รวม5ชนิด)",
    "strength": "30iu10mcg10mcg4iu6iu",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-013",
    "name": "(FerroKid) Ferrous Fumarate SYR 76mg/5ml (IRON 25mg/5ml)-60ml",
    "generic_name": "(FerroKid) Ferrous Fumarate SYR 76mg/5ml (IRON 25mg/5ml)-60ml",
    "strength": "25mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-014",
    "name": "(FluOph) Fluorometholone Eye Drop",
    "generic_name": "(FluOph) Fluorometholone Eye Drop",
    "strength": "0.1%",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-015",
    "name": "(HBIG) Hepatitis B sureface antigen Immunoglobulin",
    "generic_name": "(HBIG) Hepatitis B sureface antigen Immunoglobulin",
    "strength": "180 IUml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-016",
    "name": "(HIBISCRUB) Chlorhexidine 60 mL",
    "generic_name": "(HIBISCRUB) Chlorhexidine 60 mL",
    "strength": "4 % 60 ml WV",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-017",
    "name": "(HISTA-OPH)Antazoline+tetrazolin eye drops",
    "generic_name": "(HISTA-OPH)Antazoline+tetrazolin eye drops",
    "strength": "10 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-018",
    "name": "(IOPAMIRO 300) IopaMIDOL",
    "generic_name": "(IOPAMIRO 300) IopaMIDOL",
    "strength": "30.62g/50ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-019",
    "name": "(IOPAMIRO 370) IopaMIDOL",
    "generic_name": "(IOPAMIRO 370) IopaMIDOL",
    "strength": "75.53 g/100 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-020",
    "name": "(Inhalex) Nebule-Berodual-Solution (ทBน2)",
    "generic_name": "(Inhalex) Nebule-Berodual-Solution (ทBน2)",
    "strength": "50 mg 20 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-021",
    "name": "(KOCITAF) TAF+FTC+DTG",
    "generic_name": "(KOCITAF) TAF+FTC+DTG",
    "strength": "50+200+25",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-022",
    "name": "(Kaletra) LopinavirRitonavir",
    "generic_name": "(Kaletra) LopinavirRitonavir",
    "strength": "20050",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-023",
    "name": "(Levophed)Norepinephrine INJ (ทDน4)",
    "generic_name": "(Levophed)Norepinephrine INJ (ทDน4)",
    "strength": "4mg4ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-024",
    "name": "(MOM) MAGNESIUM HYDROXIDE (ทAน2)",
    "generic_name": "(MOM) MAGNESIUM HYDROXIDE (ทAน2)",
    "strength": "80mgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-025",
    "name": "(Mucilin)Ispaghula husk 2.45g-5g ซอง",
    "generic_name": "(Mucilin)Ispaghula husk 2.45g-5g ซอง",
    "strength": "2.45 g5g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-026",
    "name": "(NALADOR) Sulprostone INJ",
    "generic_name": "(NALADOR) Sulprostone INJ",
    "strength": "500 mcg/ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-027",
    "name": "(Nebules) 0.5% SALBUTAMOL solution (ทAน2)",
    "generic_name": "(Nebules) 0.5% SALBUTAMOL solution (ทAน2)",
    "strength": "20 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-028",
    "name": "(Provera) Medroxyprogesterone acetate TAB",
    "generic_name": "(Provera) Medroxyprogesterone acetate TAB",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-029",
    "name": "(RPV) Rilpivirine (ทBน3)",
    "generic_name": "(RPV) Rilpivirine (ทBน3)",
    "strength": "25 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-030",
    "name": "(SODAMINT)sodium bicarbonate TAB (ทBน3)",
    "generic_name": "(SODAMINT)sodium bicarbonate TAB (ทBน3)",
    "strength": "300 mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-031",
    "name": "(Thiamine) VITAMIN B1 (ทACน1)",
    "generic_name": "(Thiamine) VITAMIN B1 (ทACน1)",
    "strength": "100mgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-032",
    "name": "(Thiamine) VITAMIN B1 TAB",
    "generic_name": "(Thiamine) VITAMIN B1 TAB",
    "strength": "100 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-033",
    "name": "(ULTRAVIST 370) IoPROmide",
    "generic_name": "(ULTRAVIST 370) IoPROmide",
    "strength": "38.44 g/50 mL,370 MG/mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-034",
    "name": "(Vial) Insulin Mixtard 70:30 (ทAน1)",
    "generic_name": "(Vial) Insulin Mixtard 70:30 (ทAน1)",
    "strength": "70:30-1000unit/10ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-035",
    "name": "(Vial) Insulin NPH Isophane (ทAน1)",
    "generic_name": "(Vial) Insulin NPH Isophane (ทAน1)",
    "strength": "1000unit/10ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-036",
    "name": "(Vial) REGULAR Insulin (ทAน1)",
    "generic_name": "(Vial) REGULAR Insulin (ทAน1)",
    "strength": "1000unit/10ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-037",
    "name": "(ซอง) ACETYLCYSTEINE (ทBน2) -NED",
    "generic_name": "(ซอง) ACETYLCYSTEINE (ทBน2) -NED",
    "strength": "100mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-038",
    "name": "(ซาลาซีน)Sulfa SALA zine (ทB,D at term)",
    "generic_name": "(ซาลาซีน)Sulfa SALA zine (ทB,D at term)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-039",
    "name": "(บีโรดูออล) BERODUAL MDI  200 doses(ทBน2)",
    "generic_name": "(บีโรดูออล) BERODUAL MDI  200 doses(ทBน2)",
    "strength": "50 mcg/1 dose + 20 mcg/1 dose",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-040",
    "name": "(ปากกา) Insulin Mixtard 70:30 (ทAน1)",
    "generic_name": "(ปากกา) Insulin Mixtard 70:30 (ทAน1)",
    "strength": "70:30-300unit/3ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-041",
    "name": "(ปากกา) Insulin NPH isophan-300 unit (ทAน1)",
    "generic_name": "(ปากกา) Insulin NPH isophan-300 unit (ทAน1)",
    "strength": "300unit/3ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-042",
    "name": "(ป้าย) Lidocaine viscous",
    "generic_name": "(ป้าย) Lidocaine viscous",
    "strength": "5 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-043",
    "name": "(มิเนอรา)ORSสำหรับเด็ก",
    "generic_name": "(มิเนอรา)ORSสำหรับเด็ก",
    "strength": "3.375g375r",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-044",
    "name": "(ยาARV) Simvastatin (ทX,น5,C30)",
    "generic_name": "(ยาARV) Simvastatin (ทX,น5,C30)",
    "strength": "10 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-045",
    "name": "(ยาคุมชนิดฉีด) Depot Medroxyprogesterone Acetate-DMPA INJ",
    "generic_name": "(ยาคุมชนิดฉีด) Depot Medroxyprogesterone Acetate-DMPA INJ",
    "strength": "150MG3ML",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-046",
    "name": "(ยาคุมเม็ด) R-den  (EE0.03+LEVO.15) (ทXน3)",
    "generic_name": "(ยาคุมเม็ด) R-den  (EE0.03+LEVO.15) (ทXน3)",
    "strength": "0.30.15",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-047",
    "name": "(ยาน้ำ) Cetirizine syrup",
    "generic_name": "(ยาน้ำ) Cetirizine syrup",
    "strength": "5mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-048",
    "name": "(ยี่สิบ) Morphine sulfate (KAPANOL) capsule",
    "generic_name": "(ยี่สิบ) Morphine sulfate (KAPANOL) capsule",
    "strength": "20 mg",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-049",
    "name": "(สามสิบ) MORPHINE SULPHATE TAB (ทDน3 C30)",
    "generic_name": "(สามสิบ) MORPHINE SULPHATE TAB (ทDน3 C30)",
    "strength": "30mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-050",
    "name": "(สิบ) MORPHINE SULPHATE TAB (ทDน3,C60)",
    "generic_name": "(สิบ) MORPHINE SULPHATE TAB (ทDน3,C60)",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-051",
    "name": "(อมใต้ลิ้น)ISOSORBIDE DINITRATE (ทC,น23)",
    "generic_name": "(อมใต้ลิ้น)ISOSORBIDE DINITRATE (ทC,น23)",
    "strength": "5mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-052",
    "name": "0.02%TRIAMCINOLONE cream (ทCน3)",
    "generic_name": "0.02%TRIAMCINOLONE cream (ทCน3)",
    "strength": "20 mg/100 g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-053",
    "name": "0.1%WV TRIAMCINOLONE lotion (ทCน3)",
    "generic_name": "0.1%WV TRIAMCINOLONE lotion (ทCน3)",
    "strength": "30 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-054",
    "name": "0.9% NaCl (NSS)  INJ 500 ML",
    "generic_name": "0.9% NaCl (NSS)  INJ 500 ML",
    "strength": "900mg/100ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-055",
    "name": "0.9% NaCl (NSS) INJ 100 ML",
    "generic_name": "0.9% NaCl (NSS) INJ 100 ML",
    "strength": "900mg/100ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-056",
    "name": "0.9% NaCl (NSS) INJ 1000 ML",
    "generic_name": "0.9% NaCl (NSS) INJ 1000 ML",
    "strength": "900mg/100 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-057",
    "name": "1% Lidociane+Adrenaline INJ 1ml",
    "generic_name": "1% Lidociane+Adrenaline INJ 1ml",
    "strength": "10mg0.01mg",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-058",
    "name": "1.5MUvial Streptokinase INJ (ทCน3)",
    "generic_name": "1.5MUvial Streptokinase INJ (ทCน3)",
    "strength": "1.5 MU",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-059",
    "name": "10 % UREA cream 30 gm",
    "generic_name": "10 % UREA cream 30 gm",
    "strength": "10 gm per 100 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-060",
    "name": "10 ml-0.5% Bupivacaine Injec (MARCAINE)",
    "generic_name": "10 ml-0.5% Bupivacaine Injec (MARCAINE)",
    "strength": "50 mg/10 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-061",
    "name": "10%(MgSo4) MAGNESIUM Sulphate 1gm10ml (ทAน1)",
    "generic_name": "10%(MgSo4) MAGNESIUM Sulphate 1gm10ml (ทAน1)",
    "strength": "100mg1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-062",
    "name": "100mcg-2ml FENTANYL CITRATE INJ (ทD,น1)",
    "generic_name": "100mcg-2ml FENTANYL CITRATE INJ (ทD,น1)",
    "strength": "50mcgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-063",
    "name": "10mg-1ml VITAMIN K1 INJ (ทAน1) (PHYTOMENADIONE)",
    "generic_name": "10mg-1ml VITAMIN K1 INJ (ทAน1) (PHYTOMENADIONE)",
    "strength": "10mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-064",
    "name": "15 gm-Nitrofurazone cream-NED",
    "generic_name": "15 gm-Nitrofurazone cream-NED",
    "strength": "2% WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-065",
    "name": "1mg-0.5 ml VITAMIN K1 INJ (ทAน1) (PHYTOMENADIONE)",
    "generic_name": "1mg-0.5 ml VITAMIN K1 INJ (ทAน1) (PHYTOMENADIONE)",
    "strength": "2 mg/1 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-066",
    "name": "1mg-Varenicline-โครงการฯ (28เม็ด) Maintenence",
    "generic_name": "1mg-Varenicline-โครงการฯ (28เม็ด) Maintenence",
    "strength": "1 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-067",
    "name": "2% Lidocaine INJ 1 ml (ทAน2)",
    "generic_name": "2% Lidocaine INJ 1 ml (ทAน2)",
    "strength": "2 gm100 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-068",
    "name": "20mg-2ml FUROSEMIDE INJ (ทCน2)",
    "generic_name": "20mg-2ml FUROSEMIDE INJ (ทCน2)",
    "strength": "10mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-069",
    "name": "20ml-0.5% Bupivacaine  Injection (MARCAINE)",
    "generic_name": "20ml-0.5% Bupivacaine  Injection (MARCAINE)",
    "strength": "5mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-070",
    "name": "25 gm-SILVER SULFADIAZINE CREAM (ทBน3)",
    "generic_name": "25 gm-SILVER SULFADIAZINE CREAM (ทBน3)",
    "strength": "1 %WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-071",
    "name": "25000IU-5ml HEPARIN INJ (ทAน1)",
    "generic_name": "25000IU-5ml HEPARIN INJ (ทAน1)",
    "strength": "5000 IUml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-072",
    "name": "250mg-25ml FUROSEMIDE INJ (ทCน2)",
    "generic_name": "250mg-25ml FUROSEMIDE INJ (ทCน2)",
    "strength": "10 mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-073",
    "name": "3% NaCl Sodium Chloride INJ 500 ml",
    "generic_name": "3% NaCl Sodium Chloride INJ 500 ml",
    "strength": "3% NaCl",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-074",
    "name": "30 ml Povidone iodine Solution10%(Betadine) (ทD)",
    "generic_name": "30 ml Povidone iodine Solution10%(Betadine) (ทD)",
    "strength": "30 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-075",
    "name": "3ปี (IMPLANO) Etonorgestrel Implant",
    "generic_name": "3ปี (IMPLANO) Etonorgestrel Implant",
    "strength": "68 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-076",
    "name": "450 gm-Nitrofurazone 2% WW cream-NED",
    "generic_name": "450 gm-Nitrofurazone 2% WW cream-NED",
    "strength": "2% WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-077",
    "name": "450 gm-SILVER SULFADIAZINE1%CREAM (ทBน3)",
    "generic_name": "450 gm-SILVER SULFADIAZINE1%CREAM (ทBน3)",
    "strength": "1% WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-078",
    "name": "450 gm. Betamethasone+Salisylic acid (กระปุก)",
    "generic_name": "450 gm. Betamethasone+Salisylic acid (กระปุก)",
    "strength": "0.13% WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-079",
    "name": "450 ml Povidone iodine Solution10%(Betadine) (ทD)",
    "generic_name": "450 ml Povidone iodine Solution10%(Betadine) (ทD)",
    "strength": "10%WV",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-080",
    "name": "4ml-0.5% Bupivacaine (MARCAIN-SPINAL HEAVY)",
    "generic_name": "4ml-0.5% Bupivacaine (MARCAIN-SPINAL HEAVY)",
    "strength": "5mgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-081",
    "name": "5 gm BETAMETHAZONE cream 5 gm (ทCทD1น2)",
    "generic_name": "5 gm BETAMETHAZONE cream 5 gm (ทCทD1น2)",
    "strength": "3% WW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-082",
    "name": "50%(MgSo4) MAGNESIUM Sulphate 1gm-2ml (ทAน1)",
    "generic_name": "50%(MgSo4) MAGNESIUM Sulphate 1gm-2ml (ทAน1)",
    "strength": "500mg1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-083",
    "name": "50%W-V GLUCOSE INJ 50 ml (25GM)",
    "generic_name": "50%W-V GLUCOSE INJ 50 ml (25GM)",
    "strength": "50 gm100ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-084",
    "name": "5ปี (JADELLE) Levonorgestrel Implant",
    "generic_name": "5ปี (JADELLE) Levonorgestrel Implant",
    "strength": "75mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-085",
    "name": "600mg-4ml Clindamycin  inj (ทAน1)",
    "generic_name": "600mg-4ml Clindamycin  inj (ทAน1)",
    "strength": "600 mg4ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-086",
    "name": "7.5% SODIUM BICARBONATE  50 ml INJ (ทBน3)",
    "generic_name": "7.5% SODIUM BICARBONATE  50 ml INJ (ทBน3)",
    "strength": "7.5g100 mL",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-087",
    "name": "ABACAVIR TAB (ทDน4)",
    "generic_name": "ABACAVIR TAB (ทDน4)",
    "strength": "300 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-088",
    "name": "ACETYLCYSTEINE INJ (ทBน2)",
    "generic_name": "ACETYLCYSTEINE INJ (ทBน2)",
    "strength": "300mg3ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-089",
    "name": "ACTIVATED CHARCOAL POWDER",
    "generic_name": "ACTIVATED CHARCOAL POWDER",
    "strength": "50 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-090",
    "name": "ACYCLOVIR CREAM NED",
    "generic_name": "ACYCLOVIR CREAM NED",
    "strength": "5g100g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-091",
    "name": "ACYCLOVIR TAB (ทAน1,C25)",
    "generic_name": "ACYCLOVIR TAB (ทAน1,C25)",
    "strength": "200mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-092",
    "name": "ADRENALINE (1:1,000) INJ (ทDน3)",
    "generic_name": "ADRENALINE (1:1,000) INJ (ทDน3)",
    "strength": "1mgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-093",
    "name": "ALBENDAZOLE TAB(ทAน2)",
    "generic_name": "ALBENDAZOLE TAB(ทAน2)",
    "strength": "200mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-094",
    "name": "ALCOHOL 450 ml",
    "generic_name": "ALCOHOL 450 ml",
    "strength": "70%",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-095",
    "name": "ALENDRONATE TAB (ทcน3,C35) (ง)",
    "generic_name": "ALENDRONATE TAB (ทcน3,C35) (ง)",
    "strength": "70 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-096",
    "name": "ALUMINIUM HYDROXIDE TAB(ทB)",
    "generic_name": "ALUMINIUM HYDROXIDE TAB(ทB)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-097",
    "name": "AMIODARONE INJ (CORDARONE) (ทDน5)",
    "generic_name": "AMIODARONE INJ (CORDARONE) (ทDน5)",
    "strength": "150 mg3 ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-098",
    "name": "AMPHOTERICIN B  INJ (C10)",
    "generic_name": "AMPHOTERICIN B  INJ (C10)",
    "strength": "50mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-099",
    "name": "AMPICILLIN INJ (ทD1น1,C30)",
    "generic_name": "AMPICILLIN INJ (ทD1น1,C30)",
    "strength": "1gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-100",
    "name": "AMPICILLIN INJ (ทD1น1C30)",
    "generic_name": "AMPICILLIN INJ (ทD1น1C30)",
    "strength": "500mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-101",
    "name": "ANORO ELLIPTA DPI 62.5/25 MCG 30 Dose",
    "generic_name": "ANORO ELLIPTA DPI 62.5/25 MCG 30 Dose",
    "strength": "62.5 mcg/1 dose + 25 mcg/1 dose",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-102",
    "name": "ANTACID TAB-ยาลดกรด (ทCน2)",
    "generic_name": "ANTACID TAB-ยาลดกรด (ทCน2)",
    "strength": "250mg100mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-103",
    "name": "ARTIFICIAL TEARS (น้ำตาเทียม)",
    "generic_name": "ARTIFICIAL TEARS (น้ำตาเทียม)",
    "strength": "500 mg/100 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-104",
    "name": "ASPIRIN  TAB (ทA,D13น3)",
    "generic_name": "ASPIRIN  TAB (ทA,D13น3)",
    "strength": "300mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-105",
    "name": "ATROPINE INJ  (ทBน2)",
    "generic_name": "ATROPINE INJ  (ทBน2)",
    "strength": "0.6mg1ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-106",
    "name": "Abacavir + Lamivudine",
    "generic_name": "Abacavir + Lamivudine",
    "strength": "600+300",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-107",
    "name": "Acyclovir TAB (ทAน1,C50)",
    "generic_name": "Acyclovir TAB (ทAน1,C50)",
    "strength": "800 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-108",
    "name": "Adenosine (ADENOCOR)  INJ.",
    "generic_name": "Adenosine (ADENOCOR)  INJ.",
    "strength": "6mg2ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-109",
    "name": "Albendazole  susp.  100 mg5 ml -20 ml (ทAน2)",
    "generic_name": "Albendazole  susp.  100 mg5 ml -20 ml (ทAน2)",
    "strength": "100 mg5ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-110",
    "name": "Alcohol 70%  60 ml",
    "generic_name": "Alcohol 70%  60 ml",
    "strength": "70ml100ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-111",
    "name": "Alfacalcidol CAP",
    "generic_name": "Alfacalcidol CAP",
    "strength": "0.25 mcg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-112",
    "name": "Alfuzosin XL TAB",
    "generic_name": "Alfuzosin XL TAB",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-113",
    "name": "Allopurinol  TAB (ทCน3,G60)",
    "generic_name": "Allopurinol  TAB (ทCน3,G60)",
    "strength": "300 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-114",
    "name": "Allopurinol TAB (ทCน3,G60)",
    "generic_name": "Allopurinol TAB (ทCน3,G60)",
    "strength": "100mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-115",
    "name": "Alteplase(rtPA) INJ",
    "generic_name": "Alteplase(rtPA) INJ",
    "strength": "50 mg",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-116",
    "name": "AmiTRIPTYLINE TAB (ทBน3)",
    "generic_name": "AmiTRIPTYLINE TAB (ทBน3)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-117",
    "name": "Amoxicillin CAP (ทAน1C10)",
    "generic_name": "Amoxicillin CAP (ทAน1C10)",
    "strength": "250mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-118",
    "name": "Amoxicillin CAP(ทAน1C10)",
    "generic_name": "Amoxicillin CAP(ทAน1C10)",
    "strength": "500mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-119",
    "name": "Amoxicillin Syrup -60ml",
    "generic_name": "Amoxicillin Syrup -60ml",
    "strength": "125mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-121",
    "name": "Amoxicillin-CLAVulanate -70 mL",
    "generic_name": "Amoxicillin-CLAVulanate -70 mL",
    "strength": "400 mg/5 mL + 57 mg/5 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-122",
    "name": "Amoxicillin-CLAVulanate 1gm TAB (ทAน3C30)",
    "generic_name": "Amoxicillin-CLAVulanate 1gm TAB (ทAน3C30)",
    "strength": "875125mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-123",
    "name": "Amoxicillin-CLAVulanate INJ (ทAน3C30)",
    "generic_name": "Amoxicillin-CLAVulanate INJ (ทAน3C30)",
    "strength": "1.2 gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-124",
    "name": "Antirabies vaccine INJ. -ERIG 400 u./2 ml-ED",
    "generic_name": "Antirabies vaccine INJ. -ERIG 400 u./2 ml-ED",
    "strength": "400 u./2 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-125",
    "name": "Aspirin TAB (ทA,D13น3)",
    "generic_name": "Aspirin TAB (ทA,D13น3)",
    "strength": "81mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-126",
    "name": "Atorvastatin TAB (ง)(ทX)",
    "generic_name": "Atorvastatin TAB (ง)(ทX)",
    "strength": "40mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-127",
    "name": "Atracurium besylate .-INJ",
    "generic_name": "Atracurium besylate .-INJ",
    "strength": "50 mg5 ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-128",
    "name": "Azithromycin capsule (ทAน1,G10)",
    "generic_name": "Azithromycin capsule (ทAน1,G10)",
    "strength": "250 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-129",
    "name": "BACLOFEN TAB (C30)",
    "generic_name": "BACLOFEN TAB (C30)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-130",
    "name": "BCG (vaccine)",
    "generic_name": "BCG (vaccine)",
    "strength": "200000 cfuamp",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-131",
    "name": "BENZATHINE penicillin G  INJ (ทฺAน1)",
    "generic_name": "BENZATHINE penicillin G  INJ (ทฺAน1)",
    "strength": "1.2 MU",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-132",
    "name": "BENZYL BENZOATE-60 ml",
    "generic_name": "BENZYL BENZOATE-60 ml",
    "strength": "25g100ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-133",
    "name": "BETAMETHASONE+SALICYLIC ACID(ทBน2)-5 GM",
    "generic_name": "BETAMETHASONE+SALICYLIC ACID(ทBน2)-5 GM",
    "strength": "0.13 g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-134",
    "name": "Betahistine TAB (ท3น3)",
    "generic_name": "Betahistine TAB (ท3น3)",
    "strength": "6mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-135",
    "name": "Budesonide MDI 200 dose (ทAน2)",
    "generic_name": "Budesonide MDI 200 dose (ทAน2)",
    "strength": "200mcgpuff",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-136",
    "name": "CAFERGOT TAB (ทX,น5,C60)",
    "generic_name": "CAFERGOT TAB (ทX,น5,C60)",
    "strength": "100 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-137",
    "name": "CALCIUM CARBONATE (ทAน1)",
    "generic_name": "CALCIUM CARBONATE (ทAน1)",
    "strength": "600mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-138",
    "name": "CALCIUM GLUCONATE  10 ML (1GM) (ทCน3)",
    "generic_name": "CALCIUM GLUCONATE  10 ML (1GM) (ทCน3)",
    "strength": "10%WV",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-139",
    "name": "CAPTOPRIL TAB (C50)",
    "generic_name": "CAPTOPRIL TAB (C50)",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-140",
    "name": "CARBAMAZEPINE TAB (ทBน1)",
    "generic_name": "CARBAMAZEPINE TAB (ทBน1)",
    "strength": "200mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-141",
    "name": "CEPHALEXIN syrup 60ml",
    "generic_name": "CEPHALEXIN syrup 60ml",
    "strength": "125mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-142",
    "name": "CETIRIZINE TAB -ยาแก้แพ้(ทBน2)",
    "generic_name": "CETIRIZINE TAB -ยาแก้แพ้(ทBน2)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-143",
    "name": "CHLORHEXIDINE บ้วนปาก Mount Wash 180 ML",
    "generic_name": "CHLORHEXIDINE บ้วนปาก Mount Wash 180 ML",
    "strength": "120 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-144",
    "name": "CHLOROQUIN TAB(ทBน1,C10)",
    "generic_name": "CHLOROQUIN TAB(ทBน1,C10)",
    "strength": "250mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-145",
    "name": "CHLORPROMAZINE INJ(ทAน3)",
    "generic_name": "CHLORPROMAZINE INJ(ทAน3)",
    "strength": "50 mg2 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-146",
    "name": "CIPROfloxacin TAB (ทCน4C50)",
    "generic_name": "CIPROfloxacin TAB (ทCน4C50)",
    "strength": "250mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-147",
    "name": "CLARItrhomycin  TAB(ทC,C10)",
    "generic_name": "CLARItrhomycin  TAB(ทC,C10)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-148",
    "name": "CLOBETASOL 0.05% CREAM.",
    "generic_name": "CLOBETASOL 0.05% CREAM.",
    "strength": "5 GM",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-149",
    "name": "CLOPIDOGREL TAB (ยาCL)",
    "generic_name": "CLOPIDOGREL TAB (ยาCL)",
    "strength": "75mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-150",
    "name": "CLOTRIMAZOLE 1% cream 5 gm",
    "generic_name": "CLOTRIMAZOLE 1% cream 5 gm",
    "strength": "1g100g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-151",
    "name": "CLOTRIMAZOLE Troche (ทAน1)",
    "generic_name": "CLOTRIMAZOLE Troche (ทAน1)",
    "strength": "10 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-152",
    "name": "CLOTRIMAZOLE Vaginal Suppository",
    "generic_name": "CLOTRIMAZOLE Vaginal Suppository",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-153",
    "name": "COLCHICINE TAB (ทAน2C30)",
    "generic_name": "COLCHICINE TAB (ทAน2C30)",
    "strength": "0.6mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-154",
    "name": "COMBID-Zilavir (3TC+AZT) TAB (ทCน4)",
    "generic_name": "COMBID-Zilavir (3TC+AZT) TAB (ทCน4)",
    "strength": "150/300",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-155",
    "name": "COTRIMOXAZOLE Susp. 60 ml (20040)",
    "generic_name": "COTRIMOXAZOLE Susp. 60 ml (20040)",
    "strength": "20040",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-156",
    "name": "COTRIMOXAZOLE TAB (ทD,น3,C10)",
    "generic_name": "COTRIMOXAZOLE TAB (ทD,น3,C10)",
    "strength": "400mg80mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-157",
    "name": "CPM-ChlorpheniramineSyrup 60 ml",
    "generic_name": "CPM-ChlorpheniramineSyrup 60 ml",
    "strength": "2mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-158",
    "name": "CPM4-Chlorpheniramine TAB (ทAน3)",
    "generic_name": "CPM4-Chlorpheniramine TAB (ทAน3)",
    "strength": "4mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-159",
    "name": "Carbetocin inj  NED (สูติ-ANES)-N3",
    "generic_name": "Carbetocin inj  NED (สูติ-ANES)-N3",
    "strength": "100 mcgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-160",
    "name": "Carvedilol  TAB(ทDน2)",
    "generic_name": "Carvedilol  TAB(ทDน2)",
    "strength": "6.25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-161",
    "name": "Cisatracurium Besylate",
    "generic_name": "Cisatracurium Besylate",
    "strength": "10 mg5 ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-162",
    "name": "Clindamycin Capsule (ทAน1)",
    "generic_name": "Clindamycin Capsule (ทAน1)",
    "strength": "300mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-163",
    "name": "Colistin INJ (ทCน2,C50)-บช.ง",
    "generic_name": "Colistin INJ (ทCน2,C50)-บช.ง",
    "strength": "150 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-164",
    "name": "Conjugated Estrogens (PREMARIN) (ทXน2)",
    "generic_name": "Conjugated Estrogens (PREMARIN) (ทXน2)",
    "strength": "0.625mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-165",
    "name": "Cytisinicilne",
    "generic_name": "Cytisinicilne",
    "strength": "1.5 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-166",
    "name": "D-10-N2 1000 ML INJ",
    "generic_name": "D-10-N2 1000 ML INJ",
    "strength": "10% dextros 0.45% NaCl",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-167",
    "name": "D-5-N2  1000 ML INJ",
    "generic_name": "D-5-N2  1000 ML INJ",
    "strength": "5 g/100 mL + 450 mg/100 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-168",
    "name": "D-5-N2  500 ML INJ",
    "generic_name": "D-5-N2  500 ML INJ",
    "strength": "d-5-12s",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-169",
    "name": "D-5-N3  500 ml INJ",
    "generic_name": "D-5-N3  500 ml INJ",
    "strength": "5 g/100 mL + 300 mg/100 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-170",
    "name": "D-5-N5  500 ml INJ",
    "generic_name": "D-5-N5  500 ml INJ",
    "strength": "5 g/100 mL + 180 mg/100 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-171",
    "name": "D-5-NSS  1000 ML INJ",
    "generic_name": "D-5-NSS  1000 ML INJ",
    "strength": "5%dextrose 0.9%NaCl",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-172",
    "name": "D-5-W   500 ml INJ",
    "generic_name": "D-5-W   500 ml INJ",
    "strength": "50 g/100 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-173",
    "name": "D-5-W 100 ml INJ",
    "generic_name": "D-5-W 100 ml INJ",
    "strength": "5 g/100 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-174",
    "name": "D-5-W 1000 ml INJ",
    "generic_name": "D-5-W 1000 ml INJ",
    "strength": "1000",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-175",
    "name": "D-5-W 250 ml INJ",
    "generic_name": "D-5-W 250 ml INJ",
    "strength": "5g100ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-176",
    "name": "DAPSONE (ทฺBน3)",
    "generic_name": "DAPSONE (ทฺBน3)",
    "strength": "100mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-177",
    "name": "DEFERIPRONE TAB(ง)(ทDน4)",
    "generic_name": "DEFERIPRONE TAB(ง)(ทDน4)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-178",
    "name": "DEPAKINE CHRONO-SODIUM VALPROATE TAB (ทDน3)",
    "generic_name": "DEPAKINE CHRONO-SODIUM VALPROATE TAB (ทDน3)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-179",
    "name": "DEXTRAN 40 -1000ml INJ",
    "generic_name": "DEXTRAN 40 -1000ml INJ",
    "strength": "10%+0.9%",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-180",
    "name": "DEXTROmethophan TAB (ทAน1)",
    "generic_name": "DEXTROmethophan TAB (ทAน1)",
    "strength": "15mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-181",
    "name": "DIACEREIN CAP (N3)-NED",
    "generic_name": "DIACEREIN CAP (N3)-NED",
    "strength": "50 MG",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-182",
    "name": "DIAZEPAM INJ  (ทDน3)",
    "generic_name": "DIAZEPAM INJ  (ทDน3)",
    "strength": "10 mg2 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-183",
    "name": "DIAZEPAM TAB (ทD,น3)",
    "generic_name": "DIAZEPAM TAB (ทD,น3)",
    "strength": "2 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-185",
    "name": "DIGOXIN INJ (ทAน1,C60)",
    "generic_name": "DIGOXIN INJ (ทAน1,C60)",
    "strength": "0.5 mg2 ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-186",
    "name": "DIGOXIN TAB (ทAน1,C60)",
    "generic_name": "DIGOXIN TAB (ทAน1,C60)",
    "strength": "0.25mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-187",
    "name": "DIPOTASSIUM chloraZEPATE CAP (ทDน4)",
    "generic_name": "DIPOTASSIUM chloraZEPATE CAP (ทDน4)",
    "strength": "5 mg",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-188",
    "name": "DImenHYDRINATE  INJ (ทAน2)",
    "generic_name": "DImenHYDRINATE  INJ (ทAน2)",
    "strength": "50mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-189",
    "name": "DImenHYDRINATE TAB (ทAน2)",
    "generic_name": "DImenHYDRINATE TAB (ทAน2)",
    "strength": "50mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-190",
    "name": "DOBUTamine INJ  (ทC,น2)",
    "generic_name": "DOBUTamine INJ  (ทC,น2)",
    "strength": "250mg20ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-191",
    "name": "DOMPERIDONE Susp. (ทCน4)-30ml",
    "generic_name": "DOMPERIDONE Susp. (ทCน4)-30ml",
    "strength": "1mg/1ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-192",
    "name": "DOMPERIDONE TAB (ทCน4)",
    "generic_name": "DOMPERIDONE TAB (ทCน4)",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-193",
    "name": "DOPamine  (ทฺBน2)",
    "generic_name": "DOPamine  (ทฺBน2)",
    "strength": "250 mg10 ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-194",
    "name": "DOXYCYCLINE CAP (ทxน1)",
    "generic_name": "DOXYCYCLINE CAP (ทxน1)",
    "strength": "100mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-195",
    "name": "DTP vaccine",
    "generic_name": "DTP vaccine",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-196",
    "name": "Dapagliflozin 10 mg.(N3)",
    "generic_name": "Dapagliflozin 10 mg.(N3)",
    "strength": "10 mg.",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-197",
    "name": "Dexamethasone+Neomycin eye drop-4 ml",
    "generic_name": "Dexamethasone+Neomycin eye drop-4 ml",
    "strength": "100500",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-198",
    "name": "Diclofenac tab (ทD น3, G60)",
    "generic_name": "Diclofenac tab (ทD น3, G60)",
    "strength": "25mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-199",
    "name": "Dicloxacillin  CAP(ทAน1)",
    "generic_name": "Dicloxacillin  CAP(ทAน1)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-200",
    "name": "Dicloxacillin CAP(ทAน1)",
    "generic_name": "Dicloxacillin CAP(ทAน1)",
    "strength": "250mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-201",
    "name": "DilTiazem INJ (ทBน2)-NED",
    "generic_name": "DilTiazem INJ (ทBน2)-NED",
    "strength": "10mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-202",
    "name": "Ditapp(Topamine) 2mg,5mg-5ml syrup-60ml-NED",
    "generic_name": "Ditapp(Topamine) 2mg,5mg-5ml syrup-60ml-NED",
    "strength": "52mg",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-203",
    "name": "Ditapp(Topamine) Tab (ทDน2)-NED",
    "generic_name": "Ditapp(Topamine) Tab (ทDน2)-NED",
    "strength": "4mg10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-204",
    "name": "Dolutegravir TAB-DTG(ทD,น3)",
    "generic_name": "Dolutegravir TAB-DTG(ทD,น3)",
    "strength": "50 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-205",
    "name": "Doproct suppository (ทCน2)",
    "generic_name": "Doproct suppository (ทCน2)",
    "strength": "1g100g50",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-206",
    "name": "Doxazosin (ทDน4)",
    "generic_name": "Doxazosin (ทDน4)",
    "strength": "4 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-207",
    "name": "EFAVIRENZ TAB (ทBน5)",
    "generic_name": "EFAVIRENZ TAB (ทBน5)",
    "strength": "600 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-208",
    "name": "ENAlapril TAB (ทDน2,C30)",
    "generic_name": "ENAlapril TAB (ทDน2,C30)",
    "strength": "5mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-209",
    "name": "EPHEDRINE INJ (ทC)",
    "generic_name": "EPHEDRINE INJ (ทC)",
    "strength": "30mg\\ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-210",
    "name": "EPIAO-epoetin alpha INJ  (ทC),จ",
    "generic_name": "EPIAO-epoetin alpha INJ  (ทC),จ",
    "strength": "4000IUML",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-211",
    "name": "ERYTROMYCIN 60 ml (ทAน3)",
    "generic_name": "ERYTROMYCIN 60 ml (ทAน3)",
    "strength": "125mg5ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-212",
    "name": "ESPOGEN-epoetin alpha (c)(N4) INJ  (ทC),จ",
    "generic_name": "ESPOGEN-epoetin alpha (c)(N4) INJ  (ทC),จ",
    "strength": "4000IU1ML",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-213",
    "name": "ETHAMBUTOL  TAB (ทAน2,C30)",
    "generic_name": "ETHAMBUTOL  TAB (ทAน2,C30)",
    "strength": "400mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-214",
    "name": "Elixir(KCl)Potassium Cl (ทAน1)",
    "generic_name": "Elixir(KCl)Potassium Cl (ทAน1)",
    "strength": "40mEq30ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-215",
    "name": "EnaLaPril TAB  (ทDน2,C30)",
    "generic_name": "EnaLaPril TAB  (ทDน2,C30)",
    "strength": "20mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-216",
    "name": "Enoxaparin INJ (C30)",
    "generic_name": "Enoxaparin INJ (C30)",
    "strength": "40mg0.4ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-218",
    "name": "Entecavir 0.5 mg (BARACLUDE)-พ",
    "generic_name": "Entecavir 0.5 mg (BARACLUDE)-พ",
    "strength": "0.5 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-219",
    "name": "Ethambutol (ทAน2,C30)",
    "generic_name": "Ethambutol (ทAน2,C30)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-220",
    "name": "Etomidate 20 mg-10 mL (ง)",
    "generic_name": "Etomidate 20 mg-10 mL (ง)",
    "strength": "2mgml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-221",
    "name": "Etoricoxib (N3)  (Arcoxia) (ทCน2,C30) Tab-NED",
    "generic_name": "Etoricoxib (N3)  (Arcoxia) (ทCน2,C30) Tab-NED",
    "strength": "60mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-222",
    "name": "Ezetimibe TAB NED",
    "generic_name": "Ezetimibe TAB NED",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-223",
    "name": "FAMOTIDINE TAB (ทAน2,C60)",
    "generic_name": "FAMOTIDINE TAB (ทAน2,C60)",
    "strength": "20 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-224",
    "name": "FAVIPIRAVIR TAB (ทC1,น3)",
    "generic_name": "FAVIPIRAVIR TAB (ทC1,น3)",
    "strength": "200 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-225",
    "name": "FERROUS FUMARATE TAB (ทAน2)",
    "generic_name": "FERROUS FUMARATE TAB (ทAน2)",
    "strength": "200mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-226",
    "name": "FLUCONAZOLE Cap(ทDน1,C50)",
    "generic_name": "FLUCONAZOLE Cap(ทDน1,C50)",
    "strength": "200mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-227",
    "name": "FLUoxETINE (ทDน4) Capsule",
    "generic_name": "FLUoxETINE (ทDน4) Capsule",
    "strength": "20mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-228",
    "name": "FLUphenazine DECanoate INJ",
    "generic_name": "FLUphenazine DECanoate INJ",
    "strength": "25 mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-229",
    "name": "FOLIC ACID TAB(ทAน1)",
    "generic_name": "FOLIC ACID TAB(ทAน1)",
    "strength": "5mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-230",
    "name": "FUROSEMIDE TAB (ทCน2)",
    "generic_name": "FUROSEMIDE TAB (ทCน2)",
    "strength": "40mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-231",
    "name": "FUROSEMIDE TAB(ทCน2)",
    "generic_name": "FUROSEMIDE TAB(ทCน2)",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-232",
    "name": "Fenofibrate Capsule(ทC,C30)",
    "generic_name": "Fenofibrate Capsule(ทC,C30)",
    "strength": "100mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-233",
    "name": "Ferrous Fumarate DROP (Iron 25mg/1ml)-15 ml",
    "generic_name": "Ferrous Fumarate DROP (Iron 25mg/1ml)-15 ml",
    "strength": "15mg0.6ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-234",
    "name": "Finasteride (บัญชี ง)",
    "generic_name": "Finasteride (บัญชี ง)",
    "strength": "5 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-235",
    "name": "Formaldehyde(FORMALIN) 450 ML",
    "generic_name": "Formaldehyde(FORMALIN) 450 ML",
    "strength": "37g\\100ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-236",
    "name": "GABAPENTIN  CAP (ทCน3,C50) (ง)",
    "generic_name": "GABAPENTIN  CAP (ทCน3,C50) (ง)",
    "strength": "100 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-238",
    "name": "GARDASIL-9(HPV-9สายพันธุ์)",
    "generic_name": "GARDASIL-9(HPV-9สายพันธุ์)",
    "strength": "0.5 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-239",
    "name": "GEMFIBROZIL (ทCน3C50)",
    "generic_name": "GEMFIBROZIL (ทCน3C50)",
    "strength": "600mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-240",
    "name": "GENTAMICIN INJ ( ทDน2,C60)",
    "generic_name": "GENTAMICIN INJ ( ทDน2,C60)",
    "strength": "80mg2ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-241",
    "name": "GLIpiZIDE TAB(ทCน2,G15)",
    "generic_name": "GLIpiZIDE TAB(ทCน2,G15)",
    "strength": "5mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-242",
    "name": "GPO Vir-T (Teevir) (EFV+FTC+TDF) TAB",
    "generic_name": "GPO Vir-T (Teevir) (EFV+FTC+TDF) TAB",
    "strength": "600200300",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-243",
    "name": "GRISEOFULVIN TAB (ทX,น4)",
    "generic_name": "GRISEOFULVIN TAB (ทX,น4)",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-244",
    "name": "Gardasil-HPV(4สายพันธ์)",
    "generic_name": "Gardasil-HPV(4สายพันธ์)",
    "strength": "0.5 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-245",
    "name": "Glucosamine sulfate (N3)  Powder",
    "generic_name": "Glucosamine sulfate (N3)  Powder",
    "strength": "1.5 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-246",
    "name": "Glycopyrronium bromide",
    "generic_name": "Glycopyrronium bromide",
    "strength": "200 mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-247",
    "name": "Guaifenesine Syr. 60ml (ทA,น2)",
    "generic_name": "Guaifenesine Syr. 60ml (ทA,น2)",
    "strength": "100mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-248",
    "name": "Guaifenesine Tab (ทA,น2)",
    "generic_name": "Guaifenesine Tab (ทA,น2)",
    "strength": "100mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-249",
    "name": "HALOPERIDOL INJ (ทCน4)",
    "generic_name": "HALOPERIDOL INJ (ทCน4)",
    "strength": "5mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-250",
    "name": "HBV-Hepatitis B  vaccine-1 ml (ชำระเงินทุกสิทธิ์)",
    "generic_name": "HBV-Hepatitis B  vaccine-1 ml (ชำระเงินทุกสิทธิ์)",
    "strength": "20mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-251",
    "name": "HCTZ (ลดความดันโลหิต) hydroCHLOROthiazide (ทBน1,C10)",
    "generic_name": "HCTZ (ลดความดันโลหิต) hydroCHLOROthiazide (ทBน1,C10)",
    "strength": "25 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-252",
    "name": "HEMA-PLUS-epoetin alfa (N4) (ทC),จ",
    "generic_name": "HEMA-PLUS-epoetin alfa (N4) (ทC),จ",
    "strength": "4000IUML",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-253",
    "name": "HPV-papilomavirus vaccine(human t16,18)",
    "generic_name": "HPV-papilomavirus vaccine(human t16,18)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-254",
    "name": "HYDROCORTISONE INJ (ทDน2) Powder",
    "generic_name": "HYDROCORTISONE INJ (ทDน2) Powder",
    "strength": "100mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-255",
    "name": "HYDROGEN PEROXIDE 450 ml",
    "generic_name": "HYDROGEN PEROXIDE 450 ml",
    "strength": "6g\\100ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-256",
    "name": "HYOSCINE INJ (ทBน2)-30 ml",
    "generic_name": "HYOSCINE INJ (ทBน2)-30 ml",
    "strength": "20mg1ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-257",
    "name": "HYOSCINE TAB (ทB,น2)",
    "generic_name": "HYOSCINE TAB (ทB,น2)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-258",
    "name": "HYOSCINE syrup 30 ml (ทBน2)",
    "generic_name": "HYOSCINE syrup 30 ml (ทBน2)",
    "strength": "5mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-259",
    "name": "HumanTetanus  Immunoglobulin (HTIG)",
    "generic_name": "HumanTetanus  Immunoglobulin (HTIG)",
    "strength": "250 iu /1 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-260",
    "name": "IBUPROFEN TAB (ทDน1,G60)",
    "generic_name": "IBUPROFEN TAB (ทDน1,G60)",
    "strength": "200mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-262",
    "name": "IBUPROFEN syrup 60ml (ทDน1)",
    "generic_name": "IBUPROFEN syrup 60ml (ทDน1)",
    "strength": "100mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-263",
    "name": "IMIPRAMINE TAB (ทBน4)",
    "generic_name": "IMIPRAMINE TAB (ทBน4)",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-264",
    "name": "INDINAVIR 400 mg(ทCน4)",
    "generic_name": "INDINAVIR 400 mg(ทCน4)",
    "strength": "400mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-265",
    "name": "INH-Isoniazid TAB (ทBน2)",
    "generic_name": "INH-Isoniazid TAB (ทBน2)",
    "strength": "100mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-266",
    "name": "IPV (poliomyelitis incatived type 1,3)",
    "generic_name": "IPV (poliomyelitis incatived type 1,3)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-267",
    "name": "ITRACONAZOLE Capsule (Sporal) (ทBน3)",
    "generic_name": "ITRACONAZOLE Capsule (Sporal) (ทBน3)",
    "strength": "100 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-268",
    "name": "Influienza vaccine",
    "generic_name": "Influienza vaccine",
    "strength": "15mcg500mcL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-269",
    "name": "Injection  (KCl) Potassiumchloride  INJ",
    "generic_name": "Injection  (KCl) Potassiumchloride  INJ",
    "strength": "20 mEq10 ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-270",
    "name": "Iron sucrose inj",
    "generic_name": "Iron sucrose inj",
    "strength": "100 mg5ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-271",
    "name": "Isosorbide mononitrate (ทC,น2)",
    "generic_name": "Isosorbide mononitrate (ทC,น2)",
    "strength": "20mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-272",
    "name": "KALIMATE  (Ca Polystyrene Sulfonate)",
    "generic_name": "KALIMATE  (Ca Polystyrene Sulfonate)",
    "strength": "5 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-273",
    "name": "KETAMINE INJ-1 mL  (ทCน2)",
    "generic_name": "KETAMINE INJ-1 mL  (ทCน2)",
    "strength": "500mg\\10ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-274",
    "name": "LA JE (vaccine) japanese encephalitis virus live vaccine",
    "generic_name": "LA JE (vaccine) japanese encephalitis virus live vaccine",
    "strength": "5.4 log PFU",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-275",
    "name": "LACTULOSE ขวด 180 ML (ทBน3)",
    "generic_name": "LACTULOSE ขวด 180 ML (ทBน3)",
    "strength": "66.7 g/100 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-276",
    "name": "LACTULOSE ขวด 30 ML  (ทBน3)",
    "generic_name": "LACTULOSE ขวด 30 ML  (ทBน3)",
    "strength": "66.7 %VW",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-277",
    "name": "LAMIVUDINE TAB (ทBน5C50)",
    "generic_name": "LAMIVUDINE TAB (ทBน5C50)",
    "strength": "150 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-278",
    "name": "LEVOfloxacin TAB (ทCน4) (ง)",
    "generic_name": "LEVOfloxacin TAB (ทCน4) (ง)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-279",
    "name": "LORazepamTAB (ทDน2)",
    "generic_name": "LORazepamTAB (ทDน2)",
    "strength": "1mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-280",
    "name": "LOSARTAN TAB (ทD2,3น2)",
    "generic_name": "LOSARTAN TAB (ทD2,3น2)",
    "strength": "100 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-282",
    "name": "LOperaMIDE TAB(ทBน2)",
    "generic_name": "LOperaMIDE TAB(ทBน2)",
    "strength": "2mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-284",
    "name": "Lamivudine syrup (10mg-ml)-60ml (ทBน5)",
    "generic_name": "Lamivudine syrup (10mg-ml)-60ml (ทBน5)",
    "strength": "50mg/5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-285",
    "name": "LoraTADINE TAB(ทBน2,C10)",
    "generic_name": "LoraTADINE TAB(ทBน2,C10)",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-286",
    "name": "METHADONE NO 22 -1ML",
    "generic_name": "METHADONE NO 22 -1ML",
    "strength": "1mg/1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-287",
    "name": "METHADONE NO 23 -1ML",
    "generic_name": "METHADONE NO 23 -1ML",
    "strength": "0.67mg/1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-288",
    "name": "METHADONE NO 24 -1ML",
    "generic_name": "METHADONE NO 24 -1ML",
    "strength": "0.33mg/1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-289",
    "name": "METHADONE NO 25 -1ML",
    "generic_name": "METHADONE NO 25 -1ML",
    "strength": "0.17mg/1ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-290",
    "name": "METHOTREXATE TAB(ทXน5,C50)",
    "generic_name": "METHOTREXATE TAB(ทXน5,C50)",
    "strength": "2.5mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-291",
    "name": "METHYLDOPA  TAB (ทAน2,C10)",
    "generic_name": "METHYLDOPA  TAB (ทAน2,C10)",
    "strength": "125mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-292",
    "name": "METHYLDOPA TAB (ทAน2,C10))",
    "generic_name": "METHYLDOPA TAB (ทAน2,C10))",
    "strength": "250mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-293",
    "name": "METHYLERGOMETRINE  INJ(ทXน1)",
    "generic_name": "METHYLERGOMETRINE  INJ(ทXน1)",
    "strength": "0.2mg1ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-294",
    "name": "METOCLOPRAMIDE  INJ (ทAน3,C40)",
    "generic_name": "METOCLOPRAMIDE  INJ (ทAน3,C40)",
    "strength": "10mg2ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-295",
    "name": "METOCLOPRAMIDE TAB (ทAน3,C60)",
    "generic_name": "METOCLOPRAMIDE TAB (ทAน3,C60)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-296",
    "name": "MMR (vaccine)",
    "generic_name": "MMR (vaccine)",
    "strength": "1000 tcid500.5 mL + 5000 tcid500.5 mL + 1000 tci",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-297",
    "name": "MODURETIC TAB(Amiloride 5+HCTZ 50) (ทAน1)",
    "generic_name": "MODURETIC TAB(Amiloride 5+HCTZ 50) (ทAน1)",
    "strength": "50mg5mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-298",
    "name": "MOLNUPIRAVIR TAB (ทD,น3)",
    "generic_name": "MOLNUPIRAVIR TAB (ทD,น3)",
    "strength": "200 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-299",
    "name": "MORPHINE INJ (ทDน3,C60)",
    "generic_name": "MORPHINE INJ (ทDน3,C60)",
    "strength": "10 mgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-300",
    "name": "MULTIVITAMIN TAB (ทAน1)",
    "generic_name": "MULTIVITAMIN TAB (ทAน1)",
    "strength": "tab",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-301",
    "name": "MULTIVITAMIN syrup (ทAน1)-60 ml",
    "generic_name": "MULTIVITAMIN syrup (ทAน1)-60 ml",
    "strength": "60ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-302",
    "name": "Magnesium Oxide (6.94mEq) Capsule (ทCน3)-NED",
    "generic_name": "Magnesium Oxide (6.94mEq) Capsule (ทCน3)-NED",
    "strength": "140 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-303",
    "name": "Manidipine HCl",
    "generic_name": "Manidipine HCl",
    "strength": "20",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-304",
    "name": "Measle+Rubella vaccine (MRS)",
    "generic_name": "Measle+Rubella vaccine (MRS)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-305",
    "name": "Methimazole 5 mg (Thiamazole) (ทDน1)",
    "generic_name": "Methimazole 5 mg (Thiamazole) (ทDน1)",
    "strength": "5mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-306",
    "name": "Metoprolol TAB(ทDน4)",
    "generic_name": "Metoprolol TAB(ทDน4)",
    "strength": "100mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-307",
    "name": "Midazolam(Dormicum) INJ (ทBน1)",
    "generic_name": "Midazolam(Dormicum) INJ (ทBน1)",
    "strength": "5 mg\\1ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-308",
    "name": "Minoxidil TAB",
    "generic_name": "Minoxidil TAB",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-309",
    "name": "Morphine Solution (10mg5ml)-60ML (ทDน3 C60)",
    "generic_name": "Morphine Solution (10mg5ml)-60ML (ทDน3 C60)",
    "strength": "2mgml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-310",
    "name": "NALOXONE INJ 1 ML(ทA,น2)(Narcan)",
    "generic_name": "NALOXONE INJ 1 ML(ทA,น2)(Narcan)",
    "strength": "0.4 mg1ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-311",
    "name": "NIFEdipine (ทBน2)-NED",
    "generic_name": "NIFEdipine (ทBน2)-NED",
    "strength": "10 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-312",
    "name": "NITROGLYCERINE INJ (ทC)",
    "generic_name": "NITROGLYCERINE INJ (ทC)",
    "strength": "50 mg10ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-313",
    "name": "NORETHISTERONE TAB (Primolut-N) (ทXน2)",
    "generic_name": "NORETHISTERONE TAB (Primolut-N) (ทXน2)",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-314",
    "name": "NORfloxacin TAB (ทBน2C30)",
    "generic_name": "NORfloxacin TAB (ทBน2C30)",
    "strength": "400 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-315",
    "name": "NSS 1000 ml IRRIGATION (น้ำเกลือล้างแผล)",
    "generic_name": "NSS 1000 ml IRRIGATION (น้ำเกลือล้างแผล)",
    "strength": "90mg100ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-316",
    "name": "NSS 5 ml INJECTION (หยอดจมูก)",
    "generic_name": "NSS 5 ml INJECTION (หยอดจมูก)",
    "strength": "0.9%NaCl",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-317",
    "name": "Naproxen (ทD1,3น2,G60)",
    "generic_name": "Naproxen (ทD1,3น2,G60)",
    "strength": "250mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-318",
    "name": "Neostigmine inj",
    "generic_name": "Neostigmine inj",
    "strength": "2.5mg\\ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-319",
    "name": "Nevirapine syrup 60ml (ทBน5)",
    "generic_name": "Nevirapine syrup 60ml (ทBน5)",
    "strength": "50mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-320",
    "name": "Nortriptyline (ทB,น3)",
    "generic_name": "Nortriptyline (ทB,น3)",
    "strength": "25 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-321",
    "name": "OLANZapine",
    "generic_name": "OLANZapine",
    "strength": "5 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-322",
    "name": "OMEPRAZOLE CAP(ทB,น4)",
    "generic_name": "OMEPRAZOLE CAP(ทB,น4)",
    "strength": "20mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-323",
    "name": "OPV (poliomyelitis, live attenuated 1,3)",
    "generic_name": "OPV (poliomyelitis, live attenuated 1,3)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-324",
    "name": "ORS powder(ออสร่า)",
    "generic_name": "ORS powder(ออสร่า)",
    "strength": "3.375g375r",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-325",
    "name": "OXYTOCIN INJ(ทX,น3)",
    "generic_name": "OXYTOCIN INJ(ทX,น3)",
    "strength": "10iuml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-326",
    "name": "Octreotide injection (ง)",
    "generic_name": "Octreotide injection (ง)",
    "strength": "100 mcgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-327",
    "name": "Omeprazole INJ (ทB,น4)",
    "generic_name": "Omeprazole INJ (ทB,น4)",
    "strength": "40 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-328",
    "name": "Ondansetron injection (ทB,น2)",
    "generic_name": "Ondansetron injection (ทB,น2)",
    "strength": "4mg2ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-329",
    "name": "Oseltamivir  CAP (ทBน1,C60)",
    "generic_name": "Oseltamivir  CAP (ทBน1,C60)",
    "strength": "75 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-332",
    "name": "PARACETAMOL Syrup 60 ml",
    "generic_name": "PARACETAMOL Syrup 60 ml",
    "strength": "120mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-333",
    "name": "PARACETAMOL TAB (ทBน1)",
    "generic_name": "PARACETAMOL TAB (ทBน1)",
    "strength": "325 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-335",
    "name": "PEG-polyethylene glycol Powder 68.578 g.",
    "generic_name": "PEG-polyethylene glycol Powder 68.578 g.",
    "strength": "68.578",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-336",
    "name": "PERPHEnazine (ทCน3)",
    "generic_name": "PERPHEnazine (ทCน3)",
    "strength": "4 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-337",
    "name": "PETHIDINE INJ (ทDน1,G60)",
    "generic_name": "PETHIDINE INJ (ทDน1,G60)",
    "strength": "50mgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-338",
    "name": "PHENYTOIN  INJ (ทBน1)",
    "generic_name": "PHENYTOIN  INJ (ทBน1)",
    "strength": "250mg5ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-339",
    "name": "PRALIDOXIME (2-PAM) INJ (ทAนhold)",
    "generic_name": "PRALIDOXIME (2-PAM) INJ (ทAนhold)",
    "strength": "1gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-340",
    "name": "PRAZIQUANTEL TAB (ทCน4)",
    "generic_name": "PRAZIQUANTEL TAB (ทCน4)",
    "strength": "600mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-341",
    "name": "PREDNISOLONE TAB (ทDน1)",
    "generic_name": "PREDNISOLONE TAB (ทDน1)",
    "strength": "5mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-342",
    "name": "PREGABALIN CAP  NED  (N3)(ทC,น3,C60)",
    "generic_name": "PREGABALIN CAP  NED  (N3)(ทC,น3,C60)",
    "strength": "75 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-343",
    "name": "PROPOFOL 200 MG-200ML inj.(ทB)",
    "generic_name": "PROPOFOL 200 MG-200ML inj.(ทB)",
    "strength": "1%(10mgml)",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-344",
    "name": "PROPRANOLOL  TAB (ทDน3)",
    "generic_name": "PROPRANOLOL  TAB (ทDน3)",
    "strength": "10mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-346",
    "name": "PTU-PROPYLTHIOURACIL (ทBน2)",
    "generic_name": "PTU-PROPYLTHIOURACIL (ทBน2)",
    "strength": "50mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-347",
    "name": "PYRAZINAMIDE (PZA) TAB (ทBน2,C30)",
    "generic_name": "PYRAZINAMIDE (PZA) TAB (ทBน2,C30)",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-348",
    "name": "PYRIDOSTIGMINE TAB (ทฺBน2)",
    "generic_name": "PYRIDOSTIGMINE TAB (ทฺBน2)",
    "strength": "60mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-349",
    "name": "PYRIMETHAMINE 25 mg TAB(ทC,น2)",
    "generic_name": "PYRIMETHAMINE 25 mg TAB(ทC,น2)",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-350",
    "name": "Parecoxib INJ (Dynastat)- (ทCน3) N3(O),N4(I)-NED",
    "generic_name": "Parecoxib INJ (Dynastat)- (ทCน3) N3(O),N4(I)-NED",
    "strength": "40 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-351",
    "name": "Pediatric Dolutegravir(pDTG) 10mg/tab",
    "generic_name": "Pediatric Dolutegravir(pDTG) 10mg/tab",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-352",
    "name": "Pfizer-ฝาม่วง-Biontech COVID-19 Vaccine (mRNA)",
    "generic_name": "Pfizer-ฝาม่วง-Biontech COVID-19 Vaccine (mRNA)",
    "strength": "0.3 ml dose",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-353",
    "name": "Pioglitazone (ทCน2)",
    "generic_name": "Pioglitazone (ทCน2)",
    "strength": "15mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-354",
    "name": "Podophyllin paint 1ml/dose",
    "generic_name": "Podophyllin paint 1ml/dose",
    "strength": "25%w/v",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-355",
    "name": "Poly-Oph Eye Drop 5 ml",
    "generic_name": "Poly-Oph Eye Drop 5 ml",
    "strength": "1.75mg5000u",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-356",
    "name": "Polygelline (Haemaccell) 500 ml-NED",
    "generic_name": "Polygelline (Haemaccell) 500 ml-NED",
    "strength": "-",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-357",
    "name": "Progesterone Capsule(VaginalSuppo.)-NED",
    "generic_name": "Progesterone Capsule(VaginalSuppo.)-NED",
    "strength": "200 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-358",
    "name": "QUININE 300 mg TAB (ทDน2,G50)",
    "generic_name": "QUININE 300 mg TAB (ทDน2,G50)",
    "strength": "300mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-359",
    "name": "REPARIL-AESCIN NED (ชำระเงินเอง)",
    "generic_name": "REPARIL-AESCIN NED (ชำระเงินเอง)",
    "strength": "20 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-360",
    "name": "RIFAMPICIN CAP(ทAน1)",
    "generic_name": "RIFAMPICIN CAP(ทAน1)",
    "strength": "300 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-362",
    "name": "RISPERIDONE TAB (ทBน3,C30)",
    "generic_name": "RISPERIDONE TAB (ทBน3,C30)",
    "strength": "2 MG",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-363",
    "name": "ROTARIX-Rotavirus vaccine(Lived)",
    "generic_name": "ROTARIX-Rotavirus vaccine(Lived)",
    "strength": "1.5 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-364",
    "name": "Remdesivir Inj.",
    "generic_name": "Remdesivir Inj.",
    "strength": "100mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-365",
    "name": "Ribavirin",
    "generic_name": "Ribavirin",
    "strength": "200 mg.",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-366",
    "name": "Rotasiil",
    "generic_name": "Rotasiil",
    "strength": "2ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-367",
    "name": "Rotateq-Rotavirus vaccine(Lived)",
    "generic_name": "Rotateq-Rotavirus vaccine(Lived)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-368",
    "name": "SALBUTAMOL MDI inhaler 200 dose (ทAน2)",
    "generic_name": "SALBUTAMOL MDI inhaler 200 dose (ทAน2)",
    "strength": "100 mgdose",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-369",
    "name": "SALBUTAMOL syrup 60 ml (ทAน2)",
    "generic_name": "SALBUTAMOL syrup 60 ml (ทAน2)",
    "strength": "2mg5ml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-370",
    "name": "SERUM งูกะปะ",
    "generic_name": "SERUM งูกะปะ",
    "strength": "600 mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-371",
    "name": "SERUM งูสามเหลี่ยม",
    "generic_name": "SERUM งูสามเหลี่ยม",
    "strength": "600 mcg  1 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-372",
    "name": "SERUM งูเขียวหางไหม้",
    "generic_name": "SERUM งูเขียวหางไหม้",
    "strength": "700 mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-373",
    "name": "SERUM งูเห่า",
    "generic_name": "SERUM งูเห่า",
    "strength": "600 mcgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-374",
    "name": "SERUM งูแมวเซา",
    "generic_name": "SERUM งูแมวเซา",
    "strength": "600 mcg1 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-375",
    "name": "SIMVASTATIN TAB (ทX,น5,C30)",
    "generic_name": "SIMVASTATIN TAB (ทX,น5,C30)",
    "strength": "20 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-376",
    "name": "SMW (น้ำยาบ้วนปาก) Spacial Mouth Wash",
    "generic_name": "SMW (น้ำยาบ้วนปาก) Spacial Mouth Wash",
    "strength": "180 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-377",
    "name": "SODIUM VALPROATE  INJ (ทD,น3)",
    "generic_name": "SODIUM VALPROATE  INJ (ทD,น3)",
    "strength": "400mg4ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-378",
    "name": "SODIUM penicillin G  INJ (ทBน1,G50)",
    "generic_name": "SODIUM penicillin G  INJ (ทBน1,G50)",
    "strength": "5mu",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-379",
    "name": "SP-ขมิ้นชัน 500 MG Capsule (ทDน2)",
    "generic_name": "SP-ขมิ้นชัน 500 MG Capsule (ทDน2)",
    "strength": "500mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-380",
    "name": "SP-ขิง ยาชง 1 ซองเล็ก (10ซอง/1ถุง)",
    "generic_name": "SP-ขิง ยาชง 1 ซองเล็ก (10ซอง/1ถุง)",
    "strength": "3 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-381",
    "name": "SP-จันทน์ลีลา เม็ด",
    "generic_name": "SP-จันทน์ลีลา เม็ด",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-382",
    "name": "SP-ตรีผลา แคปซูล",
    "generic_name": "SP-ตรีผลา แคปซูล",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-383",
    "name": "SP-ตำรับยาทำลายพระสุเมรุ(NED)",
    "generic_name": "SP-ตำรับยาทำลายพระสุเมรุ(NED)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-384",
    "name": "SP-ตำรับยาศุขไสยาศน์ ชนิดผง(ทD,น3)(NED)",
    "generic_name": "SP-ตำรับยาศุขไสยาศน์ ชนิดผง(ทD,น3)(NED)",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-385",
    "name": "SP-น้ำมันกัญชา(ตำรับหมอเดชา) (NED)",
    "generic_name": "SP-น้ำมันกัญชา(ตำรับหมอเดชา) (NED)",
    "strength": "2mgml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-386",
    "name": "SP-น้ำมันมะกอก OLIVE oil",
    "generic_name": "SP-น้ำมันมะกอก OLIVE oil",
    "strength": "30 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-387",
    "name": "SP-ประสะไพล แคปซูล",
    "generic_name": "SP-ประสะไพล แคปซูล",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-388",
    "name": "SP-ปราบชมพูทวีป",
    "generic_name": "SP-ปราบชมพูทวีป",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-389",
    "name": "SP-ฟ้าทะลายโจร Capsule (ทDน3)",
    "generic_name": "SP-ฟ้าทะลายโจร Capsule (ทDน3)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-390",
    "name": "SP-มะขามแขก SENNA  (ทAนA)",
    "generic_name": "SP-มะขามแขก SENNA  (ทAนA)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-391",
    "name": "SP-ยาขึ้ผึ้งทาสะเก็ดเงิน",
    "generic_name": "SP-ยาขึ้ผึ้งทาสะเก็ดเงิน",
    "strength": "20 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-392",
    "name": "SP-ยาคลายเส้นเถาวัลย์เปรียง (ทC,น3)",
    "generic_name": "SP-ยาคลายเส้นเถาวัลย์เปรียง (ทC,น3)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-393",
    "name": "SP-ยาทาสะเก็ดเงิน สเปรย์",
    "generic_name": "SP-ยาทาสะเก็ดเงิน สเปรย์",
    "strength": "20 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-394",
    "name": "SP-ยาธรณีสันฑะฆาต CAP",
    "generic_name": "SP-ยาธรณีสันฑะฆาต CAP",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-395",
    "name": "SP-ยาธาตุบรรจบ CAP",
    "generic_name": "SP-ยาธาตุบรรจบ CAP",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-396",
    "name": "SP-ยาธาตุอบเชย",
    "generic_name": "SP-ยาธาตุอบเชย",
    "strength": "4%W/V",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-397",
    "name": "SP-ยาหอมนวโกฐ (ผง)",
    "generic_name": "SP-ยาหอมนวโกฐ (ผง)",
    "strength": "15 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-398",
    "name": "SP-ยาหอมเทพจิตร  15 gm (ผง)",
    "generic_name": "SP-ยาหอมเทพจิตร  15 gm (ผง)",
    "strength": "15gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-399",
    "name": "SP-ยาอบสมุนไพร",
    "generic_name": "SP-ยาอบสมุนไพร",
    "strength": "150gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-400",
    "name": "SP-ยาอมมะแว้ง 20 เม็ด",
    "generic_name": "SP-ยาอมมะแว้ง 20 เม็ด",
    "strength": "250 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-401",
    "name": "SP-ยาแก้ไอผสมมะขามป้อม Mixture",
    "generic_name": "SP-ยาแก้ไอผสมมะขามป้อม Mixture",
    "strength": "120 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-402",
    "name": "SP-รางจืด ยาชง 1 ซอง",
    "generic_name": "SP-รางจืด ยาชง 1 ซอง",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-403",
    "name": "SP-ลูกประคบสมุนไพร",
    "generic_name": "SP-ลูกประคบสมุนไพร",
    "strength": "200 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-404",
    "name": "SP-สบู่สัตตะมณี",
    "generic_name": "SP-สบู่สัตตะมณี",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-405",
    "name": "SP-สหัสธารา เม็ด",
    "generic_name": "SP-สหัสธารา เม็ด",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-406",
    "name": "SP-หญ้าดอกขาว ชาชง 1 ซองเล็ก (10ซอง/1ห่อ)",
    "generic_name": "SP-หญ้าดอกขาว ชาชง 1 ซองเล็ก (10ซอง/1ห่อ)",
    "strength": "2 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-407",
    "name": "SP-หญ้าหนวดแมว ชาชง 1 ซองเล็ก  (10ซอง/1ห่อ)",
    "generic_name": "SP-หญ้าหนวดแมว ชาชง 1 ซองเล็ก  (10ซอง/1ห่อ)",
    "strength": "2gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-408",
    "name": "SP-เพชรสังฆาต",
    "generic_name": "SP-เพชรสังฆาต",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-409",
    "name": "SP-เสลดพังพอน กลีเซอรีน",
    "generic_name": "SP-เสลดพังพอน กลีเซอรีน",
    "strength": "60 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-410",
    "name": "SP-แคปซูล ตำรับยาศุขไสยาศน์ (ทD,น3) (NED)",
    "generic_name": "SP-แคปซูล ตำรับยาศุขไสยาศน์ (ทD,น3) (NED)",
    "strength": "500  mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-411",
    "name": "SPEEDA  (0.5 ml-Vial)-Rabies Vaccine INJ",
    "generic_name": "SPEEDA  (0.5 ml-Vial)-Rabies Vaccine INJ",
    "strength": "2.5 IU",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-412",
    "name": "SPIRONOLACTONE TAB(ทCน2)",
    "generic_name": "SPIRONOLACTONE TAB(ทCน2)",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-413",
    "name": "STREPTOMYCIN INJ (ทDน1,C30)",
    "generic_name": "STREPTOMYCIN INJ (ทDน1,C30)",
    "strength": "1000 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-414",
    "name": "Sero-flo MDI (25,125) 120dose(ทAน2)",
    "generic_name": "Sero-flo MDI (25,125) 120dose(ทAน2)",
    "strength": "125 salmeterol",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-415",
    "name": "Sertraline TAB (ทD3น3)",
    "generic_name": "Sertraline TAB (ทD3น3)",
    "strength": "50 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-416",
    "name": "Simethicone drop 15ml (ทAน2)",
    "generic_name": "Simethicone drop 15ml (ทAน2)",
    "strength": "40mg0.6ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-417",
    "name": "Sodium Chloride 300 mg. tablet",
    "generic_name": "Sodium Chloride 300 mg. tablet",
    "strength": "300 MG",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-418",
    "name": "Sodium Phosphate(XUBIL)solution 20 ML(ทC,C30)",
    "generic_name": "Sodium Phosphate(XUBIL)solution 20 ML(ทC,C30)",
    "strength": "900mg2.4g in 5  ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-419",
    "name": "Sodium VALPROATE  TAB  (ทDน3)",
    "generic_name": "Sodium VALPROATE  TAB  (ทDน3)",
    "strength": "200 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-420",
    "name": "Sofosbuvir+Velpatasvir",
    "generic_name": "Sofosbuvir+Velpatasvir",
    "strength": "400+100",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-421",
    "name": "Spray-10%Lidocaine hydrochloride (PUFF)",
    "generic_name": "Spray-10%Lidocaine hydrochloride (PUFF)",
    "strength": "10 g\\100 ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-422",
    "name": "Sterile water  for IRRIGATION",
    "generic_name": "Sterile water  for IRRIGATION",
    "strength": "1000 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-423",
    "name": "Sterile water for INJECTION",
    "generic_name": "Sterile water for INJECTION",
    "strength": "10 mL",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-426",
    "name": "Suppository-PARACETAMOL NED (ทBน1)",
    "generic_name": "Suppository-PARACETAMOL NED (ทBน1)",
    "strength": "325 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-427",
    "name": "Suxamethonium chloride inj (Succinyl) (ทAน2)",
    "generic_name": "Suxamethonium chloride inj (Succinyl) (ทAน2)",
    "strength": "50 mg10ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-428",
    "name": "TAB(KCl)Potassium Cl (6.7mEq) (ทAน1)",
    "generic_name": "TAB(KCl)Potassium Cl (6.7mEq) (ทAน1)",
    "strength": "500 mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-429",
    "name": "TAF -Tenofovir alafenamide(ทB)",
    "generic_name": "TAF -Tenofovir alafenamide(ทB)",
    "strength": "25 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-430",
    "name": "TAF+FTC (Emtri)",
    "generic_name": "TAF+FTC (Emtri)",
    "strength": "200+25",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-431",
    "name": "TENO-EM (TDF+FTC)",
    "generic_name": "TENO-EM (TDF+FTC)",
    "strength": "200 mg +300 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-432",
    "name": "TENOFOVIR (TDF) TAB (ทB,C50)",
    "generic_name": "TENOFOVIR (TDF) TAB (ทB,C50)",
    "strength": "300 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-433",
    "name": "TERBUTALINE (Bricanyl) INJ (ทCน2) NED",
    "generic_name": "TERBUTALINE (Bricanyl) INJ (ทCน2) NED",
    "strength": "0.5mg1ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-434",
    "name": "TERRAMYCIN OINTMENT",
    "generic_name": "TERRAMYCIN OINTMENT",
    "strength": "5 mg/1 g + 10000 iu/1 g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-435",
    "name": "TETRACAINE Eye drop",
    "generic_name": "TETRACAINE Eye drop",
    "strength": "0.5% w/v",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-436",
    "name": "THEOPHYLLINE TAB(ทAน1)",
    "generic_name": "THEOPHYLLINE TAB(ทAน1)",
    "strength": "200 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-437",
    "name": "THIORIDAZINE",
    "generic_name": "THIORIDAZINE",
    "strength": "50 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-438",
    "name": "THYROXIN (Levothyroxin 0.1 mg)TAB(ทAน1)",
    "generic_name": "THYROXIN (Levothyroxin 0.1 mg)TAB(ทAน1)",
    "strength": "100 mcg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-439",
    "name": "TIMOLOL EYE DROP  (ทDน4)",
    "generic_name": "TIMOLOL EYE DROP  (ทDน4)",
    "strength": "500 mg/100 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-440",
    "name": "TLD สูตรรวม (TDF+3TC+DTG) (ทD,น3)",
    "generic_name": "TLD สูตรรวม (TDF+3TC+DTG) (ทD,น3)",
    "strength": "300+300+50",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-441",
    "name": "TRANEXAMIC ACID INJ (ทCน2)",
    "generic_name": "TRANEXAMIC ACID INJ (ทCน2)",
    "strength": "250MG5ML",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-442",
    "name": "TRIAMCINOLONE  40 mg INJ.(ทDน3)",
    "generic_name": "TRIAMCINOLONE  40 mg INJ.(ทDน3)",
    "strength": "40mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-443",
    "name": "TRIAMCINOLONE INJ (ทDน3)",
    "generic_name": "TRIAMCINOLONE INJ (ทDน3)",
    "strength": "10mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-444",
    "name": "TRIAMCINOLONE oral paste-1 gm",
    "generic_name": "TRIAMCINOLONE oral paste-1 gm",
    "strength": "-",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-445",
    "name": "TRIFLUOPERAZINE TAB",
    "generic_name": "TRIFLUOPERAZINE TAB",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-446",
    "name": "Tamoxifen TAB(ทDน3)",
    "generic_name": "Tamoxifen TAB(ทDน3)",
    "strength": "20 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-447",
    "name": "Tar Shampoo 180 mL",
    "generic_name": "Tar Shampoo 180 mL",
    "strength": "1g100g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-448",
    "name": "Tenecteplase - TNK",
    "generic_name": "Tenecteplase - TNK",
    "strength": "8000 unit(40mg)",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-449",
    "name": "Thiopentone sodium INJ (C10)",
    "generic_name": "Thiopentone sodium INJ (C10)",
    "strength": "1 gm",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-450",
    "name": "Tranexamic acid CAP (ทCน2) (ง)",
    "generic_name": "Tranexamic acid CAP (ทCน2) (ง)",
    "strength": "500 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-451",
    "name": "Triferdine Tab (ทAน3)",
    "generic_name": "Triferdine Tab (ทAน3)",
    "strength": "150mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-452",
    "name": "Trihexyphenidyl (Artane)(ทC,น2)",
    "generic_name": "Trihexyphenidyl (Artane)(ทC,น2)",
    "strength": "2 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-453",
    "name": "Trihexyphenidyl hydrochioride (ทC,น2)",
    "generic_name": "Trihexyphenidyl hydrochioride (ทC,น2)",
    "strength": "5 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-454",
    "name": "UNISON ENEMA-NED",
    "generic_name": "UNISON ENEMA-NED",
    "strength": "15 g/100 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-455",
    "name": "UNISON FOR CHILDREN ENEMA-NED 2ชิ้น-กล่อง",
    "generic_name": "UNISON FOR CHILDREN ENEMA-NED 2ชิ้น-กล่อง",
    "strength": "15g10ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-456",
    "name": "VARENICLINE-โครงการฯ (11+42เม็ด) STARTER",
    "generic_name": "VARENICLINE-โครงการฯ (11+42เม็ด) STARTER",
    "strength": "0.5 mg+1 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-457",
    "name": "VERAPAMIL TAB (ทAน2)",
    "generic_name": "VERAPAMIL TAB (ทAน2)",
    "strength": "40 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-458",
    "name": "VITAMIN B Complex TAB (ทAน1)",
    "generic_name": "VITAMIN B Complex TAB (ทAน1)",
    "strength": "1",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-459",
    "name": "VITAMIN B6 (PYRIDOXINE)  TAB (ทACน1)",
    "generic_name": "VITAMIN B6 (PYRIDOXINE)  TAB (ทACน1)",
    "strength": "50 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-460",
    "name": "VITAMIN C TAB (ทACน1)",
    "generic_name": "VITAMIN C TAB (ทACน1)",
    "strength": "100 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-461",
    "name": "Vitamin A",
    "generic_name": "Vitamin A",
    "strength": "25000 IU",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-462",
    "name": "Vitamin D2(calciFERAL) CAP",
    "generic_name": "Vitamin D2(calciFERAL) CAP",
    "strength": "20000 unit",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-463",
    "name": "Warfarin TAB (ทXน1)",
    "generic_name": "Warfarin TAB (ทXน1)",
    "strength": "1 mg",
    "dosage_form": "Tablet",
    "is_had": true,
    "is_lasa": true,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-467",
    "name": "ZIDOVUDINE (AZT) CAP (ทBน5,C10)",
    "generic_name": "ZIDOVUDINE (AZT) CAP (ทBน5,C10)",
    "strength": "100 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-469",
    "name": "Zidovudine  (AZT) syrup-60 ml",
    "generic_name": "Zidovudine  (AZT) syrup-60 ml",
    "strength": "10 mgml",
    "dosage_form": "Syrup",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-470",
    "name": "Zinc Oxide Paste 5GM",
    "generic_name": "Zinc Oxide Paste 5GM",
    "strength": "7.5gm100gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-471",
    "name": "aP vaccine-acellular Pertussis",
    "generic_name": "aP vaccine-acellular Pertussis",
    "strength": "5 mcg\\0.5 mL + 5 mcg\\0.5 mL",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-472",
    "name": "acetAZOLAMIDE (Diamox)(ทCน2,G50)",
    "generic_name": "acetAZOLAMIDE (Diamox)(ทCน2,G50)",
    "strength": "250mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-473",
    "name": "amLODIPine  TAB (ทCน2)",
    "generic_name": "amLODIPine  TAB (ทCน2)",
    "strength": "10 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-474",
    "name": "amLODIPine TAB (ทCน2)",
    "generic_name": "amLODIPine TAB (ทCน2)",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-475",
    "name": "amino acids + carbohydrates + minerals + multivitamins (KABIVEN)",
    "generic_name": "amino acids + carbohydrates + minerals + multivitamins (KABIVEN)",
    "strength": "75g+187g+56g",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-476",
    "name": "bismuth subsalicylate",
    "generic_name": "bismuth subsalicylate",
    "strength": "1.048 g.",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-477",
    "name": "calciTRIOL (CALSIT SG) CAP",
    "generic_name": "calciTRIOL (CALSIT SG) CAP",
    "strength": "0.25 mcg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-478",
    "name": "ceFIXIME(cefSPAN) cap-บช.ง(ทA,น1,C60)",
    "generic_name": "ceFIXIME(cefSPAN) cap-บช.ง(ทA,น1,C60)",
    "strength": "100 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-479",
    "name": "cefAZOLIN  INJ (ทAน1,C50)",
    "generic_name": "cefAZOLIN  INJ (ทAน1,C50)",
    "strength": "1gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-480",
    "name": "cefTRIAxone  INJ (Cef-3) (ทAน1)",
    "generic_name": "cefTRIAxone  INJ (Cef-3) (ทAน1)",
    "strength": "1gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-481",
    "name": "clonazePAM TAB (ทBน1)",
    "generic_name": "clonazePAM TAB (ทBน1)",
    "strength": "0.5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-482",
    "name": "dT (Multiple dose For ส่งเสริม) Diptheria,Tetanus Vaccine",
    "generic_name": "dT (Multiple dose For ส่งเสริม) Diptheria,Tetanus Vaccine",
    "strength": "40Lf\\ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-483",
    "name": "dT (single dose for ER) Diptheria,Tetanus Vaccine",
    "generic_name": "dT (single dose for ER) Diptheria,Tetanus Vaccine",
    "strength": "2 Lf0.5ml",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-484",
    "name": "dexaMETHASONE INJ (ทBน2)",
    "generic_name": "dexaMETHASONE INJ (ทBน2)",
    "strength": "4mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-485",
    "name": "ear-SODIUM BICABONATE ear drops",
    "generic_name": "ear-SODIUM BICABONATE ear drops",
    "strength": "2.5%w/v",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-486",
    "name": "haloPERIDOL TAB (ทCน4)",
    "generic_name": "haloPERIDOL TAB (ทCน4)",
    "strength": "2 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-487",
    "name": "haloPERIDOLTAB (ทCน4)",
    "generic_name": "haloPERIDOLTAB (ทCน4)",
    "strength": "5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-488",
    "name": "haloperidol DECANOATE INJ",
    "generic_name": "haloperidol DECANOATE INJ",
    "strength": "50 mgml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-489",
    "name": "hydrALAZINE INJ (Apresoline)(ทDน2)",
    "generic_name": "hydrALAZINE INJ (Apresoline)(ทDน2)",
    "strength": "20mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-490",
    "name": "hydraLAZINE TAB(ทDน2)",
    "generic_name": "hydraLAZINE TAB(ทDน2)",
    "strength": "25mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-491",
    "name": "levodopa100+carbidopa25(Sinemet)(ทDน4)",
    "generic_name": "levodopa100+carbidopa25(Sinemet)(ทDน4)",
    "strength": "25 mg + 100 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-492",
    "name": "metFORMIN TAB(ทBน1,G45)",
    "generic_name": "metFORMIN TAB(ทBน1,G45)",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-493",
    "name": "metroNIDAZOLE INJ(ทBน3)",
    "generic_name": "metroNIDAZOLE INJ(ทBน3)",
    "strength": "500mg100ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-494",
    "name": "metroNIDAZOLE TAB (ทBน3)",
    "generic_name": "metroNIDAZOLE TAB (ทBน3)",
    "strength": "400 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-495",
    "name": "niCARdipine (ทCน2)",
    "generic_name": "niCARdipine (ทCน2)",
    "strength": "2mg/2ml",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-496",
    "name": "niCARdipineINJ (ทCน2)",
    "generic_name": "niCARdipineINJ (ทCน2)",
    "strength": "10mg/10ml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-497",
    "name": "phenoBARBITAL TAB (ทDน4,C10)",
    "generic_name": "phenoBARBITAL TAB (ทDน4,C10)",
    "strength": "60mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-498",
    "name": "sulfa DIA zine TAB",
    "generic_name": "sulfa DIA zine TAB",
    "strength": "500mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-499",
    "name": "traMADol CAP (ทDน3,C30)",
    "generic_name": "traMADol CAP (ทDน3,C30)",
    "strength": "50 mg",
    "dosage_form": "General",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-500",
    "name": "traMADol INJ (ทDน3)",
    "generic_name": "traMADol INJ (ทDน3)",
    "strength": "50mgml",
    "dosage_form": "Injection",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-501",
    "name": "traZODone HCL TAB",
    "generic_name": "traZODone HCL TAB",
    "strength": "50 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-502",
    "name": "{DUE} (Fortum) ceftAZIDime inj (ทAน1,C50)",
    "generic_name": "{DUE} (Fortum) ceftAZIDime inj (ทAน1,C50)",
    "strength": "1gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-503",
    "name": "{DUE} 500mg10ml VANCOMYCIN INJ(ทAน2,C50)",
    "generic_name": "{DUE} 500mg10ml VANCOMYCIN INJ(ทAน2,C50)",
    "strength": "500 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-504",
    "name": "{DUE} Ciprofloxacin inj(ทCน4C50)",
    "generic_name": "{DUE} Ciprofloxacin inj(ทCน4C50)",
    "strength": "400mg200ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-505",
    "name": "{DUE} LEVOFLOXACIN inj (ทBน2)",
    "generic_name": "{DUE} LEVOFLOXACIN inj (ทBน2)",
    "strength": "750mg150 ml",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-506",
    "name": "{DUE} MEROPENEM  INJ (ทCน2,C50)",
    "generic_name": "{DUE} MEROPENEM  INJ (ทCน2,C50)",
    "strength": "1000 mgvial",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-507",
    "name": "ขี้ผึ้งไพล 25 % - 15 GM",
    "generic_name": "ขี้ผึ้งไพล 25 % - 15 GM",
    "strength": "25% w/v",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-508",
    "name": "คลอโปรมาซีน-CHLORPROMAZINE TAB(ทAน3)",
    "generic_name": "คลอโปรมาซีน-CHLORPROMAZINE TAB(ทAน3)",
    "strength": "50mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-509",
    "name": "คลายเส้น -TOLPERISONE (ทD,น3)-NED",
    "generic_name": "คลายเส้น -TOLPERISONE (ทD,น3)-NED",
    "strength": "50 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-510",
    "name": "ต่างชาติ-Influenza 4 สายพันธุ์(ชำระเงิน)",
    "generic_name": "ต่างชาติ-Influenza 4 สายพันธุ์(ชำระเงิน)",
    "strength": "15ug",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-511",
    "name": "ต้มแก้น้ำนมน้อย",
    "generic_name": "ต้มแก้น้ำนมน้อย",
    "strength": "26.39% w/v",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-512",
    "name": "ประชาชน-Influenza 4 สายพันธุ์(ชำระเงิน)",
    "generic_name": "ประชาชน-Influenza 4 สายพันธุ์(ชำระเงิน)",
    "strength": "15ug",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-513",
    "name": "พอก สูตรร้อน",
    "generic_name": "พอก สูตรร้อน",
    "strength": "50 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-514",
    "name": "ยกเลิกรับยา รพ.สต.",
    "generic_name": "ยกเลิกรับยา รพ.สต.",
    "strength": "1",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-515",
    "name": "ยาจิตเวช cloZAPine TAB",
    "generic_name": "ยาจิตเวช cloZAPine TAB",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-516",
    "name": "ยาจิตเวช cloZAPineTAB",
    "generic_name": "ยาจิตเวช cloZAPineTAB",
    "strength": "100 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-517",
    "name": "ยาจิตเวช-AmiTRIPTYLINE TAB (ทBน3)",
    "generic_name": "ยาจิตเวช-AmiTRIPTYLINE TAB (ทBน3)",
    "strength": "25 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-518",
    "name": "ยาจิตเวช-LITHIUM CARBONATE CAP",
    "generic_name": "ยาจิตเวช-LITHIUM CARBONATE CAP",
    "strength": "300 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-519",
    "name": "ยาจิตเวช-PERPHENAZINE TAB (ทCน3)",
    "generic_name": "ยาจิตเวช-PERPHENAZINE TAB (ทCน3)",
    "strength": "8 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-520",
    "name": "ยาจิตเวช-clonazePAM TAB(ทBน1)",
    "generic_name": "ยาจิตเวช-clonazePAM TAB(ทBน1)",
    "strength": "2 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-521",
    "name": "ยาเดิมผู้ป่วย  (Patients Medication) ชื่อยา....",
    "generic_name": "ยาเดิมผู้ป่วย  (Patients Medication) ชื่อยา....",
    "strength": "-",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-522",
    "name": "ยาเดิมผู้ป่วย - Acyclovir INJ",
    "generic_name": "ยาเดิมผู้ป่วย - Acyclovir INJ",
    "strength": "250 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-523",
    "name": "ยาเดิมผู้ป่วย - Bactrim INJ",
    "generic_name": "ยาเดิมผู้ป่วย - Bactrim INJ",
    "strength": "400+80",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-524",
    "name": "ยาเดิมผู้ป่วย - Cloxacillin INJ",
    "generic_name": "ยาเดิมผู้ป่วย - Cloxacillin INJ",
    "strength": "1 g/vial",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-525",
    "name": "ยาเดิมผู้ป่วย - Ertapenem INJ",
    "generic_name": "ยาเดิมผู้ป่วย - Ertapenem INJ",
    "strength": "1 gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-526",
    "name": "ยาเดิมผู้ป่วย - Piperacillin+Tazobactam INJ",
    "generic_name": "ยาเดิมผู้ป่วย - Piperacillin+Tazobactam INJ",
    "strength": "4 gm + 500 mg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-527",
    "name": "ยาเดิมผู้ป่วย - Sulbactam INJ Powder",
    "generic_name": "ยาเดิมผู้ป่วย - Sulbactam INJ Powder",
    "strength": "2 gm",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-528",
    "name": "ยาเดิมผู้ป่วย - Tienam INJ powder (Imipenem+cilastatin)",
    "generic_name": "ยาเดิมผู้ป่วย - Tienam INJ powder (Imipenem+cilastatin)",
    "strength": "500+500",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-529",
    "name": "ยาเดิมผู้ป่วย-Filgastrim INJ",
    "generic_name": "ยาเดิมผู้ป่วย-Filgastrim INJ",
    "strength": "300 mcg",
    "dosage_form": "Injection",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-530",
    "name": "รพศ-Adrenaline Pre-filled syringe(IM)",
    "generic_name": "รพศ-Adrenaline Pre-filled syringe(IM)",
    "strength": "1mgml",
    "dosage_form": "Syrup",
    "is_had": true,
    "is_lasa": false,
    "category": "High Alert Drug"
  },
  {
    "id": "drug-hosp-531",
    "name": "รพศ-CLOMIPRAMINE HCL",
    "generic_name": "รพศ-CLOMIPRAMINE HCL",
    "strength": "25 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-532",
    "name": "รพศ.- THIORIDAZINE",
    "generic_name": "รพศ.- THIORIDAZINE",
    "strength": "10 mg",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-533",
    "name": "ศูนย์ จุด ห้า  haloPERIDOL TAB",
    "generic_name": "ศูนย์ จุด ห้า  haloPERIDOL TAB",
    "strength": "0.5 mg",
    "dosage_form": "Tablet",
    "is_had": false,
    "is_lasa": true,
    "category": "General"
  },
  {
    "id": "drug-hosp-534",
    "name": "สมุนไพรแช่มือแช่เท้า",
    "generic_name": "สมุนไพรแช่มือแช่เท้า",
    "strength": "150 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  },
  {
    "id": "drug-hosp-535",
    "name": "หนุมานประสานกาย",
    "generic_name": "หนุมานประสานกาย",
    "strength": "2 gm",
    "dosage_form": "General",
    "is_had": false,
    "is_lasa": false,
    "category": "General"
  }
];
