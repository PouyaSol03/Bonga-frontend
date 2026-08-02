import { useMutation } from "@tanstack/react-query";

import { logout, requestOtp, resendOtp, verifyOtp } from "../services/auth.service";

export function useRequestOtpMutation() {
  return useMutation({
    mutationFn: requestOtp,
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: verifyOtp,
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: resendOtp,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logout,
  });
}
