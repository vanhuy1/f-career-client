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
    Home: {
      path: '/ca',
      name: 'HomePage',
    },
  },

  //Company
  CO: {
    Home: {
      path: '/co',
      name: 'HomePage',
    },
  },
};

export default ROUTES;
