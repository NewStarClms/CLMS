export class UI_CONSTANT {
  static ROUNDING_OPTION = [
    { label: 'None', value: 0 },
    { label: '50 Paise', value: 2 }, { label: '1 Rupee', value: 3 }];
  static INTEREST_TYPE = [
    { label: 'None', value: 0 },
    { label: 'Fixed', value: 2 }, { label: 'Compound Interest', value: 3 }];
  static EMPTY_STRING = '';
  static MASTER = {
    ORGANIZATION: 'organization',
    BUSINESSTYPE: 'businessType',
    HEADOFDEPART: 'HeadOfDepartment',
    DEPARTMENT: 'department',
    SUPERVISOR: 'supervisor',
    COMPANY: 'company',
    STATE: 'state',
    CITY: 'city',
    COUNTRY: 'country',
    BANK: 'bank',
    USERGROUPTYPE: 'userGroupType',
    OULIST:'OUNAME',
    EMPLOYEE:'employee',
    VISITORSTATUS:'visitorStatus',
    SHIFTTYPE: 'shiftType',
    POLICYTYPE:'policytype',
    HOLIDAYMASTERTYPE:'holidayType',
    HOLIDAYDATE:'holidayDate',
    FORMATDATE:'formatDate',
  }
  static PAYROLL = {
    LWFDEDUCTIONRULE: 'lwfDeductionRule',
    VARIABLE:'variableComponent',

  }
  static SHIFT_TYPE= [
    {
      key: 1,
      value: 'Day'
    },
    {
      key: 2,
      value: 'Night'
    },
  ];

  static LEAVE_TYPE= [
    {
      key: 'L',
      value: 'Leave'
    },
    {
      key: 'P',
      value: 'Present'
    },
    {
      key: 'A',
      value: 'Absent'
    },
  ];

  static ACCRUAL_JOINING_RULE= [
    {
      key: 'F',
      value: 'Fixed'
    },
    {
      key: 'P',
      value: 'Prodata'
    }
  ];

  static ACCRUAL_DAYS_INCLUDE= [
    {
      key: 'L',
      value: 'Leave'
    },
    {
      key: 'P',
      value: 'Present'
    },
    {
      key: 'A',
      value: 'Absent'
    },
    {
      key: 'W',
      value: 'WeeklysOff'
    },
    {
      key: 'H',
      value: 'Holiday'
    },
  ];

  static INCLUDES_OPTION=[
    {
      key: 'P',
      value: 'Present'
    },
       {
      key: 'WO',
      value: 'WeeklysOff'
    },
    {
      key: 'A',
      value: 'Absent'
    },
 
    {
      key: 'HLD',
      value: 'Holiday'
    },
  ]
  static LEAVE_CYCLE= [
    {
      key: 'C',
      value: 'Calendar Year'
    },
    {
      key: 'F',
      value: 'Financial Year'
    }
  ];

  static LEAVE_MAPPED= [
    {
      key: '',
      value: 'None'
    },
    {
      key: 'OD',
      value: 'OD'
    },
    {
      key: 'COF',
      value: 'COF'
    },
    {
      key: 'SRT',
      value: 'SRT'
    }
  ];

  static LEAVE_ACCRUAL_TYPE = [
    {
      key:'M',
      value:'Month'
    },
    {
      key: 'H',
      value: 'Half Yearly'
    },
    {
      key: 'Q',
      value: 'Quarter'
    },
    {
      key: 'Y',
      value: 'Yearly'
    }
  ];

  static LEAVE_ACCRUAL_ON = [
    {
      key:'S',
      value:'Start'
    },
    {
      key: 'E',
      value: 'End'
    }
  ];

  static LEAVE_ROUND_LEAVE = [
    {
      key:'25',
      value:'0.25'
    },
    {
      key: '50',
      value: '0.50'
    },
    {
      key: '1',
      value: '1.00'
    }
  ];

  static GENDER= [
    {
      key: 'B',
      value: 'Both'
    },
    {
      key: 'M',
      value: 'Male'
    },
    {
      key: 'F',
      value: 'Female'
    }
  ];
  static VISITOR_GENDER= [
    {
      key: 0,
      value: 'Other'
    },
    {
      key: 1,
      value: 'Male'
    },
    {
      key: 2,
      value: 'Female'
    }
  ];
  static VACINATION_DOSE= [
    {
      key: 1,
      value: 'First Dose'
    },
    {
      key: 2,
      value: 'Second Dose'
    },
    {
      key: 3,
      value: 'Precaution Dose'
    }
  ];

  static VISITOR_STATUS= [
    {
      key: 'Pending', 
      value: 0
    },
    {
      key:'In',
      value:9
    }
  ]

  static PLEASESELECT = [{
    key: 0,
    value: '--Please Select--'
  }];

  static REQUESTSTATUS =[
    {key:"Pending", value:0},
    {key:"Approved", value:1},
    {key:"Reject", value:2},
    {key:"User Cancel", value:3},
    {key:"Admin Cancel", value:4},
    // {key:"Auto Forward", value:5},
    // {key:"Intimation", value:6},
    {key:"Admin Approve", value:7},
    // {key:"Admin Request", value:8},
  ];
  // static REQUEST_MENU = [
  //   {key:"Leave Request", value:1,ID: [77,128]},
  //   {key:"Leave Cancel", value:2, ID: [78,129]},
  //   {key:"Gate Pass Request", value:3, ID: [134,132]},
  //   {key:"Gate Pass Cancel Request", value:4, ID: [133,135]},
  //   {key:"Punch Regularization", value:5,ID: [79,130]},
  //   {key:"Punch Regularization Cancel", value:6,ID: [80,131]},
  //   {key:"Attendance Punch", value:7,ID: [237,238]},
  //   {key:"Attendance Punch Cancel", value:8,ID: []},
  // ];
  
  // static RequestType={
  //   LeaveRequest:1,
  //   LeaveCancel:2,
  //   GatePassRequest:3,
  //   GatePassCancel:4,
  //   PunchRegularization:5, 
  //   PunchCancel:6
  // };


  static REQUEST_MENU = [
    {key:"Request", value:1,ID: [63]},
    {key:"Cancel", value:2, ID: [64]},
    {key:"Gate Pass Request", value:3, ID: [65]},
    {key:"Gate Pass Cancel Request", value:4, ID: [66]},
    {key:"Punch Regularization", value:5,ID: [67]},
    {key:"Punch Regularization Cancel", value:6,ID: [68]},
    {key:"Attendance Punch", value:7,ID: [69]},
    {key:"Attendance Punch Cancel", value:8,ID: [70]},
  ];

  static LEAVE_APPROVED=[
    {key:"All Leave",value:0},
    {key:"Leave Request",value:1},
    {key:"Leave Cancel",value:2},
    {key:"Gate Pass Request",value:3},
    {key:"Gate Pass Cancel",value:4},
    {key:"MissPunch Regularization",value:5},
    {key:"MissPunch Regularization Cancel",value:6},
    {key:"Mark Punch (With Location)",value:7},
   ]
  
  static RequestType={
    LeaveRequest:1,
    LeaveCancel:2,
    GatePassRequest:3,
    GatePassCancel:4,
    PunchRegularization:5, 
    PunchCancel:6,
    AttendancePunch:7,
    AttendancePunchCancel:8
  };

  static ACTIONS = {
    ACTION: "action",
    EDIT: "edit",
    ADD:"add",
    UPDATE: "update",
    DELETE: "delete",
    PROCESS_SALARY: "Are you sure?",
    CANCEL: "cancel",
    MAPACCESSRIGHT: "mapAccessRight",
    GATEPASS: "gatePassRequest",
    MAPOU:'OUMap',
    POLICYMAP:'PolicyMap',
    SHIFMAPPING: 'shiftMapping',
    PWDRESET:'PwdReset',
    TOGGLEESS:'ToggleEss',
    EMPLOYEEGEOLOCATION:'ToggleGeoLocation',
    NEWVISITORREQUEST:'New Request',
    DEVICESYNC:'Device Sync',
    VISITORINOUT:'Visitor In-Out',
    DASBOARDSETTING:'DashboardSetting',
    ADD_REMARK:'AddRemark',
    REQUESTINFO:'requestInfo',
    REQUESTFLOW:'requestFlow',
    REQUESTEDIT:'requestedit',
    DETAILVIEW:'deatil',
    REPROCESS:'reProcess'
  };

  static MenuAccessLable = {
    Organization:"OG",
    Company: "Company",
    Branch: "Branch",
    Contractor:"Contractor",
    Department: "Department",
    SubDepartment: "Sub Department",
    Category: "Category",
    Designation:"Designation",
    Grade:"Grade",
    Level:"Level",
    Section:"Section",
    Bank:"Bank",
    BankBranch:"BankBranch",
    BusinessType:"Business Type",
    NatureOfWork:"Nature Of Work",
    Dispensary:"ESI Dispensary",
    DocumentType:"Document",
    Qualification:"Qualification",
    AutoCodeSeries:"Auto Emp. Code",
    GlobalSetting:"GlobalSetting",
    GateMaster:"Gate",
    ItemType:"Item",
    VisitorArea:"Visitor Area",
    VisitorType:"Visistor Type",
    VisitPurpose:"Visit Purpose",
    GeneralSetting:"General Setting",
    Attendance_Policy:"Attendance Policy",
    Shift_Master:"Shift Master",
    Employee_Alert: "Employee Alert",
    Leave_Master:"Master",
    Leave_Policy:"Leave Policy",
    Manage: "Manage",
    Map_Organization:"Map Organization",
    Visitor: "Visitor",
    Gate_Pass: "Gate Pass",
    Attendance:"Attendance",
    HolidayMaster:"Holiday Master",
    HolidayPolicy:"Holiday Calendar",
    PayComponent:"Pay Component",
    PayGroup:"pay Group",
    SettlementReason:"Settlement Reason",
    FinancialYear:"Financial Year",
    MachineMaster:"Machine Master",
    ItemMaster:"Item Master",
    CanteenPolicy:"Policy"
  }
  static COUNTRY = [
    {
      countryID: 1,
      countryName: "India"
    }
  ];
  static PLEASE_SELECT = [{
    stateID: null,
    stateName: '--Please Select--'
  }]
  static DEFAULT_SELECT = [{
    id: 0,
    name: '--Please Select--'
  }]

  static DEFAULT_SELECTED = [{
    docID: 0,
    docName: '--Please Select--'
  }]
  
  static MESSAGE_TEXT = {
    UPDATED_MESSAGE: "Changes saved successfully.",
    SAVE_BUSINESS_TYPE_MESSAGE: "Business Type saved successfully.",
    DELETED_MESSAGE: " Record deleted successfully.",
    DELECT_CONFIRM_TEXT: "Do you want to delete this record?",
    UNPROCESS_SALARY_CONFIRM_TEXT: "Do you want to delete this record?",
    PROCESS_SALARY_CONFIRM_TEXT: "Are you sure to Process this salary ?",
    PASSWORD_CHANGED_SUCCESSFULLY:"Your password has been changed successfully!",
    OTP_SENT_SUCCESSFULLY:"Please enter the one time password sent to your registered mobile/email address.",
    PUNCH_DELETE_WITH_MACHINE:"If you delete this punch, punch does not recoverd.",
    PUNCH_DELETE_WITH_MANUAL:"Are you sure delete this punch."
  };
  static SEVERITY = {
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    INFO: "info"
  };
  static CONFIRM_EVENT_TYPE = {
    REJECT: "reject",
    ACCEPT: "accept",
    CANCEL: "cancel"
  };
  static VALIDATION_TEXT = {
    REQUIRED: "is required.",
    LENGTHREQUIRED: "must be at least 5 characters long."
  };
  static ConstValue = {
    ReturnUrl: "returnUrl",
    CurrentUser: "currentUser",
  };
  static APP_TREE_ICON = {
    FOLDER_OPEN: "pi pi-folder-open",
    FOLDER_CLOSE: "pi pi-folder",
    ADD: "pi pi-plus-circle",
    UPDATE: "pi pi-pencil",
    DELETE: "pi pi-trash"
  }
  static PAYMENT_MODE = [
    { value: 1, key: "Cash" },
    { value: 2, key: "Cheque" },
    { value: 3, key: "Bank Transfer" },
    { value: 0, key: "None" }
  ]

  static LONG_DATE_FORMAT = "yyyy-MM-DDTHH:mm:ss";
  static SHORT_DATE_FORMAT = "DD-MMM-YYYY";
    static MODULE_ID = [
    {
      key: "TimeOffice",
      value: 1,
      path:'time-office'
    },
    {
      key: "Communication",
      value: 2
    },
    {
      key: "Payroll",
      value: 3,
      path:'payroll'
    },
    {
      key: "ESS",
      value: 4
    },
    {
      key: "VMS",
      value: 5
    },
    {
      key: "CLMS",
      value: 6
    },
    {
      key: "Statutory Compliance",
      value: 7
    },
    {
      key: "Canteen",
      value: 8
    },
    {
      key: "Access Control",
      value: 9
    }
  ]
  static YNLIST=[
    {value:"Y",key:"Yes"},
    {value:"N",key:"No"}
  ]
 static REQUEST_STATUS=[
   {value:9,key:"In"},
   {value:10,key:"Out"},
   {value:0,key:"Request"}
 ]
 static AllowExtensions={
  "1": "jpeg,jpg,png,bmp",
  "2": "doc,docx",
  "3": "xls,xlsx,xlsm",
  "4": "pdf",
  "5": "pdf,doc,docx,txt,rtf",
  "6": "pdf,doc,docx,xls,xlsx,png",
  "7": "pdf,doc,docx,jpeg,jpg,png,bmp",
  "8": "pdf,doc,docx,txt,xls,xlsx,jpeg,jpg,png,bmp"
  }

  static REPORT_VISITOR_TYPE = [
    {key:'Daily Visitor Entry',value:1},
    {key:'Monthly Visitor Entry',value:2},
    {key:'Yearly visitor entry ',value:3},
    {key:'Currently sign in visitor in company', value:4},
    {key:'Master details of visitor', value:5}
  ]
  static STATUSLIST=[
    {key:'Pending',value:0},
    {key:'In',value:9},
    {key:'Out',value:10}
  ]
  static VISITOR_PRIORITY=[
    {key:'High',value:1},
    {key:'Medium',value:2},
    {key:'Low',value:3}
  ]
  static VEHICAL_TYPE=[
    {key:'None',value:5},
    {key:'Bike',value:1},
    {key:'Car',value:2},
    {key:'Scooter',value:3},
    {key:'Truck',value:4}
  ]
  static ITEM_SCOPE=[
    {key:'None',value:1},
    {key:'In',value:2},
    {key:'Out',value:3}
  ]
  static stateOptions= [{label: 'Yes', value:true}, {label: 'No', value: false}];
  static cutoffDays= [{key: 'Last Days', value:0}, 
  {key: '1', value: 1}, {key: '2', value: 2}, {key: '3', value: 3}, {key: '4', value: 4}, {key: '5', value: 5},
  {key: '6', value: 6}, {key: '7', value: 7}, {key: '8', value: 8}, {key: '9', value: 9},{key: '10', value: 11},
  {key: '11', value: 11}, {key: '12', value: 12}, {key: '13', value: 13}, {key: '14', value: 14}, {key: '15', value: 15},
  {key: '16', value: 16}, {key: '17', value: 17}, {key: '18', value: 18}, {key: '19', value: 19},{key: '20', value: 20},
  {key: '21', value: 21}, {key: '22', value: 22}, {key: '23', value: 23}, {key: '24', value: 24}, {key: '25', value: 25},
  {key: '26', value: 26}, {key: '27', value: 27}, {key: '28', value: 28}, {key: '29', value: 29},{key: '30', value: 30},
  {key: '31', value: 31}
];
static maxworkinghourbasedOn=[
  {key: '--Please Select--',value:null},
  {key:"In Punch",value:"P"},
  {key:"Shift Start",value:"S"},
]
static otosSetting=[
  {key:"None",value:"N"},
  {key:"Over Time",value:"O"},
  {key:"Over Stay",value:"S"},
]

static requestTypeOption=[
  {key:"New Request",value:"N"},
  {key:"Cancel",value:"C"},
]

static ATTENDANCE_SHIFT_TYPE= [
  {
    key: 'Fixed',
    value: 'F'
  },
  {
    key: 'Rotational',
    value: 'R'
  },
];
static WEEKLYOFFWEEK= [
  {
    value:1,
    key: 'I Week'
  },
  {
    value: 2,
    key: 'II Week'
  },
  {
    value: 3,
    key: 'III Week'
  },
  {
    value: 4,
    key: 'IV Week'
  },
  {
    value: 5,
    key: 'V Week'
  },
];
static OTFORMULA=[
  {key:'Working Hrs -Shift Hrs',value:1},
  {key:'Out Time -Shift End Time',value:2},
  {key:'Early Comming and Late Going',value:3}
];
static OTROUNDFORMULA=[
  {key:'Formula 1',value:'1'},
  {key:'Formula 2',value:'2'},
  {key:'Formula 3',value:'3'}
];
static POLICYTYPELIST=[
  {key:'Attendance',value:1},
  {key:'Leave',value:2},
  {key:'Gate Pass',value:3}
];
static ORGANIZATIONLIST=[
  {key:'Organization',value:1},
  {key:'Company',value:2},
  {key:'Branch',value:3},
  {key:'Contractor',value:4},
  {key:'Category',value:5},
  {key:'Department',value:6},
  {key:'SubDepartment',value:7},
  {key:'Designation',value:8},
  {key:'Level',value:9},
  {key:'Section',value:10},
  {key:'Grade',value:11},
]
static LOCATIONLIST=[
 {key:'--Please Select--',value:0},
  {key:'Employee Type',value:12},
  {key:'Employee Status',value:13},
]
static LEAVE_MASTER_FIELD = {
  Minimum_Work_Hours:'Minimum Work Hours For Leave',
  Max_Time_Duration: 'Max Time Duration for Leave'
}
static SHIFT_MASTER_FIELD = {
  SHIFT_START_TIME:'shiftStartTime',
  SHIFT_END_TIME:'shiftEndTime',
  Shift_Duration:'shiftDuration',
  Lunch_Start_Time:'Lunch Start Time',
  Lunch_End_Time: 'Lunch End Time',
  Lunch_Duration: 'Lunch Duration',
  Lunch_Include_In_Shift_Duration:'Lunch Include In Shift Duration',
  Min_Hours_To_Full_Day_Present: 'Min Hours To Full Day Present',
  Min_Hours_To_Half_Day_Present: 'Min Hours To Half Day Present',
  Max_Absent_Hours_For_SRT: 'Max Absent Hours For SRT',
  First_Half_Consider_Up_to: 'First Half Consider Up to',
  Max_Working_Hours: 'Max Working Hours',
  Permissible_Late:'Permissible Late',
  Absent_After_Late: 'Absent After Late',
  Absent_Before_Early: 'Absent Before Early',
  Permissible_Early: 'Permissible Early',
  HalfDay_After_Late: 'HalfDay After Late',
  HalfDay_Before_Early: 'HalfDay Before Early',
  Maximum_OT: ' Maximum OT',
  Minimum_OT: 'Minimum OT',
  OT_Start_After: 'OT Start After',
  OT_Deduction:'OT Deduction',
  OT_Remove_After_Late:'OT Remove After Late',
  OT_Dinner_Deduction:'OT Dinner Deduction',
  OT_Duration_for_Dinner_Deduction: 'OT Duration for Dinner Deduction',
  Minimum_Work_For_Shift_Allowance: 'Minimum Work For Shift Allowance',
  Late_For_Shift_Allowance: 'Late For Shift Allowance',
  Early_For_Shift_Allowance: 'Early For Shift Allowance',
  Shift_Allowance_Amount: 'Shift Allowance Amount'
}
static ALLOWCOFFOR=[
  {key:'Over Time',value:'O'},
  {key:'Over Stay',value:'S'},
  {key:'Both',value:'B'}
]
static PUNCHINSHIFT=[
  {key:'No Punch',value:0},
  {key:'One',value:1},
  {key:'Two',value:2},
  {key:'Four',value:4},
  {key:'Multiple',value:99},
]
static HOLIDAY_TYPE =[
  {key:'Normal',value:'D'},
  {key:'National',value:'N'},
  // {key:'Optional',value:'R'},
]
static REPORT_CATEGORY = [
  {
    key:'Dynamic',
    value: 'D'
  },
  {
    key:'Statutory',
    value: 'S'
  },
  {
    key:'Custom',
    value: 'C'
  }
]
static INOUTLIST=[
  {key:'In',value:'I'},
  {key:'Out',value:'O'}
];
static PUNCHTYPELIST=[
  {key:'Manual',value:1},
  {key:'According Shift Start and End',value:2},
  {key:'According Shift Start',value:3},
  {key:'According Shift End',value:4},
];
static ROSTERFLAGLIST=[
  {key:'Update',value:'U'},
  {key:'Holiday',value:'H'},
];
static shiftChangeactionList=[
  {key:'select',value:null},
  {key:'Shift Change',value:1},
  {key:'Shift Replace',value:2},
  {key:'Shift Copy',value:3},
];
static LEAVE_NOT_CLUB_LIST_HALFDAY=[
  {key:"SL",value:1},
  {key:"EL",value:2},
  {key:"OD",value:3},
  {key:"COF",value:4},
  {key:"LWP",value:5},
  {key:"HLD",value:6},
  {key:"SPL",value:7}
 ];
 static LEAVE_NOT_CLUB_LIST=[
  {key:"SL",value:1},
  {key:"EL",value:2},
  {key:"OD",value:3},
  {key:"COF",value:4},
  {key:"LWP",value:5},
  {key:"HLD",value:6},
  {key:"SPL",value:7}
];
static FileType=[
  {
    key:'E',
    value:'Excel'
  },
  {
    key:'P',
    value:'Pdf'
  },
  {
    key:'H',
    value:'Html'
  }
];
static REPORT_GENERATE_EXT = {
  A: ['P','E','H'],
  B: ['E','H'],
  H: ['H'],
  E: ['E'],
  P: ['H','P']
}
// 1		Attendance
// 2		Leave	
// 3		Holiday Calendar	
// 4		Late/Early Deduction Policy

static LeaveCreditNewJoineeRule=[
  {key:"Credit leaves as per DOC (Rule of 15)",value:1},
  {key:"Exclude Joining Month",value:2},
  {key:"Include Joining Month",value:3},
  {key:"No leave credit in mid cycle joining",value:4},
  {key:"Proportionate as per DOC",value:5},
  {key:"Proportionate as per DOJ",value:6},
  {key:"Proportionate will not be consider",value:7},
  {key:"Rule of 15 (Credit all or credit half leaves)",value:8},
  {key:"Rule of 15 (Credit all or do not credit leaves)",value:9},
];
static RosterLockUnlock=[
  {key:"Lock",value:"Y"},
  {key:"Unlock",value:"N"},
]
static USER_ROLES=[
  {
  key:	'Self',
  value: 1
  },
  {
  key:	'Reporting Manager',
  value: 2
  },
  {
  key:	'Upper Manager',
  value: 3
  },
  {
  key:	'Functional Manager',
  value: 4
  },
  {
  key:	'HOD',
  value: 5
  },
  {
  key:	'Branch Head',
  value: 6
  },
  {
  key:	'Section Supervisor',
  value: 7
  },
  {
  key:	'SubDepartment Supervisor',
  value: 8
  },
  {
  key:	'Other',
  value: 9
  }
]
static GATEPASSTYPE = [
  {key:"Official",value:"O"},
  {key:"Personal",value:"P"},
]
static PUNCH_REQUEST_TYPE = [
  {key:"In Punch",value:"I"},
  {key:"Out Punch",value:"O"},
  {key:"Both",value:"B"},
]
static PUNCH_TYPE = [
  {key:"Forget",value:"F"},
  {key:"Replace",value:"R"},
]

static IMPORT_ACTIONS=[
  {key:"Insert",value:"I"},
  {key:"Update",value:"U"},
]
static REQUESTTYPE=[
  {key:"Request",value:"N"},
  {key:"Cancel",value:"C"}
]
static SelfServiceLeaveRequest=[
  {key:"Pending",value:0},
  {key:"Approved",value:1},
  {key:"Reject",value:2},
  {key:"User Cancel",value:3},
  {key:"Admin Cancel",value:4},
  {key:"Admin Approve",value:7},
]
static YEAR_LIST=[
  {key:'2021',value:'2021'},
  {key:'2022',value:'2022'},
  {key:'2023',value:'2023'},
  {key:'2024',value:'2024'},
  {key:'2025',value:'2025'},
  {key:'2026',value:'2026'},
  {key:'2027',value:'2027'},
  {key:'2028',value:'2028'},
  {key:'2029',value:'2029'},
]
static ACCRUAL_TYPE=[
  {key:'Monthly',value:'M'},
  {key:'Quarterly',value:'Q'},
  {key:'Yearly',value:'Y'},
];
static MONTH_LIST=[
  {key:'Jan',value:'Jan'},
  {key:'Feb',value:'Feb'},
  {key:'Mar',value:'Mar'},
  {key:'Apr',value:'Apr'},
  {key:'May',value:'May'},
  {key:'Jun',value:'Jun'},
  {key:'Jul',value:'Jul'},
  {key:'Aug',value:'Aug'},
  {key:'Sep',value:'Sep'},
  {key:'Oct',value:'Oct'},
  {key:'Nov',value:'Nov'},
  {key:'Dec',value:'Dec'},
];
static PFROUNDING=[
  {key:'None',value:0},
  {key:'50 Paise',value:2},
  {key:'1 Rupee',value:3},
]
static PFONARREAR=[
  {key:'Salary and Arrear separately',value:1},
  {key:'Consolidate amount(Salary+Arrear)',value:2},
  {key:'Only on positive Arrear',value:3},
]
static VPFON=[
  {key:'Percentage',value:'P'},
  {key:'Amount',value:'A'},
]
static DEDUCTIONRULE=[
  {key:'Percentage',value:'P'},
  {key:'Amount',value:'A'},
  {key:'Slab',value:'S'}
]
static BONUSONWHICH=[
  {key:'Wages',value:'W'},
  {key:'Salary',value:'S'}
]
static AMOUNT_CALCULATION_ON=[
  {key:'Actual',value:'A'},
  {key:'Fixed',value:'F'}
]

static  OU_POLICY_PAYGROUP= {
  GET: "GET_PAYGROUP_ORGANIZATION_MAPPING",
  UPDATE:'UPDATE_PAYGROUP_ORGANIZATION_MAPPING'
}

static CALCULATOR_CONSTANT= [
  {
  row:1,
  value:[
    {
      key:'>',
      value:'Greater Than'
    },
    {
      key:'<',
      value:'Less Than'
    },
    {
      key:'=',
      value:'Equal To'
    },
    {
      key:'(',
      value:'Start bracket'
    },
    {
      key:')',
      value:'Start Bracket'
    }]
},{
row:2,
value:[
  {
    key:'5',
    value:'5'
  },{
    key:'6',
    value:'6'
  },
  {
    key:'7',
    value:'7'
  },
  {
    key:'8',
    value:'8'
  },
  {
    key:'9',
    value:'9'
  }]
},{
  row:3,
  value:[
  
  {
    key:'4',
    value:'4'
  },
  {
    key:'3',
    value:'3'
  },
  {
    key:'2',
    value:'2'
  },
  {
    key:'1',
    value:'1'
  },{
    key:'0',
    value:'0'
  }],
},
// {
//   row:4,
//   value:[
//   {
//     key:'3',
//     value:'3'
//   },
//   {
//     key:'2',
//     value:'2'
//   },
//   {
//     key:'1',
//     value:'1'
//   }],
// }, 
// {
//   row:5,
//   value:[
    
    
//   ]
// }
];
static CONDITION_KEYWORD=[
  {
    key:'If',
    value:'If'
  },
  {
    key:'ELSE',
    value:'Else'
  },
  {
    key:'WHEN',
    value:'when'
  },
  {
    key:'THEN',
    value:'then'
  },{
    key:'END',
    value:'End'
  },{
    key:'BEGIN',
    value:'Begin'
  },{
    key:'AND',
    value:'And'
  },{
    key:'Or',
    value:'Or'
  },
  {
    key:'BETWEEN',
    value:'Between'
  }
  
]
static SALARY_STRUCT_ASSIGN_STATUS=[
  {value:'',key:"All"},
  {value:'EMPA',key:"Assigned"},
  {value:'EMPU',key:"UnAssigned"}
]
static SALARY_STRUCT_APPROVAL_STATUS=[
  {value:1,key:"Approved"},
  {value:0,key:"Pending"},
  {value:-1,key:"History"}
]
static SALARY_STRUCT_EMPLOYEE_TYPE=[
  {value:"M",key:"Monthly"},
  {value:"W",key:"Weekly"},
  {value:"D",key:"Daily"}
]
static RELEASE_ACTION_R_H=[
  {key:'Release',value:'R'},
  {key:'Hold',value:'H'}
]
static RELEASE_ACTION_R_U=[
  {key:'Release',value:'R'},
  {key:'Un-Hold',value:'U'}
]
static INTRESTTYPE=[
  {key:"None",value:"N"},
  {key:"Fixed",value:"F"},
  {key:"Compound Interest",value:"C"}
]
static PAID_STATE_LIST=[
  {key:'UnProcess',value:'U'},
  {key:'Process',value:'P'},
]
static EMPLOYEE_STATUS=[
  {value:1,key:"Probation"},
  {value:2,key:"Confirmed"},
  {value:3,key:"Resigned"},
  {value:4,key:"Relieved"},
  {value:5,key:"Settled"}
]
static SEARCH_DATE_TYPE_LIST=[
  {value:"",key:"NONE"},
  {value:"J",key:"Joining Date"},
  {value:"R",key:"Relieving Date"},
  {value:"L",key:"Leaving Date"}
]
static CHALLAN_TYPE_LIST=[
  {value:"",key:"-SELECT-"},
  {value:"PF",key:"PF"},
  {value:"ESI",key:"ESI"},
  {value:"LWF",key:"LWF"},
  {value:"PT",key:"PT"}
]
static BONUS_PROCESS_STATE_LIST=[
  {key:'Process',value:'P'},
  {key:'UnProcess',value:'U'},
]
static BackgroundColors: Array<string>=['background-green','background-red','background-blue','background-orange','background-grey','background-aqua','background-teal','background-pink','background-blue','background-orange','background-grey','background-aqua','background-teal','background-pink']

static POLICY_BASED_ON_LIST=[
  {key:'Late/Early',value:'A'},
  {key:'Attendance',value:'S'},
]
static DEDUCT_FORM_LIST=[
  {key:'None',value:'N'},
  {key:'Leave',value:'L'},
  {key:'Attendance',value:'A'},
  // {key:'Working Hour',value:'W'},
  // {key:'Over Time',value:'O'},
]

static DEDUCT_Value_LIST=[
  {key:'Half',value:'0.5'},
  {key:'Full ',value:'1.0'},
]
ATTENDANCE_STATUS_LIST
static AND_OR_LIST=[
  {key:'AND',value:'AND'},
  {key:'OR ',value:'OR'},
]
static ATTENDANCE_STATUS_LIST=[
  {key:'MIS',value:'MIS'},
  {key:'SRT',value:'SRT'},
  {key:'HLF',value:'HLF'},
]
static ITEM_MASTER_FIELD = {
  START_TIME:'Start Time',
   END_TIME: 'End Time'
 }
 
 static ITEM_TYPE_MASTER=[
   {key:'None',value:'N'},
   {key:'Contribution',value:'C'},
   {key:'Subsidized',value:'S'},
 ]

 static POLICYBASEDONLIST=[
  {key:'Time Zone',value:'T'},
  {key:'Item',value:'I'},
]
static NUMBEROFPHOTO=[
  {key:'None',value:0},
  {key:'Single Photo',value:1},
  {key:'Multiple Photo',value:2},
]
static PUNCH_TIME = {
  PUNCHTIME:'Start Time'
 }
}
