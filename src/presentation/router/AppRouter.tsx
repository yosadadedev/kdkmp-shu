import { Navigate, Route, Routes } from 'react-router-dom'
import { RoutePaths } from '@presentation/constants/routePaths'
import { OnboardingPage } from '@presentation/pages/OnboardingPage'
import { NationalIdLoginPage } from '@presentation/pages/NationalIdLoginPage'
import { OtpVerificationPage } from '@presentation/pages/OtpVerificationPage'
import { DashboardHomePage } from '@presentation/pages/DashboardHomePage'
import { VoteSuccessPage } from '@presentation/pages/VoteSuccessPage'
import { ProtectedRoute } from '@presentation/components/ProtectedRoute'
import { ToastViewport } from '@presentation/components/ui/Toast'
import { AppErrorBoundary } from '@presentation/components/AppErrorBoundary'

export function AppRouter() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route path={RoutePaths.HOME} element={<Navigate to={RoutePaths.ONBOARDING} replace />} />
        <Route path={RoutePaths.ONBOARDING} element={<OnboardingPage />} />
        <Route path={RoutePaths.NATIONAL_ID_LOGIN} element={<NationalIdLoginPage />} />
        <Route path={RoutePaths.OTP_VERIFICATION} element={<OtpVerificationPage />} />
        <Route
          path={RoutePaths.DASHBOARD_HOME}
          element={
            <ProtectedRoute>
              <DashboardHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutePaths.VOTE_SUCCESS}
          element={
            <ProtectedRoute>
              <VoteSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={RoutePaths.ONBOARDING} replace />} />
      </Routes>
      <ToastViewport />
    </AppErrorBoundary>
  )
}
