const ROUTES = {
  HOMEPAGE: {
    path: '/',
    name: 'HomePage',

    JOB: {
      path: '/job',
      name: 'Find Jobs',
    },

    COMPANY: {
      path: '/company',
      name: 'Browse Companies',
    },
  },

  //Public

  //Authentication

  AUTH: {
    SIGNIN: {
      path: '/signin',
      name: 'Sign In',
    },

    SIGNUP: {
      path: '/signup',
      name: 'Sign Up',
    },
  },

  //Admin
  ADMIN: {
    Home: {
      path: '/ad',
      name: 'DashBoard',
    },
  },

  //Candidate
  CA: {
    HOME: {
      path: '/ca',
      name: 'DashBoard',

      APPLICATIONLIST: {
        path: '/ca/application-list',
        name: 'Application List',
      },

      BROWSECOMPANY: {
        path: '/ca/browse-company',
        name: 'Browse Company',
      },

      MESSAGE: {
        path: '/ca/message',
        name: 'Message',
      },

      PROFILE: {
        path: '/ca/profile',
        name: 'Profile',
      },

      SETTINGS: {
        path: '/ca/settings',
        name: 'Settings',
      },

      FINDJOB: {
        path: '/ca/find-job',
        name: 'Find Job',
      },
    },
  },

  //Company
  CO: {
    HOME: {
      path: '/co',
      name: 'DashBoard',

      APPLICANTLIST: {
        path: '/co/applicant-list',
        name: 'Applicant List',
      },
      JOBLIST: {
        path: '/co/job-list',
        name: 'Job List',
      },
      MESSAGE: {
        path: '/co/messages',
        name: 'Message',
      },
      PROFILE: {
        path: '/co/profile',
        name: 'Profile',
      },
      SCHEDULE: {
        path: '/co/schedule',
        name: 'Schedule',
      },
      SETTINGS: {
        path: '/co/settings',
        name: 'Settings',
      },
    },
  },
};

export default ROUTES;
