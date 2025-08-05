import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Production Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
    // Save to localStorage for admin dashboard
    const requestData = {
      id: `request_${Date.now()}`,
      userId: data.userId,
      service: data.service,
      status: data.status,
      amount: data.amount,
      createdAt: new Date(),
      formData: data.formData,
      userEmail: data.formData?.customerInfo?.email || data.formData?.email || "N/A",
      phoneNumber: data.formData?.phoneNumber || data.formData?.customerInfo?.phoneNumber || "N/A",
      transactionId: data.paymentId,
      paymentMethod: data.paymentMethod || "bank_transfer",
      fullName: data.formData?.customerInfo?.fullName || data.formData?.fullName || "N/A",
    }

    // Get existing requests
    const existingRequests = localStorage.getItem("serviceRequests")
    const requests = existingRequests ? JSON.parse(existingRequests) : []
    
    // Add new request
    requests.unshift(requestData)
    
    // Save back to localStorage
    localStorage.setItem("serviceRequests", JSON.stringify(requests))
    
    console.log("Saved service request to localStorage:", requestData)
    return requestData.id
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
