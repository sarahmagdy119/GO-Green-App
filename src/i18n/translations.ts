// i18n/translations.ts
export const translations = {
  en: {
    login: {
      title: 'Welcome back',
      username: 'Username',
      password: 'Password',
      submit: 'Login',
      usernameRequired: 'Username is required',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      loginFailed: 'Invalid username or password',
    },

    scan: {
      // Scan Home
      restaurantTitle: 'Restaurant',
      tapToScan: 'Tap to scan',
      hint: 'scan to view details',
      failed: 'Scan failed, try again',
      notSupported: 'NFC is not supported on this device',
      requestFailed: 'Could not check access, try again',
      activityLogs: 'Activity Logs',
      enterRoomNumber: 'Enter Room Number',
      submit: 'Submit',

      // Access Result
      allowed: 'ALLOWED',
      notAllowed: 'Not Allowed',
      clientDetails: 'Client Details',
      guestName: 'Guest Name',
      roomNumber: 'Room Number',
      allowedCompanions: 'Allowed Companions',
      guests: 'Guests',
      reservationCategory: 'Reservation category',
      checkIn: 'Check in',
      checkOut: 'Check out',
      backToScan: 'Back To Scan',
      accessibleAreas: 'Accessible Areas',
      viewMore: 'View More',

      // Towel Details
      numberOfGuests: 'Number Of Guests',
      towelsTaken: 'Towels Taken',
      towelTracking: 'Towel Tracking',
      trackGuestTowelUsage: 'Track guest towel usage',
      towelsIn: 'Towels In',
      towelsOut: 'Towels Out',
      towelsReturned: 'Towels Returned',
      outOfAllowed: 'Out Of 4 Allowed',
      submitting: 'Submitting',
      remainingAvailable: 'Remaining Available',

      // Towel Confirmation
      confirm: 'Confirm',
      towelsTakenTitle: 'Towels Taken',
      towelsTakenSubtitle: 'Towels have been successfully taken',
      towelsReturnedTitle: 'Towels Returned',
      towelsReturnedSubtitle: 'Towels have been successfully returned',

      // Activity Log
      back: '← Back',
      towelActivityLog: 'Towel Activity Log',
      activeRooms: 'Active Rooms',
      towelsOutCount: 'Towels Out',
      deselectAll: 'Deselect All',
      selectAll: 'Select All',
      markAsReturned: 'Mark as Returned',
      cancel: 'Cancel',
      confirmationMessage:
        'Are you sure you want to mark the selected items as returned?',
      noActiveTowels: 'No active towels right now',
      numberOfTowels: 'Number of towels',
      location: 'Location',
      noHistoryFound: 'No history found',
      roomLabel: 'Room',
      guestLabel: 'Guest',
      towelsLabel: 'Towels',
      statusLabel: 'Status',
    },
  },

  ar: {
    login: {
      title: 'أهلاً بيك تاني',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      usernameRequired: 'اسم المستخدم مطلوب',
      passwordRequired: 'كلمة المرور مطلوبة',
      passwordMinLength: 'كلمة المرور لازم تكون 6 حروف على الأقل',
      loginFailed: 'اسم المستخدم أو كلمة المرور غلط',
    },

    scan: {
      // Scan Home
      restaurantTitle: 'المطعم',
      tapToScan: 'اضغط للمسح',
      hint: 'امسح لعرض التفاصيل',
      failed: 'فشل المسح، حاول تاني',
      notSupported: 'الجهاز ده مش بيدعم NFC',
      requestFailed: 'حصلت مشكلة في التحقق، حاول تاني',
      activityLogs: 'سجل النشاط',
      enterRoomNumber: 'أدخل رقم الغرفة',
      submit: 'تأكيد',

      // Access Result
      allowed: 'مسموح',
      notAllowed: 'غير مسموح',
      clientDetails: 'بيانات العميل',
      guestName: 'اسم الضيف',
      roomNumber: 'رقم الغرفة',
      allowedCompanions: 'عدد المرافقين',
      guests: 'ضيوف',
      reservationCategory: 'فئة الحجز',
      checkIn: 'تاريخ الوصول',
      checkOut: 'تاريخ المغادرة',
      backToScan: 'رجوع للمسح',
      accessibleAreas: 'المناطق المسموح دخولها',
      viewMore: 'عرض المزيد',

      // Towel Details
      numberOfGuests: 'عدد الضيوف',
      towelsTaken: 'المناشف المسحوبة',
      towelTracking: 'متابعة المناشف',
      trackGuestTowelUsage: 'متابعة استخدام الضيف للمناشف',
      towelsIn: 'المناشف المرتجعة',
      towelsOut: 'المناشف المسحوبة',
      towelsReturned: 'المناشف المرتجعة',
      outOfAllowed: 'من أصل 4 مسموح',
      submitting: 'جاري التأكيد',
      remainingAvailable: 'المتاح',

      // Towel Confirmation
      confirm: 'تم',
      towelsTakenTitle: 'تم سحب المناشف',
      towelsTakenSubtitle: 'تم تسجيل سحب المناشف بنجاح',
      towelsReturnedTitle: 'تم إرجاع المناشف',
      towelsReturnedSubtitle: 'تم تسجيل إرجاع المناشف بنجاح',

      // Activity Log
      back: '← رجوع',
      towelActivityLog: 'سجل نشاط المناشف',
      activeRooms: 'الغرف النشطة',
      towelsOutCount: 'المناشف المسحوبة',
      deselectAll: 'إلغاء تحديد الكل',
      selectAll: 'تحديد الكل',
      markAsReturned: 'تسجيل كمرتجع',
      cancel: 'إلغاء',
      confirmationMessage:
        'هل أنت متأكد أنك تريد تسجيل العناصر المحددة كمرتجعة؟',
      noActiveTowels: 'مفيش مناشف مسحوبة حاليًا',
      numberOfTowels: 'عدد المناشف',
      location: 'المكان',
      noHistoryFound: 'مفيش سجل حركات',
      roomLabel: 'الغرفة',
      guestLabel: 'الضيف',
      towelsLabel: 'المناشف',
      statusLabel: 'الحالة',
    },
  },
} as const;

export type Language = keyof typeof translations;