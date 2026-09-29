import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setApiToken } from '../utils/api';
import {
  INITIAL_USERS,
  INITIAL_PHOTOGRAPHERS,
  INITIAL_PACKAGES,
  INITIAL_PORTFOLIO,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_PAYMENTS,
  INITIAL_REFUNDS,
  INITIAL_PAYMENT_ISSUES,
  INITIAL_SYSTEM_LOGS,
  INITIAL_STUDIOS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data State with LocalStorage Persistence
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('photohub_mock_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [photographers, setPhotographers] = useState(() => {
    const saved = localStorage.getItem('photohub_mock_photographers_v5');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOGRAPHERS;
  });
  
  const [studios, setStudios] = useState(INITIAL_STUDIOS);
  const [packages, setPackages] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // .NET Entities
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [paymentIssues, setPaymentIssues] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // Authentication & Guest State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  // Modals & Navigation
  const [selectedPhotographerModal, setSelectedPhotographerModal] = useState(null);
  const [activeBookingModal, setActiveBookingModal] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login', redirectTab: null, actionPayload: null });
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [activeTabParams, setActiveTabParams] = useState(() => {
    return window.history.state?.tabParams || null;
  });

  // Global Search State from Landing Page
  const [searchParams, setSearchParams] = useState({
    city: 'All',
    category: 'All',
    date: ''
  });

  // Initial Data Fetching from Microservices
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const savedUsers = localStorage.getItem('photohub_mock_users_v3');
        const fallbackUsers = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
        const savedPhotos = localStorage.getItem('photohub_mock_photographers_v5');
        const fallbackPhotos = savedPhotos ? JSON.parse(savedPhotos) : INITIAL_PHOTOGRAPHERS;

        const [usersRes, photoRes, pkgRes, portRes, bookRes, revRes] = await Promise.all([
          api.get('/users').catch(() => ({ data: fallbackUsers })),
          api.get('/photographers').catch(() => ({ data: fallbackPhotos })),
          api.get('/packages').catch(() => ({ data: INITIAL_PACKAGES })),
          api.get('/portfolio').catch(() => ({ data: INITIAL_PORTFOLIO })),
          api.get('/bookings').catch(() => ({ data: INITIAL_BOOKINGS })),
          api.get('/reviews').catch(() => ({ data: INITIAL_REVIEWS })),
        ]);
        
        setUsers(Array.isArray(usersRes.data) && usersRes.data.length ? usersRes.data : fallbackUsers);
        setPhotographers(Array.isArray(photoRes.data) && photoRes.data.length ? photoRes.data : fallbackPhotos);
        setPackages(Array.isArray(pkgRes.data) && pkgRes.data.length ? pkgRes.data : INITIAL_PACKAGES);
        setPortfolio(Array.isArray(portRes.data) && portRes.data.length ? portRes.data : INITIAL_PORTFOLIO);
        setBookings(Array.isArray(bookRes.data) && bookRes.data.length ? bookRes.data : INITIAL_BOOKINGS);
        setReviews(Array.isArray(revRes.data) && revRes.data.length ? revRes.data : INITIAL_REVIEWS);

        const [payRes, refRes, issueRes, logRes] = await Promise.all([
          api.get('/payments').catch(() => ({ data: INITIAL_PAYMENTS })),
          api.get('/refunds').catch(() => ({ data: INITIAL_REFUNDS })),
          api.get('/payment-issues').catch(() => ({ data: INITIAL_PAYMENT_ISSUES })),
          api.get('/analytics/logs').catch(() => ({ data: INITIAL_SYSTEM_LOGS })),
        ]);

        setPayments(Array.isArray(payRes.data) && payRes.data.length ? payRes.data : INITIAL_PAYMENTS);
        setRefunds(Array.isArray(refRes.data) && refRes.data.length ? refRes.data : INITIAL_REFUNDS);
        setPaymentIssues(Array.isArray(issueRes.data) && issueRes.data.length ? issueRes.data : INITIAL_PAYMENT_ISSUES);
        setSystemLogs(Array.isArray(logRes.data) && logRes.data.length ? logRes.data : INITIAL_SYSTEM_LOGS);
      } catch (error) {
        console.error("Microservices unavailable, falling back entirely to mock data");
        const savedUsers = localStorage.getItem('photohub_mock_users');
        const savedPhotos = localStorage.getItem('photohub_mock_photographers_v4');
        setUsers(savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS);
        setPhotographers(savedPhotos ? JSON.parse(savedPhotos) : INITIAL_PHOTOGRAPHERS);
        setStudios(INITIAL_STUDIOS);
        setPackages(INITIAL_PACKAGES);
        setPortfolio(INITIAL_PORTFOLIO);
        setBookings(INITIAL_BOOKINGS);
        setReviews(INITIAL_REVIEWS);
        setPayments(INITIAL_PAYMENTS);
        setRefunds(INITIAL_REFUNDS);
        setPaymentIssues(INITIAL_PAYMENT_ISSUES);
        setSystemLogs(INITIAL_SYSTEM_LOGS);
      }
    };
    fetchInitialData();
  }, []);

  // Auth state is now ephemeral and not persisted to storage

  useEffect(() => {
    localStorage.setItem('photohub_mock_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('photohub_mock_photographers_v5', JSON.stringify(photographers));
  }, [photographers]);

  // History API Integration for Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state && state.tab) {
        setActiveTab(state.tab);
        setActiveTabParams(state.tabParams || null);
        if (state.actionPayload) {
          setActiveBookingModal(state.actionPayload);
        }
      } else {
        const hash = window.location.hash.replace('#', '');
        setActiveTab(hash || 'home');
        setActiveTabParams(null);
      }
    };
    
    // Set initial state without pushing a new entry
    if (!window.history.state) {
      window.history.replaceState({ tab: activeTab, tabParams: activeTabParams }, '', `#${activeTab}`);
    }
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // System Audit Logger
  const addSystemLog = async (action, tableName, recordId, oldValue, newValue) => {
    const newLog = {
      log_id: Date.now(),
      admin_id: currentUser?.role === 'admin' ? currentUser.user_id : 100,
      action,
      table_name: tableName,
      record_id: recordId,
      old_value: typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || ''),
      new_value: typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || ''),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setSystemLogs(prev => [newLog, ...prev]);
    try {
      await api.post('/analytics/logs', newLog);
    } catch (e) {
      // fallback ignore
    }
  };

  // Login Function
  const loginUser = async (email, password) => {
    if (email === 'rocky123@gmail.com' && password === 'rocky@123') {
      const adminUser = {
        user_id: 'admin-999',
        name: 'Rocky Admin',
        email: 'rocky123@gmail.com',
        role: 'admin',
        token: 'mock-admin-token'
      };
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      setApiToken(adminUser.token);
      navigateToTab('dashboard');
      return { success: true, user: adminUser };
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Map Java JwtAuthenticationResponse to frontend user object
      const foundUser = {
        user_id: res.data.userId,
        name: res.data.name,
        email: email,
        role: res.data.role ? res.data.role.toLowerCase() : 'client',
        token: res.data.accessToken
      };

      setCurrentUser(foundUser);
      setIsAuthenticated(true);
      setApiToken(foundUser.token);
      addSystemLog('USER_LOGIN', 'USERS', foundUser.user_id, 'Logged out', 'Logged in');
      
      // Navigate based on params or default to dashboard
      if (activeTabParams?.redirectTab) {
        setActiveTab(activeTabParams.redirectTab);
        if (activeTabParams.actionPayload) {
          setActiveBookingModal(activeTabParams.actionPayload);
        }
      } else {
        navigateToTab('home');
      }
      return { success: true, user: foundUser };
    } catch (e) {
      let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        foundUser = { ...foundUser, role: foundUser.role?.toLowerCase() || 'client' };
        setCurrentUser(foundUser);
        setIsAuthenticated(true);
        setApiToken(foundUser.token || 'mock_jwt_token');
        addSystemLog('USER_LOGIN', 'USERS', foundUser.user_id, 'Logged out', 'Logged in');
        
        if (activeTabParams?.redirectTab) {
          setActiveTab(activeTabParams.redirectTab);
          if (activeTabParams.actionPayload) {
            setActiveBookingModal(activeTabParams.actionPayload);
          }
        } else {
          navigateToTab('home');
        }
        return { success: true, user: foundUser };
      }
      return { success: false, message: 'Invalid email or password' };
    }
  };

  // Register Function
  const registerUser = async (name, email, password, phone, role) => {
    const newUserObj = { name, email, password, phone: phone || '9392752994', role: role || 'client' };

    try {
      const res = await api.post('/auth/register', newUserObj);
      
      // Backend returns ApiResponse(true, "User registered successfully")
      if (res.data && res.data.success) {
        // Automatically login the user to get their JWT token and user_id
        return await loginUser(email, password);
      } else {
        throw new Error(res.data?.message || 'Registration failed');
      }
    } catch (e) {
      // Fallback to mock data if backend fails
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { success: false, message: 'Email address is already registered' };
      }

      const newUserId = Date.now();
      const newUser = {
        user_id: newUserId,
        name,
        email,
        password: 'hashed_' + password,
        phone: phone || '9392752994',
        role: role || 'client',
        profile_picture: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg',
        status: 'active',
        is_deleted: false,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setUsers(prev => [newUser, ...prev]);

      if (role === 'photographer') {
        const newPhotographerId = newUserId + 100;
        const newPhotographer = {
          photographer_id: newPhotographerId,
          user_id: newUserId,
          name: name,
          experience: 1,
          bio: `Professional ${name} specializing in high quality photography services.`,
          location: 'Banaswadi, Bangalore',
          rating: 5.0,
          price_per_hour: 100.00,
          is_verified: false,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          cover_image: 'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg',
          specialties: ['Wedding', 'Portrait']
        };
        setPhotographers(prev => [newPhotographer, ...prev]);
        try { await api.post('/photographers', newPhotographer); } catch(err){}
      }

      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setApiToken('mock_jwt_token');
      addSystemLog('REGISTER_USER', 'USERS', newUserId, null, newUser);
      
      const route = 'home';
      
      if (activeTabParams?.redirectTab) {
        setActiveTab(activeTabParams.redirectTab);
        if (activeTabParams.actionPayload) {
          setActiveBookingModal(activeTabParams.actionPayload);
        }
      } else {
        navigateToTab('home');
      }
      return { success: true, user: newUser };
    }
  };

  const logoutUser = () => {
    if (currentUser) {
      addSystemLog('USER_LOGOUT', 'USERS', currentUser.user_id, 'Logged in', 'Logged out');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setApiToken(null);
    setActiveTab('home');
  };

  const navigateToTab = (tab, actionPayload = null, tabParams = null) => {
    let finalTab = tab;
    let finalParams = tabParams;

    if (tab === 'home') {
      finalTab = 'home';
      finalParams = null;
    } else if (!isAuthenticated && tab === 'dashboard') {
      finalTab = 'login';
      finalParams = { mode: 'login', redirectTab: tab, actionPayload };
    } else if (isAuthenticated && (tab === 'dashboard' || tab === 'login') && currentUser) {
      finalTab = currentUser.role === 'client' ? 'client/home' : `${currentUser.role}/dashboard`;
    }

    setActiveTab(finalTab);
    setActiveTabParams(finalParams);
    if (actionPayload) {
      setActiveBookingModal(actionPayload);
    }

    if (window.location.hash !== `#${finalTab}`) {
      window.history.pushState({ tab: finalTab, tabParams: finalParams, actionPayload }, '', `#${finalTab}`);
    }
  };

  const switchUserRole = (role) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    setApiToken(targetUser.token || 'mock_jwt_token');
    addSystemLog('USER_ROLE_SWITCH', 'USERS', targetUser.user_id, currentUser?.role, role);
  };

  const createBooking = async (bookingData, paymentMethod) => {
    if (!currentUser) return null;
    const newBookingId = Date.now();
    const newPaymentId = newBookingId + 1000;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newBooking = {
      booking_id: newBookingId,
      user_id: currentUser.user_id,
      photographer_id: bookingData.photographer_id,
      event_id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      package_id: bookingData.package_id,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
      location: bookingData.location,
      special_requirements: bookingData.special_requirements || '',
      total_price: parseFloat(bookingData.total_price),
      booking_status: 'Confirmed',
      created_at: nowStr
    };

    const newPayment = {
      payment_id: newPaymentId,
      booking_id: newBookingId,
      amount: parseFloat(bookingData.total_price),
      payment_method: paymentMethod || 'Credit Card',
      payment_gateway: 'PhotoHub Secure Pay',
      transaction_id: `TXN_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      payment_status: 'Completed',
      paid_at: nowStr,
      created_at: nowStr
    };

    try {
      await api.post('/bookings', newBooking);
      await api.post('/payments', newPayment);
    } catch(err) {
      console.warn("Backend sync failed, falling back to local state");
    }

    setBookings(prev => [newBooking, ...prev]);
    setPayments(prev => [newPayment, ...prev]);

    addSystemLog('CREATE_BOOKING', 'BOOKINGS', newBookingId, null, newBooking);
    addSystemLog('CREATE_PAYMENT', 'PAYMENTS', newPaymentId, null, newPayment);

    return { booking: newBooking, payment: newPayment };
  };

  const cancelBooking = async (bookingId, reason) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setBookings(prev => prev.map(b => {
      if (b.booking_id === bookingId) {
        return {
          ...b,
          booking_status: 'Cancelled',
          cancel_reason: reason,
          cancelled_by: currentUser.user_id,
          cancelled_at: nowStr,
          refund_status: 'Requested'
        };
      }
      return b;
    }));

    try {
      await api.put(`/bookings/${bookingId}/cancel`, { reason });
    } catch(err) {}

    const payment = payments.find(p => p.booking_id === bookingId);
    if (payment) {
      const newRefundId = Date.now();
      const newRefund = {
        refund_id: newRefundId,
        booking_id: bookingId,
        payment_id: payment.payment_id,
        refund_amount: payment.amount,
        refund_reason: reason,
        refund_status: 'Pending',
        created_at: nowStr
      };
      setRefunds(prev => [newRefund, ...prev]);
      addSystemLog('REQUEST_REFUND', 'REFUNDS', newRefundId, null, newRefund);
      
      try {
        await api.post('/refunds', newRefund);
      } catch(err) {}
    }
  };

  const reportPaymentIssue = async (paymentId, issueType, description) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newIssueId = Date.now();
    const newIssue = {
      issue_id: newIssueId,
      payment_id: paymentId,
      user_id: currentUser.user_id,
      issue_type: issueType,
      description: description,
      status: 'Open',
      created_at: nowStr
    };
    setPaymentIssues(prev => [newIssue, ...prev]);
    addSystemLog('REPORT_PAYMENT_ISSUE', 'PAYMENT_ISSUES', newIssueId, null, newIssue);
    try {
      await api.post('/payment-issues', newIssue);
    } catch(err) {}
  };

  const addReview = async (photographerId, rating, comment) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newReviewId = Date.now();
    const newReview = {
      review_id: newReviewId,
      user_id: currentUser.user_id,
      photographer_id: photographerId,
      rating: parseInt(rating),
      comment: comment,
      is_deleted: false,
      created_at: nowStr,
      user_name: currentUser.name,
      user_avatar: currentUser.profile_picture
    };
    
    setReviews(prev => [newReview, ...prev]);

    setPhotographers(prev => prev.map(p => {
      if (p.photographer_id === photographerId) {
        const pReviews = [...reviews.filter(r => r.photographer_id === photographerId), newReview];
        const avg = (pReviews.reduce((acc, curr) => acc + curr.rating, 0) / pReviews.length).toFixed(1);
        return { ...p, rating: parseFloat(avg) };
      }
      return p;
    }));

    addSystemLog('ADD_REVIEW', 'REVIEWS', newReviewId, null, newReview);

    try {
      await api.post('/reviews', newReview);
    } catch(err) {}
  };

  const verifyPhotographer = async (photographerId) => {
    setPhotographers(prev => prev.map(p => {
      if (p.photographer_id === photographerId) {
        const updated = { ...p, is_verified: !p.is_verified };
        addSystemLog('VERIFY_PHOTOGRAPHER', 'PHOTOGRAPHERS', photographerId, p.is_verified, updated.is_verified);
        return updated;
      }
      return p;
    }));
    try { await api.put(`/photographers/${photographerId}/verify`); } catch(err){}
  };

  const processRefund = async (refundId, isApproved) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setRefunds(prev => prev.map(r => {
      if (r.refund_id === refundId) {
        const updatedStatus = isApproved ? 'Approved' : 'Rejected';
        addSystemLog('PROCESS_REFUND', 'REFUNDS', refundId, r.refund_status, updatedStatus);
        setBookings(bPrev => bPrev.map(b => b.booking_id === r.booking_id ? { ...b, refund_status: updatedStatus } : b));
        return {
          ...r,
          refund_status: updatedStatus,
          approved_by_admin: currentUser.user_id,
          processed_at: nowStr
        };
      }
      return r;
    }));
    try { await api.put(`/refunds/${refundId}/process`, { isApproved }); } catch(err){}
  };

  const resolvePaymentIssue = async (issueId) => {
    setPaymentIssues(prev => prev.map(i => {
      if (i.issue_id === issueId) {
        addSystemLog('RESOLVE_PAYMENT_ISSUE', 'PAYMENT_ISSUES', issueId, 'Open', 'Resolved');
        return {
          ...i,
          status: 'Resolved',
          resolved_by_admin: currentUser.user_id
        };
      }
      return i;
    }));
    try { await api.put(`/payment-issues/${issueId}/resolve`); } catch(err){}
  };

  const addPackage = async (packageData) => {
    const newPackageId = Date.now();
    const newPackage = {
      package_id: newPackageId,
      photographer_id: packageData.photographer_id,
      name: packageData.name,
      description: packageData.description,
      price: parseFloat(packageData.price),
      duration_hours: parseInt(packageData.duration_hours),
      features: packageData.features,
      is_deleted: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setPackages(prev => [newPackage, ...prev]);
    addSystemLog('ADD_PACKAGE', 'PACKAGES', newPackageId, null, newPackage);
    try { await api.post('/packages', newPackage); } catch(err){}
  };

  const addPortfolioItem = async (portfolioData) => {
    const newId = Date.now();
    const newItem = {
      portfolio_id: newId,
      photographer_id: portfolioData.photographer_id,
      image_url: portfolioData.image_url,
      title: portfolioData.title,
      category: portfolioData.category,
      is_deleted: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setPortfolio(prev => [newItem, ...prev]);
    addSystemLog('ADD_PORTFOLIO', 'PORTFOLIO', newId, null, newItem);
    try { await api.post('/portfolio', newItem); } catch(err){}
  };

  return (
    <AppContext.Provider value={{
      users, setUsers,
      photographers, setPhotographers,
      studios, setStudios,
      packages, setPackages,
      portfolio, setPortfolio,
      bookings, setBookings,
      reviews, setReviews,
      payments, setPayments,
      refunds, setRefunds,
      paymentIssues, setPaymentIssues,
      systemLogs, setSystemLogs,
      isAuthenticated, loginUser, registerUser, logoutUser,
      currentUser, setCurrentUser, switchUserRole,
      activeTab, setActiveTab, activeTabParams, navigateToTab,
      selectedPhotographerModal, setSelectedPhotographerModal,
      activeBookingModal, setActiveBookingModal,
      authModal, setAuthModal,
      createBooking, cancelBooking, reportPaymentIssue, addReview,
      verifyPhotographer, processRefund, resolvePaymentIssue,
      addPackage, addPortfolioItem, addSystemLog,
      searchParams, setSearchParams,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
