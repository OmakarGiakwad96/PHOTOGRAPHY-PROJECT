package com.photohub.controller;

import com.photohub.dto.*;
import com.photohub.security.CustomUserDetails;
import com.photohub.security.JwtTokenProvider;
import com.photohub.service.AuthService;
import com.photohub.service.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtAuthenticationResponse(
                jwt,
                userDetails.getId(),
                userDetails.getAuthorities().iterator().next().getAuthority(),
                userDetails.getName()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            Object user = authService.registerUser(registerRequest);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Dispatches an OTP challenge to a phone number or email address.
     */
    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequestDto request, HttpServletRequest servletRequest) {
        try {
            String clientIp = servletRequest.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isEmpty()) {
                clientIp = servletRequest.getRemoteAddr();
            } else if (clientIp.contains(",")) {
                clientIp = clientIp.split(",")[0].trim();
            }

            Map<String, Object> result = otpService.createAndSendOtp(
                    request.getIdentifier(),
                    request.getChannel(),
                    request.getPurpose(),
                    clientIp
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Verifies an OTP challenge code.
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyDto request) {
        try {
            boolean success = otpService.verifyOtp(
                    request.getIdentifier(),
                    request.getPurpose(),
                    request.getOtp()
            );
            return ResponseEntity.ok(Map.of("success", success, "message", "Code verified successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Initiates forgot-password workflow. Enforces anti-enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDto request, HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = servletRequest.getRemoteAddr();
        } else if (clientIp.contains(",")) {
            clientIp = clientIp.split(",")[0].trim();
        }

        Map<String, Object> result = authService.initiateForgotPassword(request, clientIp);
        return ResponseEntity.ok(result);
    }

    /**
     * Validates a password reset token from an email link.
     */
    @GetMapping("/verify-reset-token")
    @PostMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam(required = false) String token, @RequestBody(required = false) Map<String, String> body) {
        try {
            String tokenValue = token;
            if ((tokenValue == null || tokenValue.isEmpty()) && body != null && body.containsKey("token")) {
                tokenValue = body.get("token");
            }
            Map<String, Object> result = authService.validateResetToken(tokenValue);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Completes password reset with new password after token or OTP verification.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDto request) {
        try {
            Map<String, Object> result = authService.completePasswordReset(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String email, @RequestParam String newPassword) {
        authService.changePassword(email, newPassword);
        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
    }
}
