import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { RoutePaths } from '@presentation/constants/routePaths'
import { OnboardingPage } from '@presentation/pages/OnboardingPage'
import { NationalIdLoginPage } from '@presentation/pages/NationalIdLoginPage'
import { OtpVerificationPage } from '@presentation/pages/OtpVerificationPage'
import { DashboardHomePage } from '@presentation/pages/DashboardHomePage'
import { VoteSuccessPage } from '@presentation/pages/VoteSuccessPage'
import { VotingLegalBasisPage } from '@presentation/pages/VotingLegalBasisPage'
import { GatePage } from '@presentation/pages/GatePage'
import { NotFoundPage } from '@presentation/pages/NotFoundPage'
import { GateProtectedRoute } from '@presentation/components/GateProtectedRoute'
import { ProtectedRoute } from '@presentation/components/ProtectedRoute'
import { ToastViewport } from '@presentation/components/ui/Toast'
import { AppErrorBoundary } from '@presentation/components/AppErrorBoundary'

export function AppRouter() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route
          element={
            <GateProtectedRoute>
              <Outlet />
            </GateProtectedRoute>
          }
        >
          <Route path={RoutePaths.HOME} element={<Navigate to={RoutePaths.ONBOARDING} replace />} />
          <Route path={RoutePaths.ONBOARDING} element={<OnboardingPage />} />
          <Route path={RoutePaths.NATIONAL_ID_LOGIN} element={<NationalIdLoginPage />} />
          <Route path={RoutePaths.OTP_VERIFICATION} element={<OtpVerificationPage />} />
          <Route
            path={RoutePaths.DASHBOARD_HOME}
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="vote/success" element={<VoteSuccessPage />} />
            <Route path="legal-basis" element={<VotingLegalBasisPage />} />
          </Route>
          <Route path="*" element={<Navigate to={RoutePaths.ONBOARDING} replace />} />
        </Route>
        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={RoutePaths.GATE} element={<GatePage />} />
      </Routes>
      <ToastViewport />
    </AppErrorBoundary>
  )
}
