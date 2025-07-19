import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { USER_ROLES, FIREBASE_COLLECTIONS } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Google OAuth Login
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile for Google OAuth users
        const userProfile = {
          uid: result.user.uid,
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: result.user.phoneNumber || '',
          role: USER_ROLES.CUSTOMER, // Default role for Google OAuth users
          profilePhoto: result.user.photoURL || '',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          emailVerified: result.user.emailVerified
        };

        await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid), userProfile);
        setUserProfile(userProfile);
      } else {
        // Update existing profile if needed
        const existingProfile = userDoc.data();
        const updatedProfile = {
          ...existingProfile,
          profilePhoto: result.user.photoURL || existingProfile.profilePhoto,
          emailVerified: result.user.emailVerified,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid), updatedProfile);
        setUserProfile(updatedProfile);
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Register function (for manual admin creation)
  const register = async (email, password, userData) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Save user profile to Firestore
      const userProfile = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        role: userData.role || USER_ROLES.CUSTOMER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid), userProfile);
      setUserProfile(userProfile);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Create customer account (auto registration after booking)
  const createCustomerAccount = async (customerData, tempPassword) => {
    try {
      setError(null);
      
      // Create auth account
      const result = await createUserWithEmailAndPassword(auth, customerData.email, tempPassword);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: `${customerData.firstName} ${customerData.lastName}`
      });

      // Save customer profile
      const customerProfile = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        role: USER_ROLES.CUSTOMER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isPasswordTemporary: true,
        registeredViaBooking: true
      };

      await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid), customerProfile);
      
      return { user: result.user, profile: customerProfile, tempPassword };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return true;
      }
      return false;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (user && userProfile) {
        const updatedProfile = {
          ...userProfile,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, user.uid), updatedProfile);
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);
  
  // Check if user is driver
  const isDriver = () => hasRole(USER_ROLES.DRIVER);
  
  // Check if user is customer
  const isCustomer = () => hasRole(USER_ROLES.CUSTOMER);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create basic profile if doesn't exist
            const basicProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              role: USER_ROLES.CUSTOMER,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            };
            await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, firebaseUser.uid), basicProfile);
            setUserProfile(basicProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Profile bilgileri alınamadı');
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    signInWithGoogle,
    register,
    createCustomerAccount,
    logout,
    signOut: logout, // Alias for logout
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    hasRole,
    isAdmin,
    isDriver,
    isCustomer,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
