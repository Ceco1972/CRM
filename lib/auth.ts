import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "./firebase"

export const createAccount = async (email: string, password: string): Promise<User> => {
  try {
    console.log("Attempting to create account for:", email)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log("Account created successfully:", userCredential.user.uid)
    return userCredential.user
  } catch (error: any) {
    console.error("Create account error:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    console.log("Attempting to sign in:", email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Sign in successful:", userCredential.user.uid)
    return userCredential.user
  } catch (error: any) {
    console.error("Sign in error:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
    console.log("Sign out successful")
  } catch (error: any) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    console.log("Sending password reset email to:", email)
    await sendPasswordResetEmail(auth, email)
    console.log("Password reset email sent successfully")
  } catch (error: any) {
    console.error("Password reset error:", error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? `User: ${user.email}` : "No user")
    callback(user)
  })
}

const getAuthErrorMessage = (errorCode: string): string => {
  console.log("Processing error code:", errorCode)
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address"
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password"
    case "auth/email-already-in-use":
      return "An account with this email already exists"
    case "auth/weak-password":
      return "Password should be at least 6 characters"
    case "auth/invalid-email":
      return "Please enter a valid email address"
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later"
    case "auth/user-disabled":
      return "This account has been disabled"
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again"
    case "auth/internal-error":
      return "Internal error. Please try again"
    case "auth/invalid-api-key":
      return "Invalid API key. Please contact support"
    case "auth/app-deleted":
      return "Firebase app has been deleted. Please contact support"
    default:
      return `Authentication error (${errorCode}). Please try again or contact support`
  }
}
