import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Mock Firebase config for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

// Check if we're in a browser environment and have valid Firebase config
const isValidConfig =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.warn("Firebase initialization failed, using mock services")
  }
}

// Export auth, db, and storage (will be null if Firebase isn't configured)
export { auth, db, storage }

// Service request functions with mock fallback
export async function saveServiceRequest(data: {
  userId: string
  service: string
  amount: number
  formData: any
  paymentId: string
  status: string
  paymentMethod?: string
}) {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "serviceRequests"), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error saving service request:", error)
      throw error
    }
  } else {
    // Mock implementation
    console.log("Mock: Saving service request", data)
    return `mock_${Date.now()}`
  }
}

export async function getUserRequests(userId: string) {
  if (db) {
    try {
      const q = query(collection(db, "serviceRequests"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }))
    } catch (error) {
      console.error("Error getting user requests:", error)
      throw error
    }
  } else {
    // Mock implementation
    console.log("Mock: Getting user requests for", userId)
    return [
      {
        id: "mock_1",
        service: "Direct Posting",
        status: "pending",
        amount: 25000,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "mock_2",
        service: "Relocation",
        status: "approved",
        amount: 20000,
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ]
  }
}

// Flutterwave payment processing
export async function processFlutterwavePayment(data: {
  amount: number
  email: string
  phone: string
  name: string
  service: string
  userId: string
}) {
  // In production, you would integrate with Flutterwave API
  // For now, we'll simulate the payment process

  return new Promise<{ success: boolean; transactionId: string; message?: string }>((resolve) => {
    setTimeout(() => {
      // Simulate payment processing
      const success = Math.random() > 0.1 // 90% success rate for demo

      if (success) {
        resolve({
          success: true,
          transactionId: `flw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })
      } else {
        resolve({
          success: false,
          transactionId: "",
          message: "Payment was declined. Please try again with a different payment method.",
        })
      }
    }, 3000) // Simulate 3 second processing time
  })
}

// Real Flutterwave integration function (commented out for demo)
/*
export async function processFlutterwavePayment(data: {
  amount: number
  email: string
  phone: string
  name: string
  service: string
  userId: string
}) {
  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `nysc_${data.userId}_${Date.now()}`,
        amount: data.amount,
        currency: 'NGN',
        redirect_url: `${window.location.origin}/payment/callback`,
        customer: {
          email: data.email,
          phonenumber: data.phone,
          name: data.name,
        },
        customizations: {
          title: 'NYSC Platform',
          description: data.service,
          logo: 'https://your-logo-url.com/logo.png',
        },
      }),
    })

    const result = await response.json()
    
    if (result.status === 'success') {
      // Redirect to Flutterwave payment page
      window.location.href = result.data.link
      return { success: true, transactionId: result.data.tx_ref }
    } else {
      throw new Error(result.message || 'Payment initialization failed')
    }
  } catch (error) {
    console.error('Flutterwave payment error:', error)
    throw error
  }
}
*/

// Mock payment processing (current implementation)
export async function processPayment(data: {
  amount: number
  email: string
  service: string
}) {
  // Simulate payment processing
  return new Promise<{ success: boolean; paymentId: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
    }, 2000)
  })
}
