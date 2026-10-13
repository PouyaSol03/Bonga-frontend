import { lazyNamed, type AppRoute } from './types'

const LoginPhonePage = lazyNamed(() => import('../../features/auth/LoginPhonePage'), 'LoginPhonePage')
const LoginVerifyPage = lazyNamed(() => import('../../features/auth/LoginVerifyPage'), 'LoginVerifyPage')
const LoginRequiredPage = lazyNamed(() => import('../../features/auth/LoginRequiredPage'), 'LoginRequiredPage')
const PaymentVerifyPage = lazyNamed(() => import('../../features/payments/PaymentVerifyPage'), 'PaymentVerifyPage')
const OnboardingPage = lazyNamed(() => import('../../features/onboarding/OnboardingPage'), 'OnboardingPage')
const AccessDeniedPage = lazyNamed(() => import('../../features/system/AccessDeniedPage'), 'AccessDeniedPage')

export const authRoutes: AppRoute[] = [
  { path: '/login', title: 'ورود', Component: LoginPhonePage },
  { path: '/login/phone', title: 'ورود', Component: LoginPhonePage },
  { path: '/login/verify', title: 'تایید کد ورود', Component: LoginVerifyPage },
  { path: '/login-required', title: 'ورود به حساب کاربری', Component: LoginRequiredPage },
  { path: '/payment/verify', title: 'نتیجه پرداخت', Component: PaymentVerifyPage, requiresAuth: true },
  { path: '/onboarding', title: 'راهنمای شروع', Component: OnboardingPage },
  { path: '/403', title: 'عدم دسترسی', Component: AccessDeniedPage },
]
